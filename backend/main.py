from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from passlib.context import CryptContext
from fastapi.responses import HTMLResponse
from database import get_connection
from google import genai
from dotenv import load_dotenv
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
import os
import json

load_dotenv()

app = FastAPI()

# ---------------------------------------------------------------
# CORS - required so the React frontend (different origin/port)
# can call this API. Adjust allow_origins to match your actual
# frontend dev URL (e.g. http://localhost:5173 for Vite,
# http://localhost:3000 for CRA) and your deployed frontend URL.
# ---------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        # add your deployed frontend origin here later
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is missing from .env")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

security = HTTPBearer()


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token"
            )

        return int(user_id)

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired authentication token"
        )


class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    phone: str | None = None


class PreferencesRequest(BaseModel):
    gender: str | None = None
    age_group: str | None = None
    home_city: str | None = None
    interests: list | None = None
    travel_style: str | None = None
    travel_pace: str | None = None
    crowd_preference: str | None = None
    budget_style: str | None = None
    accommodation: str | None = None
    food_preference: list | None = None
    activities: list | None = None
    transport: list | None = None
    travel_companions: str | None = None
    safety_priority: str | None = None
    accessibility: list | None = None


@app.get("/", response_class=HTMLResponse)
def home():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Tourism Live Location</title>
    </head>

    <body>
        <h1>📍 Tourism Live Location</h1>
        <button onclick="getLocation()">Get My Location</button>

        <p id="result">Location not detected yet.</p>

        <script>
            function getLocation() {

                if (!navigator.geolocation) {
                    document.getElementById("result").innerText =
                        "Geolocation is not supported by this browser.";
                    return;
                }

                navigator.geolocation.getCurrentPosition(
                    function(position) {

                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;

                        document.getElementById("result").innerText =
                            "Latitude: " + latitude +
                            " | Longitude: " + longitude;
                    },

                    function(error) {
                        document.getElementById("result").innerText =
                            "Unable to get location: " + error.message;
                    }
                );
            }
        </script>
    </body>
    </html>
    """


@app.post("/auth/signup")
def signup(user: SignupRequest):

    connection = get_connection()
    cursor = connection.cursor()

    try:
        # Check if email already exists
        cursor.execute(
            "SELECT user_id FROM users WHERE email = %s",
            (user.email,)
        )

        existing_user = cursor.fetchone()

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        # Hash password
        password_hash = pwd_context.hash(user.password)

        # Insert user
        query = """
            INSERT INTO users
            (name, email, phone, password_hash)
            VALUES (%s, %s, %s, %s)
        """

        cursor.execute(
            query,
            (user.name, user.email, user.phone, password_hash)
        )

        connection.commit()

        user_id = cursor.lastrowid

        return {
            "message": "Signup successful",
            "user_id": user_id,
            "name": user.name,
            "email": user.email
        }

    finally:
        cursor.close()
        connection.close()


class LoginRequest(BaseModel):
    email: str
    password: str


def create_access_token(user_id: int):
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "user_id": user_id,
        "exp": expire
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


@app.post("/auth/login")
def login(user: LoginRequest):

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT * FROM users WHERE email = %s",
            (user.email,)
        )

        db_user = cursor.fetchone()

        if not db_user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        if not pwd_context.verify(
            user.password,
            db_user["password_hash"]
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        access_token = create_access_token(
            db_user["user_id"]
        )

        return {
            "message": "Login successful",
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": db_user["user_id"],
            "name": db_user["name"],
            "email": db_user["email"]
        }

    finally:
        cursor.close()
        connection.close()


@app.get("/users/me")
def get_my_profile(
    user_id: int = Depends(get_current_user_id)
):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT
                user_id,
                name,
                email,
                phone,
                is_verified,
                created_at
            FROM users
            WHERE user_id = %s
            """,
            (user_id,)
        )

        user = cursor.fetchone()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        return {
            "user_id": user["user_id"],
            "name": user["name"],
            "email": user["email"],
            "phone": user["phone"],
            "is_verified": bool(user["is_verified"]),
            "created_at": user["created_at"]
        }

    finally:
        cursor.close()
        connection.close()


