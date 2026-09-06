const places = {
  history: [
    {
      time: "08:00 AM",
      place: "Amber Palace",
      duration: "2 hours",
      crowd: 89,
      safety: 84,
      category: "History",
      history:
        "Amber Palace was commissioned by Maharaja Man Singh I in 1592 and is one of Jaipur's major Rajput-era landmarks.",
      elevation: "1,307 m",
      visitingHours: "9:00 AM – 6:00 PM",
      bestTime: "8:00 AM – 10:00 AM",
      description:
        "Explore Jaipur's iconic hilltop palace and its grand courtyards, halls and architecture.",
    },
    {
      time: "10:30 AM",
      place: "Jaigarh Fort",
      duration: "1.5 hours",
      crowd: 31,
      safety: 91,
      category: "History",
      history:
        "Jaigarh Fort was commissioned by Maharaja Jai Singh II in 1726 and was built to protect the Amber region.",
      elevation: "Approx. 400 m above Amer",
      visitingHours: "9:00 AM – 6:30 PM",
      bestTime: "10:00 AM – 12:00 PM",
      description:
        "A massive hilltop fort known for its military architecture and panoramic views.",
      isAlternative: true,
      alternativeFor: "Amber Palace",
      reason:
        "Similar heritage experience with significantly lower predicted crowd.",
      distance: "6.2 km",
    },
  ],

  food: [
    {
      time: "11:00 AM",
      place: "Johari Bazaar",
      duration: "2 hours",
      crowd: 54,
      safety: 82,
      category: "Food & Culture",
      history:
        "One of Jaipur's historic markets, known for jewellery, textiles and traditional local shopping.",
      elevation: "Approx. 430 m",
      visitingHours: "Approx. 10:00 AM – 8:00 PM",
      bestTime: "11:00 AM – 1:00 PM",
      description:
        "Taste local food while exploring colourful streets, jewellery shops and traditional markets.",
    },
    {
      time: "02:00 PM",
      place: "Masala Chowk",
      duration: "1.5 hours",
      crowd: 38,
      safety: 88,
      category: "Food",
      history:
        "Masala Chowk brings together several traditional Jaipur food favourites in one open-air setting.",
      elevation: "Approx. 430 m",
      visitingHours: "11:00 AM – 10:00 PM",
      bestTime: "2:00 PM – 4:00 PM",
      description:
        "Sample popular Rajasthani street food and local specialities.",
    },
  ],

  culture: [
    {
      time: "10:00 AM",
      place: "Anokhi Museum of Hand Printing",
      duration: "1.5 hours",
      crowd: 24,
      safety: 94,
      category: "Culture",
      history:
        "The museum celebrates Rajasthan's traditional hand block printing and preserves its textile heritage.",
      elevation: "Approx. 430 m",
      visitingHours: "10:30 AM – 5:00 PM",
      bestTime: "10:30 AM – 12:30 PM",
      description:
        "Discover traditional hand-block printing techniques and Rajasthan's textile heritage.",
    },
    {
      time: "04:00 PM",
      place: "Jawahar Kala Kendra",
      duration: "2 hours",
      crowd: 28,
      safety: 95,
      category: "Arts & Culture",
      history:
        "A major cultural centre dedicated to Rajasthan's arts, crafts, theatre and cultural heritage.",
      elevation: "Approx. 430 m",
      visitingHours: "10:00 AM – 6:00 PM",
      bestTime: "4:00 PM – 6:00 PM",
      description:
        "Explore exhibitions, performances and spaces dedicated to Rajasthan's arts and culture.",
    },
  ],

  nature: [
    {
      time: "08:00 AM",
      place: "Nahargarh Fort",
      duration: "2 hours",
      crowd: 42,
      safety: 88,
      category: "History & Nature",
      history:
        "Nahargarh Fort was built in 1734 and formed part of Jaipur's defensive network.",
      elevation: "Approx. 700 m",
      visitingHours: "10:00 AM – 6:00 PM",
      bestTime: "8:00 AM – 10:00 AM",
      description:
        "Enjoy hilltop views of Jaipur while exploring the historic fort.",
    },
    {
      time: "11:00 AM",
      place: "Jal Mahal",
      duration: "1 hour",
      crowd: 35,
      safety: 90,
      category: "Nature",
      history:
        "Jal Mahal is a historic palace situated in the middle of Man Sagar Lake.",
      elevation: "Approx. 430 m",
      visitingHours: "Viewpoint accessible throughout the day",
      bestTime: "7:00 AM – 9:00 AM",
      description:
        "Enjoy views of the palace surrounded by the lake and the Aravalli landscape.",
    },
  ],
};

export const generateMockItinerary = (form) => {
  const days = Number(form.days) || 2;

  let selected = [];

  // Choose places based on interests
  if (form.interests?.includes("Food")) {
    selected.push(...places.food);
  }

  if (form.interests?.includes("Nature")) {
    selected.push(...places.nature);
  }

  if (form.interests?.includes("Culture")) {
    selected.push(...places.culture);
  }

  if (form.interests?.includes("History")) {
    selected.push(...places.history);
  }

  // If nothing selected, give a balanced trip
  if (selected.length === 0) {
    selected = [
      ...places.history,
      ...places.food,
      ...places.culture,
    ];
  }

  // Crowd preference
  if (form.crowdPreference === "Less crowded") {
    selected = [...selected].sort((a, b) => a.crowd - b.crowd);
  }

  if (form.crowdPreference === "Popular spots") {
    selected = [...selected].sort((a, b) => b.crowd - a.crowd);
  }

  // Limit number of stops according to trip duration
  const maxStops = Math.max(3, days * 3);

  selected = selected.slice(0, maxStops);

  // Distribute activities across days
  const itinerary = [];

  for (let day = 1; day <= days; day++) {
    const start = Math.floor(((day - 1) * selected.length) / days);
    const end = Math.floor((day * selected.length) / days);

    const activities = selected.slice(start, end);

    if (activities.length > 0) {
      itinerary.push({
        day,
        activities,
      });
    }
  }

  return {
    destination: form.destination || "Jaipur",
    days,
    budget: Number(form.budget) || 5000,
    itinerary,
  };
};

export const mockItinerary = generateMockItinerary({
  destination: "Jaipur",
  days: 2,
  budget: 5000,
  interests: ["History", "Culture"],
  crowdPreference: "Less crowded",
});