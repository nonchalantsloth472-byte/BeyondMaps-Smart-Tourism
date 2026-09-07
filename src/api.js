const API_URL = "http://127.0.0.1:8000";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }

  return data;
}

export async function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function signup(name, email, password, phone = null) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
      phone,
    }),
  });
}

export async function getMyProfile(token) {
  return request("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function generateItinerary(token, destination, days) {
  return request("/itinerary/generate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      destination,
      days: Number(days),
    }),
  });
}

export async function getMyItineraries(token) {
  return request("/itinerary", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
