from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from database import get_connection
from google import genai
from dotenv import load_dotenv
import os

app = FastAPI()

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


@app.get("/test-db")
def test_database():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM places")
    places = cursor.fetchall()

    cursor.close()
    connection.close()

    return {"places": places}


@app.post("/safety/report")
def create_safety_report(
    user_id: int,
    place_id: int,
    report_type: str,
    description: str
):
    connection = get_connection()
    cursor = connection.cursor()

    query = """
        INSERT INTO safety_reports
        (user_id, place_id, report_type, description)
        VALUES (%s, %s, %s, %s)
    """

    values = (user_id, place_id, report_type, description)

    cursor.execute(query, values)
    connection.commit()

    cursor.close()
    connection.close()

    return {"message": "Safety report submitted successfully!"}

@app.get("/safety/reports")
def get_safety_reports():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM safety_reports")
    reports = cursor.fetchall()

    cursor.close()
    connection.close()

    return {"safety_reports": reports}

@app.post("/crowd/update")
def update_crowd(
    place_id: int,
    crowd_level: str,
    visitor_count: int
):
    connection = get_connection()
    cursor = connection.cursor()

    query = """
        INSERT INTO crowd_data
        (place_id, crowd_level, visitor_count)
        VALUES (%s, %s, %s)
    """

    values = (place_id, crowd_level, visitor_count)

    cursor.execute(query, values)
    connection.commit()

    cursor.close()
    connection.close()

    return {"message": "Crowd data updated successfully!"}

@app.get("/crowd/{place_id}")
def get_crowd(place_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    query = """
        SELECT *
        FROM crowd_data
        WHERE place_id = %s
        ORDER BY recorded_at DESC
    """

    cursor.execute(query, (place_id,))
    crowd_data = cursor.fetchall()

    cursor.close()
    connection.close()

    return {"crowd_data": crowd_data}



client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


@app.post("/itinerary/generate")
def generate_itinerary(
    user_id: int,
    destination: str,
    days: int,
    interests: str
):
    prompt = f"""
    Create a {days}-day travel itinerary for {destination}.

    User interests: {interests}

    Give a practical day-by-day itinerary.
    Include places to visit, approximate timing, and short descriptions.
    Keep it suitable for a tourist.
    """

    response = client.models.generate_content(
    model="gemini-3.6-flash",
    contents=prompt
)

    itinerary = response.text

    connection = get_connection()
    cursor = connection.cursor()

    query = """
        INSERT INTO itineraries
        (user_id, destination, days, interests, itinerary)
        VALUES (%s, %s, %s, %s, %s)
    """

    values = (user_id, destination, days, interests, itinerary)

    cursor.execute(query, values)
    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "AI itinerary generated successfully!",
        "itinerary": itinerary
    }


@app.get("/itinerary/{user_id}")
def get_itineraries(user_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    query = """
        SELECT *
        FROM itineraries
        WHERE user_id = %s
        ORDER BY created_at DESC
    """

    cursor.execute(query, (user_id,))
    itineraries = cursor.fetchall()

    cursor.close()
    connection.close()

    return {"itineraries": itineraries}