@app.post("/users/preferences")
def create_preferences(
    preferences: PreferencesRequest,
    user_id: int = Depends(get_current_user_id)
):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT preference_id
            FROM user_preferences
            WHERE user_id = %s
            """,
            (user_id,)
        )

        if cursor.fetchone():
            raise HTTPException(
                status_code=409,
                detail="Preferences already exist. Use PUT to update them."
            )

        cursor.execute(
            """
            INSERT INTO user_preferences (
                user_id,
                gender,
                age_group,
                home_city,
                interests,
                travel_style,
                travel_pace,
                crowd_preference,
                budget_style,
                accommodation,
                food_preference,
                activities,
                transport,
                travel_companions,
                safety_priority,
                accessibility
            )
            VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s, %s, %s
            )
            """,
            (
                user_id,
                preferences.gender,
                preferences.age_group,
                preferences.home_city,
                json.dumps(preferences.interests),
                preferences.travel_style,
                preferences.travel_pace,
                preferences.crowd_preference,
                preferences.budget_style,
                preferences.accommodation,
                json.dumps(preferences.food_preference),
                json.dumps(preferences.activities),
                json.dumps(preferences.transport),
                preferences.travel_companions,
                preferences.safety_priority,
                json.dumps(preferences.accessibility)
            )
        )

        conn.commit()

        return {
            "message": "Preferences saved successfully"
        }

    finally:
        cursor.close()
        conn.close()


@app.get("/users/preferences")
def get_preferences(
    user_id: int = Depends(get_current_user_id)
):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT *
            FROM user_preferences
            WHERE user_id = %s
            """,
            (user_id,)
        )

        preferences = cursor.fetchone()

        if not preferences:
            raise HTTPException(
                status_code=404,
                detail="Preferences not found"
            )

        for field in [
            "interests",
            "food_preference",
            "activities",
            "transport",
            "accessibility"
        ]:
            if preferences[field]:
                preferences[field] = json.loads(preferences[field])

        return preferences

    finally:
        cursor.close()
        conn.close()


@app.put("/users/preferences")
def update_preferences(
    preferences: PreferencesRequest,
    user_id: int = Depends(get_current_user_id)
):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            UPDATE user_preferences
            SET
                gender = %s,
                age_group = %s,
                home_city = %s,
                interests = %s,
                travel_style = %s,
                travel_pace = %s,
                crowd_preference = %s,
                budget_style = %s,
                accommodation = %s,
                food_preference = %s,
                activities = %s,
                transport = %s,
                travel_companions = %s,
                safety_priority = %s,
                accessibility = %s
            WHERE user_id = %s
            """,
            (
                preferences.gender,
                preferences.age_group,
                preferences.home_city,
                json.dumps(preferences.interests),
                preferences.travel_style,
                preferences.travel_pace,
                preferences.crowd_preference,
                preferences.budget_style,
                preferences.accommodation,
                json.dumps(preferences.food_preference),
                json.dumps(preferences.activities),
                json.dumps(preferences.transport),
                preferences.travel_companions,
                preferences.safety_priority,
                json.dumps(preferences.accessibility),
                user_id
            )
        )

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Preferences not found"
            )

        conn.commit()

        return {
            "message": "Preferences updated successfully"
        }

    finally:
        cursor.close()
        conn.close()


# -----------------------------------------------------------------
# IMPORTANT: /places/search must be declared BEFORE /places/{place_id}
# Otherwise FastAPI tries to match "search" against the {place_id}:int
# path parameter first and returns a 422 error instead of ever
# reaching this route.
# -----------------------------------------------------------------
@app.get("/places/search")
def search_places(
    city: str | None = None,
    category: str | None = None
):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = """
            SELECT
                place_id,
                name,
                city,
                description,
                latitude,
                longitude,
                category,
                image_url,
                best_time,
                safety_score
            FROM places
            WHERE 1=1
        """

        values = []

        if city:
            query += " AND city = %s"
            values.append(city)

        if category:
            query += " AND category = %s"
            values.append(category)

        query += " ORDER BY place_id"

        cursor.execute(query, tuple(values))

        return cursor.fetchall()

    finally:
        cursor.close()
        conn.close()


@app.get("/places")
def get_places():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT
                place_id,
                name,
                city,
                description,
                latitude,
                longitude,
                category,
                image_url,
                best_time,
                safety_score
            FROM places
            ORDER BY place_id
        """)

        return cursor.fetchall()

    finally:
        cursor.close()
        conn.close()


