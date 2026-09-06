// Shared destination intelligence data.
// Mock frontend data — can later be replaced by backend/API response.

export const destinations = [
  {
    name: "Rajasthan",
    region: "North West India",
    zone: "west",
    coords: { x: 43, y: 30 },
    category: "HERITAGE",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=85",
    description:
      "Forts, desert landscapes, living craft traditions and stories beyond the famous landmarks.",
    crowd: 31,
    safety: 88,
    distance: "6.2 km",
    bestTime: "08:00–10:00",
    alternative: "Jaigarh Fort",
    altCrowd: 9,
    altReason:
      "Similar heritage experience with significantly lower predicted crowd.",
  },
  {
    name: "Varanasi",
    region: "North India",
    zone: "north",
    coords: { x: 58, y: 38 },
    category: "CULTURE",
    image:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1400&q=85",
    description:
      "Ancient streets, living traditions and a city whose best stories aren't always on the postcard.",
    crowd: 24,
    safety: 79,
    distance: "2.8 km",
    bestTime: "05:30–07:00",
    alternative: "Ramnagar Heritage Trail",
    altCrowd: 6,
    altReason:
      "The same riverside ritual, without the crowd pressing in.",
  },
  {
    name: "Kerala",
    region: "South India",
    zone: "south",
    coords: { x: 43, y: 78 },
    category: "SLOW TRAVEL",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=85",
    description:
      "Backwaters, coastal communities, local food and journeys that move at their own pace.",
    crowd: 36,
    safety: 91,
    distance: "14 km",
    bestTime: "16:00–18:00",
    alternative: "Fort Kochi Art Walk",
    altCrowd: 14,
    altReason:
      "Same coastal culture, a fraction of the houseboat traffic.",
  },
  {
    name: "Leh",
    region: "Himalayas",
    zone: "north",
    coords: { x: 53, y: 14 },
    category: "ADVENTURE",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=85",
    description:
      "High-altitude landscapes, mountain villages and quieter routes through the Himalayas.",
    crowd: 18,
    safety: 85,
    distance: "148 km",
    bestTime: "06:00–08:00",
    alternative: "Sham Valley",
    altCrowd: 5,
    altReason:
      "The same high-altitude drama, largely untouched by tour buses.",
  },
  {
    name: "Shillong",
    region: "North East India",
    zone: "northeast",
    coords: { x: 76, y: 35 },
    category: "NATURE",
    image:
      "https://images.unsplash.com/photo-1609276804051-8c5e906cc430?auto=format&fit=crop&w=1400&q=85",
    description:
      "Waterfalls, forests, music and local life in one of India's most atmospheric regions.",
    crowd: 27,
    safety: 90,
    distance: "78 km",
    bestTime: "09:00–11:00",
    alternative: "Laitlum Canyon",
    altCrowd: 8,
    altReason:
      "Cleaner air and wider views, almost no tour buses.",
  },
  {
    name: "Goa",
    region: "West India",
    zone: "west",
    coords: { x: 38, y: 66 },
    category: "FOOD",
    image:
      "https://images.unsplash.com/photo-1695453463057-aa5d48d9e3d4?auto=format&fit=crop&w=1400&q=85",
    description:
      "Portuguese-era lanes and Konkan cooking along a coastline longer than its reputation suggests.",
    crowd: 58,
    safety: 82,
    distance: "38 km",
    bestTime: "17:30–19:00",
    alternative: "Agonda & Patnem, South Goa",
    altCrowd: 16,
    altReason:
      "Same coastline, a fifth of the footfall, better food.",
  },
  {
    name: "Hampi",
    region: "South India",
    zone: "south",
    coords: { x: 48, y: 62 },
    category: "HERITAGE",
    image:
      "https://images.unsplash.com/photo-1767633994425-0eb9a3f20671?auto=format&fit=crop&w=1400&q=85",
    description:
      "A ruined empire scattered across boulder-strewn plains, best seen once the temple crowds thin out.",
    crowd: 35,
    safety: 87,
    distance: "4.1 km",
    bestTime: "16:30–18:00",
    alternative: "Malyavanta Hill",
    altCrowd: 11,
    altReason:
      "A quiet ruined temple with sunset views, and no queues.",
  },
];

export const ZONE_FILTERS = [
  { id: "all", label: "All" },
  { id: "north", label: "North" },
  { id: "south", label: "South" },
  { id: "east", label: "East" },
  { id: "west", label: "West" },
  { id: "northeast", label: "North East" },
];

export const CATEGORY_FILTERS = [
  "Heritage",
  "Culture",
  "Nature",
  "Food",
  "Adventure",
];

export const CROWD_TIMELINE = [
  { time: "08 AM", label: "Low", value: 22 },
  { time: "11 AM", label: "Moderate", value: 54 },
  { time: "02 PM", label: "High", value: 88 },
  { time: "05 PM", label: "Moderate", value: 47 },
  { time: "08 PM", label: "Low", value: 19 },
];