@app.get("/places/{place_id}")
def get_place(place_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT
                place_id,
                name,
                city,
                description,
                latitude,
                longitude,
                category,
                image_url,
                best_time,
                safety_score
            FROM places
            WHERE place_id = %s
        """, (place_id,))

        place = cursor.fetchone()

        if not place:
            raise HTTPException(
                status_code=404,
                detail="Place not found"
            )

        return place

    finally:
        cursor.close()
        conn.close()


class SendOTPRequest(BaseModel):
    email: str


class VerifyOTPRequest(BaseModel):
    email: str
    otp: str


@app.post("/auth/send-otp")
def send_otp(data: SendOTPRequest):

    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            "SELECT user_id FROM users WHERE email = %s",
            (data.email,)
        )

        user = cursor.fetchone()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        # Demo OTP - replace with a real provider (Twilio Verify / MSG91)
        # before production. See Phase 8 in the project roadmap.
        otp = "123456"

        return {
            "message": "OTP sent successfully",
            "demo_otp": otp
        }

    finally:
        cursor.close()
        connection.close()


@app.post("/auth/verify-otp")
def verify_otp(data: VerifyOTPRequest):

    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            "SELECT user_id FROM users WHERE email = %s",
            (data.email,)
        )

        user = cursor.fetchone()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        if data.otp != "123456":
            raise HTTPException(
                status_code=400,
                detail="Invalid OTP"
            )

        cursor.execute(
            """
            UPDATE users
            SET is_verified = 1
            WHERE email = %s
            """,
            (data.email,)
        )

        connection.commit()

        return {
            "message": "OTP verified successfully",
            "user_id": user[0],
            "is_verified": True
        }

    finally:
        cursor.close()
        connection.close()


class GoogleLoginRequest(BaseModel):
    google_id: str
    email: str
    name: str


@app.post("/auth/google")
def google_login(user: GoogleLoginRequest):
    # NOTE: this endpoint currently trusts the google_id/email/name sent
    # directly by the client - it does NOT verify with Google. Replace
    # with real Google ID-token verification before production
    # (see Phase 9 in the project roadmap).

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # Check whether this Google account already exists
        cursor.execute(
            "SELECT * FROM users WHERE google_id = %s",
            (user.google_id,)
        )

        existing_user = cursor.fetchone()

        if existing_user:
            return {
                "message": "Google login successful",
                "user_id": existing_user["user_id"],
                "name": existing_user["name"],
                "email": existing_user["email"]
            }

        # Check whether the email already exists
        cursor.execute(
            "SELECT * FROM users WHERE email = %s",
            (user.email,)
        )

        existing_email = cursor.fetchone()

        if existing_email:

            cursor.execute(
                """
                UPDATE users
                SET google_id = %s,
                    is_verified = 1
                WHERE email = %s
                """,
                (user.google_id, user.email)
            )

            connection.commit()

            user_id = existing_email["user_id"]

        else:

            cursor.execute(
                """
                INSERT INTO users
                (name, email, google_id, is_verified)
                VALUES (%s, %s, %s, %s)
                """,
                (user.name, user.email, user.google_id, 1)
            )

            connection.commit()

            user_id = cursor.lastrowid

        return {
            "message": "Google login successful",
            "user_id": user_id,
            "name": user.name,
            "email": user.email
        }

    finally:
        cursor.close()
        connection.close()


@app.post("/safety/report")
def create_safety_report(
    place_id: int,
    report_type: str,
    description: str,
    user_id: int = Depends(get_current_user_id)
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        query = """
            INSERT INTO safety_reports
            (user_id, place_id, report_type, description)
            VALUES (%s, %s, %s, %s)
        """

        values = (user_id, place_id, report_type, description)

        cursor.execute(query, values)
        connection.commit()

        return {"message": "Safety report submitted successfully!"}

    finally:
        cursor.close()
        connection.close()


@app.get("/safety/reports")
def get_safety_reports():
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT * FROM safety_reports")
        reports = cursor.fetchall()

        return {"safety_reports": reports}

    finally:
        cursor.close()
        connection.close()


@app.post("/crowd/update")
def update_crowd(
    place_id: int,
    crowd_level: str,
    visitor_count: int,
    user_id: int = Depends(get_current_user_id)
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        query = """
            INSERT INTO crowd_data
            (place_id, crowd_level, visitor_count)
            VALUES (%s, %s, %s)
        """

        values = (place_id, crowd_level, visitor_count)

        cursor.execute(query, values)
        connection.commit()

        return {"message": "Crowd data updated successfully!"}

    finally:
        cursor.close()
        connection.close()


@app.get("/crowd/{place_id}")
def get_place_crowd(place_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT
                p.place_id,
                p.name,
                p.city,
                c.crowd_level,
                c.visitor_count,
                c.recorded_at
            FROM places p
            LEFT JOIN crowd_data c
                ON p.place_id = c.place_id
            WHERE p.place_id = %s
            ORDER BY c.recorded_at DESC
            LIMIT 1
        """, (place_id,))

        result = cursor.fetchone()

        if not result:
            raise HTTPException(
                status_code=404,
                detail="Place not found"
            )

        return result

    finally:
        cursor.close()
        conn.close()


@app.get("/crowd/{place_id}/forecast")
def get_crowd_forecast(place_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT
                forecast_id,
                place_id,
                forecast_time,
                predicted_crowd
            FROM crowd_forecasts
            WHERE place_id = %s
              AND forecast_time >= NOW()
            ORDER BY forecast_time
        """, (place_id,))

        return cursor.fetchall()

    finally:
        cursor.close()
        conn.close()


@app.get("/places/{place_id}/alternatives")
def get_place_alternatives(place_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT
                pa.alternative_id,
                p.place_id,
                p.name,
                p.city,
                p.description,
                p.category,
                pa.crowd_reduction,
                pa.distance_km
            FROM place_alternatives pa
            JOIN places p
                ON pa.alternative_place_id = p.place_id
            WHERE pa.place_id = %s
            ORDER BY pa.crowd_reduction DESC
        """, (place_id,))

        return cursor.fetchall()

    finally:
        cursor.close()
        conn.close()


client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class ItineraryRequest(BaseModel):
    destination: str
    days: int


@app.post("/itinerary/generate")
def generate_itinerary(
    request: ItineraryRequest,
    user_id: int = Depends(get_current_user_id)
):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # ---------------------------------------------------
        # 1. Get user's saved preferences
        # ---------------------------------------------------
        cursor.execute(
            """
            SELECT *
            FROM user_preferences
            WHERE user_id = %s
            """,
            (user_id,)
        )

        preferences = cursor.fetchone()

        if not preferences:
            raise HTTPException(
                status_code=404,
                detail="Please save your travel preferences first."
            )

        # ---------------------------------------------------
        # 2. Get places in the requested destination
        # ---------------------------------------------------
        cursor.execute(
            """
            SELECT
                place_id,
                name,
                city,
                description,
                latitude,
                longitude,
                category,
                best_time,
                safety_score
            FROM places
            WHERE LOWER(city) = LOWER(%s)
            """,
            (request.destination,)
        )

        places = cursor.fetchall()

        if not places:
            raise HTTPException(
                status_code=404,
                detail="No places found for this destination."
            )

        # ---------------------------------------------------
        # 3. Get latest crowd information
        # ---------------------------------------------------
        for place in places:

            cursor.execute(
                """
                SELECT
                    crowd_level,
                    visitor_count,
                    recorded_at
                FROM crowd_data
                WHERE place_id = %s
                ORDER BY recorded_at DESC
                LIMIT 1
                """,
                (place["place_id"],)
            )

            place["crowd"] = cursor.fetchone()

            # ------------------------------------------------
            # 4. Get future crowd forecasts
            # ------------------------------------------------
            cursor.execute(
                """
                SELECT
                    forecast_time,
                    predicted_crowd
                FROM crowd_forecasts
                WHERE place_id = %s
                  AND forecast_time >= NOW()
                ORDER BY forecast_time
                LIMIT 10
                """,
                (place["place_id"],)
            )

            place["forecasts"] = cursor.fetchall()

            # ------------------------------------------------
            # 5. Get alternative places
            # ------------------------------------------------
            cursor.execute(
                """
                SELECT
                    p.name AS alternative_name,
                    pa.crowd_reduction,
                    pa.distance_km
                FROM place_alternatives pa
                JOIN places p
                    ON pa.alternative_place_id = p.place_id
                WHERE pa.place_id = %s
                ORDER BY pa.crowd_reduction DESC
                """,
                (place["place_id"],)
            )

            place["alternatives"] = cursor.fetchall()

        # ---------------------------------------------------
        # 6. Prepare preferences for Gemini
        # ---------------------------------------------------
        preference_data = {
            "gender": preferences["gender"],
            "age_group": preferences["age_group"],
            "home_city": preferences["home_city"],
            "interests": preferences["interests"],
            "travel_style": preferences["travel_style"],
            "travel_pace": preferences["travel_pace"],
            "crowd_preference": preferences["crowd_preference"],
            "budget_style": preferences["budget_style"],
            "accommodation": preferences["accommodation"],
            "food_preference": preferences["food_preference"],
            "activities": preferences["activities"],
            "transport": preferences["transport"],
            "travel_companions": preferences["travel_companions"],
            "safety_priority": preferences["safety_priority"],
            "accessibility": preferences["accessibility"]
        }

        # ---------------------------------------------------
        # 7. Build Gemini prompt
        # ---------------------------------------------------
        prompt = f"""
You are the itinerary planning engine for BeyondMaps.

Create a practical {request.days}-day itinerary for:
Destination: {request.destination}

USER PREFERENCES:
{json.dumps(preference_data, default=str, indent=2)}

AVAILABLE PLACES AND LIVE TRAVEL DATA:
{json.dumps(places, default=str, indent=2)}

Instructions:

1. Personalize the itinerary using the user's saved preferences.
2. Only recommend places that appear in the provided places data.
3. Consider the available crowd information and forecasts.
4. If a place is expected to be crowded and a suitable alternative is available,
   prefer the alternative when appropriate for the user's crowd preference.
5. Respect the user's travel pace.
6. Respect food preferences and activity preferences.
7. Consider safety priority when arranging activities.
8. Group geographically sensible places together when possible.
9. Provide approximate times for each activity.
10. Avoid unrealistic schedules.
11. Do not invent crowd statistics, safety scores, or alternative relationships.
12. If information is missing from the provided data, simply work around it.
13. Give a clear day-by-day itinerary.
14. Include short explanations for why major places were selected.
15. Keep the itinerary practical for a real tourist.

Return only the itinerary.
"""

        # ---------------------------------------------------
        # 8. Generate itinerary with Gemini
        # ---------------------------------------------------
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        itinerary = response.text

        # ---------------------------------------------------
        # 9. Save generated itinerary
        # ---------------------------------------------------
        interests = preferences["interests"]

        if isinstance(interests, (list, dict)):
            interests = json.dumps(interests)

        cursor.execute(
            """
            INSERT INTO itineraries
            (
                user_id,
                destination,
                days,
                interests,
                itinerary
            )
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                user_id,
                request.destination,
                request.days,
                interests,
                itinerary
            )
        )

        connection.commit()

        return {
            "message": "AI itinerary generated successfully!",
            "destination": request.destination,
            "days": request.days,
            "itinerary": itinerary
        }

    finally:
        cursor.close()
        connection.close()


@app.get("/itinerary")
def get_my_itineraries(
    user_id: int = Depends(get_current_user_id)
):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT
                itinerary_id,
                destination,
                days,
                interests,
                itinerary,
                created_at
            FROM itineraries
            WHERE user_id = %s
            ORDER BY created_at DESC
            """,
            (user_id,)
        )

        itineraries = cursor.fetchall()

        return {
            "itineraries": itineraries
        }

    finally:
        cursor.close()
        connection.close()
