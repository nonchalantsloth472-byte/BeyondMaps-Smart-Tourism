import { useEffect, useRef, useState } from "react";
import {
  Utensils,
  Palette,
  BookOpen,
  Leaf,
  Users,
  Landmark,
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
} from "lucide-react";
import IndianOrnament from "../components/IndianOrnament";
import RevealOnScroll from "../components/RevealOnScroll";
import SpotlightCard from "../components/SpotlightCard";

/* =========================================================
   MOCK DATA
   -----------------------------------------------------------
   Centralised here so the backend team can later swap this
   object for an API response without touching the JSX below.
   Shape:

   {
     <slug>: {
       name, state, tag, headline: [line1, line2], intro, heroImage,
       experiences: [{ id, title, category, image, description,
         duration, price, groupSize, bestTime, crowdLevel, whyRecommended }],
       nearby: [ ...same shape as experiences, subset ],
       stories: [{ id, title, readTime, category, image, body }]
     }
   }
========================================================= */

const CATEGORIES = [
  { key: "ALL", label: "All", icon: Landmark },
  { key: "FOOD", label: "Food", icon: Utensils },
  { key: "ARTS & CRAFTS", label: "Arts & Crafts", icon: Palette },
  { key: "CULTURE", label: "Culture", icon: BookOpen },
  { key: "NATURE", label: "Nature", icon: Leaf },
  { key: "PEOPLE", label: "People", icon: Users },
  { key: "HERITAGE", label: "Heritage", icon: Landmark },
];

const CATEGORY_ICON = {
  FOOD: Utensils,
  "ARTS & CRAFTS": Palette,
  CULTURE: BookOpen,
  NATURE: Leaf,
  PEOPLE: Users,
  HERITAGE: Landmark,
};

function img(id, w = 1200) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`;
}

const JAIPUR_HERO = "1524229648276-e66561fe45a9";
const JAIPUR_CRAFT = "1477587458883-47145ed94245";
const JAIPUR_FOOD = "1602216056096-3b40cc0c9944";
const JAIPUR_BLUE = "1561361513-2d000a50f0dc";

const KERALA_WATER = "1563279036-8ae92c62ca4f";
const KERALA_DANCE = "1729079004970-df864ed944ea";
const KERALA_SPICE = "1698139214411-ef5712051f63";

const VARANASI_HERO = "1514907351870-bd69558b9f20";
const LADAKH_HERO = "1738511602789-cdfaa3d72aaa";
const MEGHALAYA_HERO = "1593813738953-fb3c93e0769d";
const KUTCH_HERO = "1669015881702-951de590db31";
const HAMPI_HERO = "1651073231492-169afcf84f36";

const DESTINATION_ORDER = [
  "jaipur",
  "kerala",
  "varanasi",
  "ladakh",
  "meghalaya",
  "kutch",
  "hampi",
];

const destinationExperiences = {
  jaipur: {
    name: "Jaipur",
    state: "Rajasthan",
    tag: "JAIPUR · RAJASTHAN",
    headline: ["Meet the Jaipur", "beyond the monuments."],
    intro:
      "Discover the people, flavours, crafts and stories that make every journey through the Pink City feel a little more personal.",
    heroImage: img(JAIPUR_HERO),
    experiences: [
      {
        id: "jaipur-block-print",
        title: "Block printing with a local artisan",
        category: "ARTS & CRAFTS",
        image: img(JAIPUR_CRAFT),
        description:
          "Learn hand block printing on cotton in a family workshop that has practised the craft for three generations.",
        duration: "2–3 hours",
        price: "₹800–1,500",
        groupSize: "Small group",
        bestTime: "Morning",
        crowdLevel: "Low",
        whyRecommended:
          "A quieter alternative to crowded shopping areas, with a direct connection to the family who prints it.",
      },
      {
        id: "jaipur-cooking",
        title: "Cook a Rajasthani thali at home",
        category: "FOOD",
        image: img(JAIPUR_FOOD),
        description:
          "Share a home kitchen with a local family and learn the everyday thali, not the tourist version of it.",
        duration: "3 hours",
        price: "₹1,200–2,000",
        groupSize: "Small group",
        bestTime: "Evening",
        crowdLevel: "Low",
        whyRecommended:
          "You cook where a family actually eats, not in a restaurant demo kitchen.",
      },
      {
        id: "jaipur-pottery",
        title: "Blue pottery workshop",
        category: "ARTS & CRAFTS",
        image: img(JAIPUR_BLUE),
        description:
          "Shape and paint Jaipur's signature blue pottery with artisans who still fire it the traditional way.",
        duration: "1.5–2 hours",
        price: "₹700–1,200",
        groupSize: "Small group",
        bestTime: "Afternoon",
        crowdLevel: "Low",
        whyRecommended:
          "Fewer than a handful of families still practise this craft — this puts you in one of their studios.",
      },
      {
        id: "jaipur-heritage-walk",
        title: "Old-city heritage walk past Hawa Mahal",
        category: "HERITAGE",
        image: img(JAIPUR_HERO),
        description:
          "Wander the lanes of the walled Pink City, from spice markets to the honeycomb façade of Hawa Mahal.",
        duration: "2 hours",
        price: "₹500–900",
        groupSize: "Small group",
        bestTime: "Early morning",
        crowdLevel: "Moderate",
        whyRecommended:
          "See the Pink City before the heat and the crowds arrive.",
      },
      {
        id: "jaipur-haveli-stories",
        title: "Evening stories at a local haveli",
        category: "CULTURE",
        image: img(JAIPUR_CRAFT, 900),
        description:
          "Sit in a family courtyard and hear stories of Jaipur passed down through generations of its residents.",
        duration: "1.5 hours",
        price: "₹600–1,000",
        groupSize: "Small group",
        bestTime: "Evening",
        crowdLevel: "Low",
        whyRecommended:
          "Hear family histories you won't find in a guidebook.",
      },
    ],
    stories: [
      {
        id: "jaipur-story-blockprint",
        title: "Inside Jaipur's disappearing block-print traditions",
        readTime: "5 min read",
        category: "Culture",
        image: img(JAIPUR_CRAFT),
        body: "Behind Jaipur's busy textile lanes, a handful of families still carve their own wooden blocks and mix their own dyes. Machine printing has made the hand technique rarer every year, but the workshops that remain are happy to show travellers the slow, precise process — one impression at a time — instead of just selling the finished cloth.",
      },
      {
        id: "jaipur-story-quiet",
        title: "A quieter way to see the Pink City",
        readTime: "4 min read",
        category: "Guide",
        image: img(JAIPUR_HERO, 900),
        body: "Most visitors see Hawa Mahal from the road outside and move on. Arrive at first light instead, and the same lane belongs mostly to shopkeepers opening up and a handful of early walkers. It's the same monument, but a completely different morning.",
      },
    ],
  },

  kerala: {
    name: "Kerala",
    state: "Kerala",
    tag: "KERALA",
    headline: ["Meet the Kerala", "beyond the backwaters."],
    intro:
      "Slow travel by canal, kitchen and courtyard — Kerala's version of a journey worth remembering.",
    heroImage: img(KERALA_WATER),
    experiences: [
      {
        id: "kerala-canoe",
        title: "Backwater canoe experience in Alappuzha",
        category: "NATURE",
        image: img(KERALA_WATER),
        description:
          "Glide through narrow canals in a traditional canoe, past coconut groves and villages the houseboats pass by.",
        duration: "3 hours",
        price: "₹1,000–1,800",
        groupSize: "Small group",
        bestTime: "Early morning",
        crowdLevel: "Low",
        whyRecommended:
          "A quieter, paddle-powered alternative to the big houseboats.",
      },
      {
        id: "kerala-cooking",
        title: "Cook a Kerala meal with a local family",
        category: "FOOD",
        image: img(KERALA_SPICE),
        description:
          "Learn the coconut, curry-leaf and mustard-seed base of Kerala cooking in a home kitchen.",
        duration: "3 hours",
        price: "₹1,100–1,700",
        groupSize: "Small group",
        bestTime: "Evening",
        crowdLevel: "Low",
        whyRecommended:
          "You learn the family recipe, not the restaurant version of it.",
      },
      {
        id: "kerala-spice",
        title: "Spice plantation visit",
        category: "NATURE",
        image: img(KERALA_SPICE, 900),
        description:
          "Walk through pepper vines, cardamom and clove trees with a grower who still farms the plantation by hand.",
        duration: "2 hours",
        price: "₹600–1,000",
        groupSize: "Small group",
        bestTime: "Morning",
        crowdLevel: "Low",
        whyRecommended: "Meet the person who grows it, not just a display board.",
      },
      {
        id: "kerala-kathakali",
        title: "Kathakali performance and make-up preview",
        category: "CULTURE",
        image: img(KERALA_DANCE),
        description:
          "Watch performers apply their elaborate make-up before a Kathakali story-dance begins.",
        duration: "2 hours",
        price: "₹500–900",
        groupSize: "Small group",
        bestTime: "Evening",
        crowdLevel: "Moderate",
        whyRecommended:
          "Understanding the make-up ritual changes how you watch the performance itself.",
      },
      {
        id: "kerala-village",
        title: "Village life experience near the canals",
        category: "PEOPLE",
        image: img(KERALA_WATER, 900),
        description:
          "Meet the families who live along Alappuzha's waterways and see a working day on the backwaters.",
        duration: "Half day",
        price: "₹1,500–2,200",
        groupSize: "Small group",
        bestTime: "Morning",
        crowdLevel: "Low",
        whyRecommended:
          "See the backwaters as a home, not just a scenic boat ride.",
      },
    ],
    stories: [
      {
        id: "kerala-story-food",
        title: "7 local foods worth travelling for in Kerala",
        readTime: "4 min read",
        category: "Food",
        image: img(KERALA_SPICE),
        body: "Kerala's food changes with its geography — coconut-heavy along the coast, pepper-forward in the highlands, rice and fish everywhere in between. The best versions rarely appear on a hotel buffet; they're cooked at home, on a banana leaf, in portions meant for sharing.",
      },
      {
        id: "kerala-story-canal",
        title: "The other side of the backwaters",
        readTime: "5 min read",
        category: "Guide",
        image: img(KERALA_WATER, 900),
        body: "Beyond the wide main channels where the houseboats cruise, a network of narrower canals runs past homes, schools and small temples. A canoe fits where a houseboat can't, which is exactly what makes the detour worth taking.",
      },
    ],
  },

  varanasi: {
    name: "Varanasi",
    state: "Uttar Pradesh",
    tag: "VARANASI",
    headline: ["Meet the Varanasi", "beyond the ghats."],
    intro:
      "One of the world's oldest living cities, best met slowly — by boat, by lane and by lamplight.",
    heroImage: img(VARANASI_HERO),
    experiences: [
      {
        id: "varanasi-sunrise-boat",
        title: "Sunrise boat ride on the Ganges",
        category: "NATURE",
        image: img(VARANASI_HERO),
        description:
          "Drift past the ghats as the city wakes — bathers, priests and boatmen beginning their day along the river.",
        duration: "1.5 hours",
        price: "₹400–700",
        groupSize: "Small group",
        bestTime: "Sunrise",
        crowdLevel: "Moderate",
        whyRecommended:
          "The ghats look and feel completely different before the day's crowds arrive.",
      },
      {
        id: "varanasi-silk",
        title: "Silk weaving with a local artisan",
        category: "ARTS & CRAFTS",
        image: img(VARANASI_HERO, 900),
        description:
          "Watch a Banarasi silk saree take shape on a family handloom, thread by thread.",
        duration: "2 hours",
        price: "₹900–1,400",
        groupSize: "Small group",
        bestTime: "Afternoon",
        crowdLevel: "Low",
        whyRecommended: "Learn the weave from a family loom, not a showroom.",
      },
      {
        id: "varanasi-street-food",
        title: "Street food walk through the old lanes",
        category: "FOOD",
        image: img(VARANASI_HERO, 1000),
        description:
          "Follow a local guide through Varanasi's tangled lanes for kachori, chaat and the city's famous sweets.",
        duration: "2 hours",
        price: "₹500–800",
        groupSize: "Small group",
        bestTime: "Evening",
        crowdLevel: "Moderate",
        whyRecommended: "Eat where the locals eat, one lane at a time.",
      },
      {
        id: "varanasi-aarti",
        title: "Evening Ganga aarti from a quiet ghat",
        category: "CULTURE",
        image: img(VARANASI_HERO, 850),
        description:
          "Watch the nightly fire ceremony unfold from a smaller ghat, away from the main crowds.",
        duration: "1.5 hours",
        price: "₹400–700",
        groupSize: "Small group",
        bestTime: "Evening",
        crowdLevel: "Moderate",
        whyRecommended: "Watch the ceremony from a ghat the tour boats skip.",
      },
      {
        id: "varanasi-heritage",
        title: "Heritage walk through Varanasi's old city",
        category: "HERITAGE",
        image: img(VARANASI_HERO, 950),
        description:
          "Wander lanes older than most of the world's still-standing cities, guided by someone who grew up in them.",
        duration: "2 hours",
        price: "₹500–900",
        groupSize: "Small group",
        bestTime: "Morning",
        crowdLevel: "Moderate",
        whyRecommended: "A local's route through a city that rewards getting lost.",
      },
    ],
    stories: [
      {
        id: "varanasi-story-quiet",
        title: "A quieter way to experience Varanasi",
        readTime: "5 min read",
        category: "Guide",
        image: img(VARANASI_HERO),
        body: "Varanasi rewards patience. The ghats that feel overwhelming at midday turn contemplative at dawn, when the light is soft and the boats are few. Slowing down here isn't a compromise — it's the point.",
      },
      {
        id: "varanasi-story-silk",
        title: "The weavers behind Banarasi silk",
        readTime: "5 min read",
        category: "People",
        image: img(VARANASI_HERO, 900),
        body: "A single Banarasi saree can take weeks on the loom, passed between family members who each know one part of the pattern. Meeting the weaver changes how the finished cloth feels in your hands.",
      },
    ],
  },

  ladakh: {
    name: "Ladakh",
    state: "Ladakh",
    tag: "LADAKH",
    headline: ["Meet the Ladakh", "beyond the passes."],
    intro:
      "High-altitude villages, working monasteries and a slower rhythm of mountain life.",
    heroImage: img(LADAKH_HERO),
    experiences: [
      {
        id: "ladakh-homestay",
        title: "Homestay with a Ladakhi family",
        category: "PEOPLE",
        image: img(LADAKH_HERO),
        description:
          "Stay a night in a family home in the Indus valley and share meals, chores and stories.",
        duration: "Overnight",
        price: "₹1,800–2,800",
        groupSize: "Small group",
        bestTime: "Any season",
        crowdLevel: "Low",
        whyRecommended:
          "Live a day of mountain life instead of just photographing it.",
      },
      {
        id: "ladakh-cooking",
        title: "Cook Ladakhi food with a local family",
        category: "FOOD",
        image: img(LADAKH_HERO, 900),
        description:
          "Learn to make thukpa and momos in a kitchen that has cooked them the same way for generations.",
        duration: "2.5 hours",
        price: "₹1,000–1,500",
        groupSize: "Small group",
        bestTime: "Evening",
        crowdLevel: "Low",
        whyRecommended:
          "Try thukpa and momos made the way they're made at home.",
      },
      {
        id: "ladakh-monastery",
        title: "Monastery trail to Thiksey and Stakna",
        category: "HERITAGE",
        image: img(LADAKH_HERO, 1000),
        description:
          "Visit working Buddhist monasteries perched above the Indus valley, timed around morning prayers.",
        duration: "Half day",
        price: "₹1,200–1,800",
        groupSize: "Small group",
        bestTime: "Morning",
        crowdLevel: "Low",
        whyRecommended: "Visit working monasteries, not just monuments.",
      },
      {
        id: "ladakh-village",
        title: "Village life experience in the Indus valley",
        category: "NATURE",
        image: img(LADAKH_HERO, 950),
        description:
          "Walk barley fields and irrigation channels with the farmers who maintain them at 3,500 metres.",
        duration: "Half day",
        price: "₹1,000–1,600",
        groupSize: "Small group",
        bestTime: "Morning",
        crowdLevel: "Low",
        whyRecommended: "Walk barley fields with the farmers who tend them.",
      },
      {
        id: "ladakh-stories",
        title: "Evening stories under Ladakhi skies",
        category: "CULTURE",
        image: img(LADAKH_HERO, 850),
        description:
          "Sit with a local family as they share how mountain communities read the weather, stars and seasons.",
        duration: "1.5 hours",
        price: "₹700–1,100",
        groupSize: "Small group",
        bestTime: "Evening",
        crowdLevel: "Low",
        whyRecommended:
          "Hear how mountain communities read the weather and the stars.",
      },
    ],
    stories: [
      {
        id: "ladakh-story-homestay",
        title: "A night in a Ladakhi home",
        readTime: "5 min read",
        category: "People",
        image: img(LADAKH_HERO),
        body: "Homestays in Ladakh mean joining the household's routine — tea before sunrise, help with the animals, dinner cooked over a wood stove. It's a far slower introduction to the region than any tour bus can offer.",
      },
      {
        id: "ladakh-story-monastery",
        title: "Morning prayers above the Indus",
        readTime: "4 min read",
        category: "Culture",
        image: img(LADAKH_HERO, 900),
        body: "Arrive at a Ladakhi monastery before the day-trippers and you'll likely catch morning prayers — horns, chanting and butter lamps lit well before the valley below has fully woken up.",
      },
    ],
  },

  meghalaya: {
    name: "Meghalaya",
    state: "Meghalaya",
    tag: "MEGHALAYA",
    headline: ["Meet the Meghalaya", "beyond the clouds."],
    intro:
      "Living root bridges, rain-soaked forests and villages the rest of India is only just discovering.",
    heroImage: img(MEGHALAYA_HERO),
    experiences: [
      {
        id: "meghalaya-root-bridge",
        title: "Living root bridge trek to Nongriat",
        category: "NATURE",
        image: img(MEGHALAYA_HERO),
        description:
          "Descend through rainforest to a bridge grown from rubber-fig roots over generations by the Khasi people.",
        duration: "Full day",
        price: "₹1,200–1,800",
        groupSize: "Small group",
        bestTime: "Morning",
        crowdLevel: "Moderate",
        whyRecommended: "Walk to a bridge grown, not built, over centuries.",
      },
      {
        id: "meghalaya-food",
        title: "Khasi food experience with a local family",
        category: "FOOD",
        image: img(MEGHALAYA_HERO, 900),
        description:
          "Share a home-cooked Khasi meal built around smoked pork, rice and local greens.",
        duration: "2.5 hours",
        price: "₹900–1,400",
        groupSize: "Small group",
        bestTime: "Evening",
        crowdLevel: "Low",
        whyRecommended:
          "Try Khasi flavours you won't find on a hotel menu.",
      },
      {
        id: "meghalaya-craft",
        title: "Village craft experience with local weavers",
        category: "ARTS & CRAFTS",
        image: img(MEGHALAYA_HERO, 1000),
        description:
          "Learn bamboo and cane weaving in a village that still makes its own baskets, mats and tools.",
        duration: "2 hours",
        price: "₹700–1,100",
        groupSize: "Small group",
        bestTime: "Afternoon",
        crowdLevel: "Low",
        whyRecommended:
          "Learn a craft from the village that still relies on it daily.",
      },
      {
        id: "meghalaya-forest",
        title: "Forest and waterfall nature trail",
        category: "NATURE",
        image: img(MEGHALAYA_HERO, 950),
        description:
          "Trek through one of the wettest forests on earth to waterfalls most visitors never reach.",
        duration: "Half day",
        price: "₹800–1,300",
        groupSize: "Small group",
        bestTime: "Morning",
        crowdLevel: "Low",
        whyRecommended:
          "Walk through the wettest forests on earth with a local guide.",
      },
      {
        id: "meghalaya-stories",
        title: "Evening stories from the Khasi hills",
        category: "CULTURE",
        image: img(MEGHALAYA_HERO, 850),
        description:
          "Hear how living root bridges are grown, one root at a time, from families who tend them.",
        duration: "1.5 hours",
        price: "₹600–1,000",
        groupSize: "Small group",
        bestTime: "Evening",
        crowdLevel: "Low",
        whyRecommended:
          "Hear how living root bridges are grown, one root at a time.",
      },
    ],
    stories: [
      {
        id: "meghalaya-story-bridge",
        title: "The bridges that take decades to grow",
        readTime: "6 min read",
        category: "Culture",
        image: img(MEGHALAYA_HERO),
        body: "A living root bridge can take fifteen to thirty years to become fully load-bearing, guided the entire time by Khasi villagers who train the roots across a river, one season at a time. They're still growing stronger today.",
      },
      {
        id: "meghalaya-story-rain",
        title: "Life in the wettest place on earth",
        readTime: "4 min read",
        category: "Guide",
        image: img(MEGHALAYA_HERO, 900),
        body: "Meghalaya's rainfall shapes everything here, from house design to farming calendars. Visiting during or just after the rains shows a side of the state most travel photos never capture.",
      },
    ],
  },

  kutch: {
    name: "Kutch",
    state: "Gujarat",
    tag: "KUTCH · GUJARAT",
    headline: ["Meet the Kutch", "beyond the salt flats."],
    intro:
      "A white desert, and the artisans and herders whose crafts and villages surround it.",
    heroImage: img(KUTCH_HERO),
    experiences: [
      {
        id: "kutch-embroidery",
        title: "Embroidery workshop with Kutchi artisans",
        category: "ARTS & CRAFTS",
        image: img(KUTCH_HERO),
        description:
          "Learn mirror-work embroidery from the women of a Kutchi village cooperative, stitch by stitch.",
        duration: "2.5 hours",
        price: "₹900–1,400",
        groupSize: "Small group",
        bestTime: "Morning",
        crowdLevel: "Low",
        whyRecommended:
          "Learn mirror-work embroidery from the women who keep the craft alive.",
      },
      {
        id: "kutch-village",
        title: "Desert village experience near the Rann",
        category: "PEOPLE",
        image: img(KUTCH_HERO, 900),
        description:
          "Visit a Banni village, meet its herders and see a way of life built around the seasonal salt marsh.",
        duration: "Half day",
        price: "₹1,200–1,800",
        groupSize: "Small group",
        bestTime: "Morning",
        crowdLevel: "Low",
        whyRecommended: "Visit a Banni village instead of only the salt flats.",
      },
      {
        id: "kutch-sunset",
        title: "Sunset at the White Rann",
        category: "NATURE",
        image: img(KUTCH_HERO, 1000),
        description:
          "Watch the salt desert change colour at dusk with someone who grew up on its edge.",
        duration: "2 hours",
        price: "₹500–900",
        groupSize: "Small group",
        bestTime: "Evening",
        crowdLevel: "Moderate",
        whyRecommended:
          "Watch the desert change colour with someone who grew up beside it.",
      },
      {
        id: "kutch-print",
        title: "Block-printing and tie-dye experience",
        category: "ARTS & CRAFTS",
        image: img(KUTCH_HERO, 950),
        description:
          "Try Ajrakh block-printing and bandhani tie-dye, two crafts Kutch is known for across India.",
        duration: "2 hours",
        price: "₹800–1,200",
        groupSize: "Small group",
        bestTime: "Afternoon",
        crowdLevel: "Low",
        whyRecommended: "Try Ajrakh and bandhani with the artisans of Kutch.",
      },
      {
        id: "kutch-food",
        title: "Local food experience in Bhuj",
        category: "FOOD",
        image: img(KUTCH_HERO, 850),
        description:
          "Share a Kutchi thali at a family home in Bhuj, built around millet rotis and local vegetables.",
        duration: "2 hours",
        price: "₹600–1,000",
        groupSize: "Small group",
        bestTime: "Evening",
        crowdLevel: "Low",
        whyRecommended: "Taste Kutchi thali the way it's cooked at home.",
      },
    ],
    stories: [
      {
        id: "kutch-story-textiles",
        title: "The artisans keeping Kutch's textiles alive",
        readTime: "6 min read",
        category: "People",
        image: img(KUTCH_HERO),
        body: "Kutch is home to dozens of embroidery styles, each tied to a specific community and passed down mostly among women. Cooperatives across the district now help artisans sell directly to travellers, keeping both the income and the craft closer to home.",
      },
      {
        id: "kutch-story-rann",
        title: "A desert that used to be a sea",
        readTime: "4 min read",
        category: "Guide",
        image: img(KUTCH_HERO, 900),
        body: "The Rann of Kutch was once a shallow arm of the Arabian Sea before geological shifts sealed it off. What's left is a seasonal salt marsh that turns a startling white after the monsoon — best seen at sunrise or sunset.",
      },
    ],
  },

  hampi: {
    name: "Hampi",
    state: "Karnataka",
    tag: "HAMPI · KARNATAKA",
    headline: ["Meet the Hampi", "beyond the ruins."],
    intro:
      "Boulder landscapes and Vijayanagara-era temples, best explored on foot or by bicycle.",
    heroImage: img(HAMPI_HERO),
    experiences: [
      {
        id: "hampi-heritage",
        title: "Heritage walk through the ruins",
        category: "HERITAGE",
        image: img(HAMPI_HERO),
        description:
          "Walk through the Vijayanagara ruins with a local guide, from Virupaksha Temple to the Stone Chariot.",
        duration: "3 hours",
        price: "₹700–1,100",
        groupSize: "Small group",
        bestTime: "Early morning",
        crowdLevel: "Moderate",
        whyRecommended: "Explore Hampi before the buses arrive from Hospet.",
      },
      {
        id: "hampi-stone-craft",
        title: "Local stone craft experience",
        category: "ARTS & CRAFTS",
        image: img(HAMPI_HERO, 900),
        description:
          "Meet stone carvers whose techniques trace back to the artisans who built Hampi's temples.",
        duration: "2 hours",
        price: "₹700–1,100",
        groupSize: "Small group",
        bestTime: "Afternoon",
        crowdLevel: "Low",
        whyRecommended: "Meet the carvers who keep Vijayanagara stonework alive.",
      },
      {
        id: "hampi-cycling",
        title: "Village cycling through the boulder landscape",
        category: "NATURE",
        image: img(HAMPI_HERO, 1000),
        description:
          "Cycle past paddy fields, boulders and small villages on the quieter side of the river.",
        duration: "2.5 hours",
        price: "₹600–1,000",
        groupSize: "Small group",
        bestTime: "Morning",
        crowdLevel: "Low",
        whyRecommended:
          "Cycle the paddy fields and boulders locals actually use as shortcuts.",
      },
      {
        id: "hampi-cooking",
        title: "South Indian cooking with a local family",
        category: "FOOD",
        image: img(HAMPI_HERO, 950),
        description:
          "Learn Karnataka home-cooking — dosas, chutneys and sambar — in a family kitchen near the ruins.",
        duration: "3 hours",
        price: "₹1,000–1,500",
        groupSize: "Small group",
        bestTime: "Evening",
        crowdLevel: "Low",
        whyRecommended: "Learn Karnataka home-cooking, not restaurant recipes.",
      },
      {
        id: "hampi-sunset",
        title: "Sunset at Matanga Hill",
        category: "CULTURE",
        image: img(HAMPI_HERO, 850),
        description:
          "Climb the hill locals use for sunset and watch the temple spires glow gold across the ruins.",
        duration: "1.5 hours",
        price: "₹400–700",
        groupSize: "Small group",
        bestTime: "Evening",
        crowdLevel: "Moderate",
        whyRecommended:
          "Watch the ruins glow gold from the hill locals climb at dusk.",
      },
    ],
    stories: [
      {
        id: "hampi-story-heritage",
        title: "Hampi, one boulder at a time",
        readTime: "5 min read",
        category: "Guide",
        image: img(HAMPI_HERO),
        body: "Hampi's ruins are scattered across a boulder-strewn landscape big enough to spend days in. Walking or cycling between sites, rather than driving, is what turns a checklist of monuments into a real sense of the place.",
      },
      {
        id: "hampi-story-carvers",
        title: "The carvers who still shape Hampi's stone",
        readTime: "5 min read",
        category: "People",
        image: img(HAMPI_HERO, 900),
        body: "A small community of stone carvers near Hampi continues techniques first used to build the Vijayanagara temples. Their work today ranges from temple repairs to small pieces travellers can carry home.",
      },
    ],
  },
};

// Build the "there's more around the corner" list per destination from a
// subset of its experiences, so nearby rows reuse the same modal data.
Object.keys(destinationExperiences).forEach((key) => {
  const dest = destinationExperiences[key];
  dest.nearby = dest.experiences.slice(2, 5);
});

/* =========================================================
   EXPERIENCE DETAIL MODAL
========================================================= */

function ExperienceModal({ experience, destination, onClose, onAdd, added }) {
  if (!experience) return null;
  const Icon = CATEGORY_ICON[experience.category] || Landmark;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#24231F]/60 backdrop-blur-sm p-0 sm:p-6"
      onClick={onClose}
    >
      <div
        className="
          relative bg-[#F5F1E8] w-full sm:max-w-2xl
          max-h-[92vh] sm:max-h-[88vh] overflow-y-auto
          border border-[#D8D1C5]
          animate-[fadeIn_0.25s_ease-out]
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-56 sm:h-72 overflow-hidden">
          <img
            src={experience.image}
            alt={experience.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#24231F]/70 via-transparent to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-[#F5F1E8]/90 text-[#24231F] hover:bg-[#F5F1E8] transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
          <div className="absolute bottom-5 left-6 right-6">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-white/90">
              {destination.name.toUpperCase()} · {experience.category}
            </p>
            <h3 className="font-editorial text-2xl sm:text-3xl text-white mt-2 leading-tight">
              {experience.title}
            </h3>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-sm leading-relaxed text-[#6F6A61]">
            {experience.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-7 pt-6 border-t border-[#D8D1C5]">
            <div>
              <p className="text-[9px] uppercase tracking-[0.18em] text-[#C66A4A] font-semibold">
                Duration
              </p>
              <p className="text-sm text-[#234236] mt-1.5">{experience.duration}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.18em] text-[#C66A4A] font-semibold">
                Approx. cost
              </p>
              <p className="text-sm text-[#234236] mt-1.5">{experience.price}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.18em] text-[#C66A4A] font-semibold">
                Group size
              </p>
              <p className="text-sm text-[#234236] mt-1.5">{experience.groupSize}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.18em] text-[#C66A4A] font-semibold">
                Best time
              </p>
              <p className="text-sm text-[#234236] mt-1.5">{experience.bestTime}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-6">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.15em] text-[#234236] bg-[#E6EBE3] px-3 py-1.5">
              <Icon size={12} strokeWidth={1.75} />
              {experience.category}
            </span>
            <span className="text-[10px] font-semibold tracking-[0.15em] text-[#234236] bg-[#E6EBE3] px-3 py-1.5">
              CROWD · {experience.crowdLevel.toUpperCase()}
            </span>
            <span className="text-[10px] font-semibold tracking-[0.15em] text-[#234236] bg-[#E6EBE3] px-3 py-1.5">
              LOCAL HOST
            </span>
          </div>

          <div className="mt-7 pt-6 border-t border-[#D8D1C5]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#C66A4A] font-semibold mb-2">
              Why BeyondMaps recommends it
            </p>
            <p className="text-sm leading-relaxed text-[#6F6A61] italic">
              {experience.whyRecommended}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              type="button"
              onClick={() => onAdd(experience.id)}
              disabled={added}
              className={`
                flex-1 inline-flex items-center justify-center gap-2
                px-6 py-3.5 text-xs uppercase tracking-[0.18em] font-semibold
                transition-colors
                ${
                  added
                    ? "bg-[#E6EBE3] text-[#234236]"
                    : "bg-[#234236] text-[#F5F1E8] hover:bg-[#1a3129]"
                }
              `}
            >
              {added ? (
                <>
                  Added to your journey <Check size={14} />
                </>
              ) : (
                "Add to my trip"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 text-xs uppercase tracking-[0.18em] font-semibold border border-[#D8D1C5] text-[#234236] hover:bg-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ARTICLE PREVIEW MODAL
========================================================= */

function ArticleModal({ story, destinationName, onClose }) {
  if (!story) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#24231F]/60 backdrop-blur-sm p-0 sm:p-6"
      onClick={onClose}
    >
      <div
        className="
          relative bg-[#F5F1E8] w-full sm:max-w-xl
          max-h-[92vh] sm:max-h-[85vh] overflow-y-auto
          border border-[#D8D1C5]
          animate-[fadeIn_0.25s_ease-out]
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48 sm:h-60 overflow-hidden">
          <img
            src={story.image}
            alt={story.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#24231F]/70 via-transparent to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-[#F5F1E8]/90 text-[#24231F] hover:bg-[#F5F1E8] transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-[#C66A4A]">
            {destinationName.toUpperCase()} · {story.category.toUpperCase()}
          </p>
          <h3 className="font-editorial text-2xl sm:text-3xl text-[#234236] mt-3 leading-tight">
            {story.title}
          </h3>
          <p className="text-xs text-[#6F6A61] mt-2">{story.readTime}</p>

          <p className="text-sm leading-relaxed text-[#6F6A61] mt-6">
            {story.body}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-8 px-6 py-3.5 text-xs uppercase tracking-[0.18em] font-semibold border border-[#D8D1C5] text-[#234236] hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   LOCAL EXPERIENCES
========================================================= */

function LocalExperiences() {
  const [activeDestination, setActiveDestination] = useState("jaipur");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [addedId, setAddedId] = useState(null);

  const sliderRef = useRef(null);

  const destination = destinationExperiences[activeDestination];

  // Category filter has no effect until the person changes it, but reset it
  // gently when switching destinations so an empty filtered state doesn't
  // greet them on arrival.
  useEffect(() => {
    setActiveCategory("ALL");
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
  }, [activeDestination]);

  const filteredExperiences = destination.experiences.filter(
    (experience) =>
      activeCategory === "ALL" || experience.category === activeCategory
  );

  const handleAdd = (id) => {
    setAddedId(id);
  };

  const handleOpenExperience = (experience) => {
    setAddedId((current) => (current === experience.id ? current : null));
    setSelectedExperience(experience);
  };

  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: direction * 360,
      behavior: "smooth",
    });
  };

  return (
    <main className="bg-[#F5F1E8] text-[#24231F] overflow-hidden">
      {/* =====================================================
          HERO + DESTINATION SELECTOR
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#C9D2C5] border-b border-[#D8D1C5]">
        <IndianOrnament
          variant="corner"
          color="#234236"
          opacity={0.11}
          duration={65}
          className="absolute -left-14 -top-10 w-96 h-96 pointer-events-none"
        />

        <IndianOrnament
          variant="corner"
          color="#C66A4A"
          opacity={0.08}
          duration={80}
          reverse
          className="absolute -right-20 bottom-0 w-72 h-72 rotate-180 pointer-events-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
          <RevealOnScroll>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#C66A4A] font-semibold mb-5">
              Explore experiences in
            </p>

            <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
              {DESTINATION_ORDER.map((key) => {
                const item = destinationExperiences[key];
                const isActive = key === activeDestination;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveDestination(key)}
                    className={`
                      flex-shrink-0 px-4 py-2 text-xs uppercase tracking-[0.12em] font-semibold
                      border-b-2 transition-colors duration-300 whitespace-nowrap
                      ${
                        isActive
                          ? "border-[#C66A4A] text-[#234236]"
                          : "border-transparent text-[#6F6A61] hover:text-[#234236]"
                      }
                    `}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          </RevealOnScroll>

          <div className="grid lg:grid-cols-[1fr_0.85fr] gap-12 lg:gap-16 items-center mt-10">
            <RevealOnScroll key={`${activeDestination}-copy`}>
              <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl leading-[0.95] text-[#234236] transition-opacity duration-500">
                {destination.headline[0]}
                <br />
                <span className="italic text-[#24231F]">
                  {destination.headline[1]}
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-base leading-relaxed text-[#6F6A61]">
                {destination.intro}
              </p>

              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("experiences")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="
                  relative overflow-hidden group
                  inline-flex items-center gap-3 mt-9
                  px-8 py-4 bg-[#234236] text-[#F5F1E8]
                  text-xs uppercase tracking-[0.18em] font-semibold
                "
              >
                <span className="relative z-10">Explore experiences</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
                <span className="absolute inset-y-0 -left-20 w-20 bg-[#C66A4A]/30 skew-x-[-20deg] group-hover:left-[120%] transition-all duration-700" />
              </button>
            </RevealOnScroll>

            <RevealOnScroll key={`${activeDestination}-image`} className="lg:pt-4">
              <SpotlightCard>
                <div className="relative border border-[#D8D1C5] bg-[#F5F1E8] p-2">
                  <div className="relative h-[380px] lg:h-[460px] overflow-hidden">
                    <img
                      src={destination.heroImage}
                      alt={destination.name}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#234236]/80 via-transparent to-transparent" />
                    <span className="absolute bottom-7 left-7 font-editorial text-4xl text-[#F5F1E8]">
                      {destination.name}
                    </span>
                    <span className="absolute top-5 right-5 text-[10px] font-semibold tracking-[0.2em] text-white/90">
                      {destination.state.toUpperCase()}
                    </span>
                  </div>
                </div>
              </SpotlightCard>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORY FILTER
      ===================================================== */}

      <section id="experiences" className="py-10 border-b border-[#D8D1C5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <RevealOnScroll>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = cat.key === activeCategory;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setActiveCategory(cat.key)}
                    className={`
                      flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5
                      text-[11px] uppercase tracking-[0.15em] font-semibold
                      border transition-colors duration-300 whitespace-nowrap
                      ${
                        isActive
                          ? "bg-[#234236] text-[#F5F1E8] border-[#234236]"
                          : "bg-transparent text-[#6F6A61] border-[#D8D1C5] hover:border-[#234236] hover:text-[#234236]"
                      }
                    `}
                  >
                    <Icon size={13} strokeWidth={1.75} />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* =====================================================
          FEATURED EXPERIENCES SLIDER
      ===================================================== */}

      <section className="relative py-20 border-b border-[#D8D1C5]">
        <IndianOrnament
          variant="floral"
          color="#234236"
          opacity={0.06}
          duration={95}
          className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[520px] h-[520px] pointer-events-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <RevealOnScroll>
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-end mb-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#C66A4A]">
                  Featured experiences
                </p>
                <h2 className="font-editorial text-4xl lg:text-5xl text-[#234236] mt-4 leading-[0.95]">
                  Made by locals.
                  <br />
                  <span className="italic text-[#24231F]">
                    Remembered by travellers.
                  </span>
                </h2>
              </div>
              <div className="flex items-end justify-between gap-6">
                <p className="max-w-xl text-sm leading-relaxed text-[#6F6A61]">
                  Skip the usual tourist checklist. Discover experiences that
                  let you slow down, meet people and see {destination.name}{" "}
                  differently.
                </p>
                <div className="hidden sm:flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => scrollSlider(-1)}
                    className="w-10 h-10 flex items-center justify-center border border-[#D8D1C5] text-[#234236] hover:bg-white transition-colors"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollSlider(1)}
                    className="w-10 h-10 flex items-center justify-center border border-[#D8D1C5] text-[#234236] hover:bg-white transition-colors"
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {filteredExperiences.length === 0 ? (
            <p className="text-sm text-[#6F6A61] py-10">
              No experiences match this filter yet in {destination.name} —
              try another category.
            </p>
          ) : (
            <RevealOnScroll>
              <div
                ref={sliderRef}
                className="flex gap-6 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory scrollbar-none"
              >
                {filteredExperiences.map((item, index) => {
                  const Icon = CATEGORY_ICON[item.category] || Landmark;
                  return (
                    <SpotlightCard
                      key={item.id}
                      className="bg-white border border-[#D8D1C5] group flex-shrink-0 w-[280px] sm:w-[320px] snap-start cursor-pointer"
                    >
                      <button
                        type="button"
                        onClick={() => handleOpenExperience(item)}
                        className="text-left w-full"
                      >
                        <div className="relative h-[260px] overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                          <span className="absolute top-5 left-5 text-[10px] font-semibold tracking-[0.2em] text-white">
                            {String(index + 1).padStart(2, "0")} /{" "}
                            {String(filteredExperiences.length).padStart(2, "0")}
                          </span>
                          <span className="absolute top-4 right-4 w-9 h-9 rounded-full border border-white/60 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110">
                            <Icon size={14} strokeWidth={1.75} />
                          </span>
                          <span className="absolute bottom-4 left-5 text-[9px] font-semibold tracking-[0.15em] text-white/90">
                            FROM {item.price.split("–")[0]} · {item.duration}
                          </span>
                        </div>

                        <div className="p-6">
                          <p className="text-[10px] font-semibold tracking-[0.2em] text-[#C66A4A] mb-3">
                            {item.category}
                          </p>
                          <h3 className="font-editorial text-xl text-[#234236] leading-tight">
                            {item.title}
                          </h3>
                          <div className="flex items-center justify-between mt-5">
                            <span className="text-[9px] font-semibold tracking-[0.12em] text-[#6F6A61]">
                              {item.crowdLevel.toUpperCase()} CROWD
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs text-[#234236] font-semibold">
                              View
                              <ArrowRight
                                size={12}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                              />
                            </span>
                          </div>
                        </div>
                      </button>
                    </SpotlightCard>
                  );
                })}
              </div>
            </RevealOnScroll>
          )}
        </div>
      </section>

      {/* =====================================================
          NEAR YOUR DESTINATION
      ===================================================== */}

      <section className="py-24 border-b border-[#D8D1C5] bg-[#E6EBE3]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <RevealOnScroll>
            <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-10 items-end mb-12">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#C66A4A]">
                  Near your destination
                </p>
                <h2 className="font-editorial text-4xl lg:text-5xl text-[#234236] mt-4 leading-[0.95]">
                  There's more
                  <br />
                  <span className="italic text-[#24231F]">around the corner.</span>
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-[#6F6A61]">
                Make your trip more memorable with experiences close to the
                places you're already visiting in {destination.name}.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="border-t border-[#D8D1C5]">
              {destination.nearby.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleOpenExperience(item)}
                  className="w-full text-left flex items-center justify-between gap-6 py-6 border-b border-[#D8D1C5] hover:pl-3 hover:bg-white/60 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-14 h-14 flex-shrink-0 overflow-hidden opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden sm:block">
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <MapPin
                      size={16}
                      strokeWidth={1.75}
                      className="text-[#C66A4A] mt-1.5 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C66A4A]">
                        {destination.name.toUpperCase()}
                      </span>
                      <h3 className="font-editorial text-xl text-[#234236] mt-1.5 truncate">
                        {item.title}
                      </h3>
                      <p className="text-[10px] font-semibold tracking-[0.15em] text-[#6F6A61] mt-1.5">
                        {item.category} · {item.duration.toUpperCase()} ·{" "}
                        {item.crowdLevel.toUpperCase()} CROWD
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl text-[#234236] flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                    ↗
                  </span>
                </button>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* =====================================================
          STORIES FROM THE ROAD
      ===================================================== */}

      <section className="relative py-24 border-b border-[#D8D1C5]">
        <IndianOrnament
          variant="divider"
          color="#C66A4A"
          opacity={0.35}
          className="absolute top-10 left-1/2 -translate-x-1/2 w-64"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <RevealOnScroll>
            <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-10 items-end mb-12">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#C66A4A]">
                  Stories from the road
                </p>
                <h2 className="font-editorial text-4xl lg:text-5xl text-[#234236] mt-4 leading-[0.95]">
                  Local stories,
                  <br />
                  <span className="italic text-[#24231F]">worth slowing down for.</span>
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-[#6F6A61]">
                Travel insights and places worth slowing down for, from{" "}
                {destination.name} and beyond.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="grid sm:grid-cols-2 gap-6">
              {destination.stories.map((story) => (
                <SpotlightCard
                  key={story.id}
                  className="bg-white border border-[#D8D1C5] group flex flex-col sm:flex-row cursor-pointer"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedStory(story)}
                    className="text-left w-full flex flex-col sm:flex-row"
                  >
                    <div className="relative h-44 sm:h-auto sm:w-40 flex-shrink-0 overflow-hidden">
                      <img
                        src={story.image}
                        alt={story.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex flex-col justify-center">
                      <p className="text-[10px] font-semibold tracking-[0.2em] text-[#C66A4A] mb-2">
                        {story.readTime.toUpperCase()} · {story.category.toUpperCase()}
                      </p>
                      <h3 className="font-editorial text-xl text-[#234236] leading-tight">
                        {story.title}
                      </h3>
                      <span className="mt-4 inline-flex items-center gap-2 text-xs text-[#6F6A61]">
                        Read the story
                        <ArrowRight
                          size={12}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </button>
                </SpotlightCard>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* =====================================================
          LOCAL COMMUNITY / CTA
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#234236] text-white py-24">
        <IndianOrnament
          variant="floral"
          color="#F5F1E8"
          opacity={0.08}
          duration={100}
          className="absolute -left-32 -top-32 w-96 h-96 pointer-events-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <RevealOnScroll>
            <div className="grid lg:grid-cols-[1fr_0.8fr] gap-14 items-center">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#C66A4A]">
                  Local first
                </p>
                <h2 className="font-editorial text-4xl lg:text-5xl mt-4 leading-[0.95]">
                  Support the people
                  <br />
                  <span className="italic">who make the place.</span>
                </h2>
              </div>

              <div className="text-white/75 leading-relaxed space-y-4">
                <p>
                  BeyondMaps connects travellers with local hosts, artists,
                  cooks, guides and small businesses across India.
                </p>
                <p>
                  Because the best way to experience a place is often through
                  the people who call it home.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("experiences")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="
                    inline-flex items-center gap-3 mt-4
                    px-8 py-4 bg-[#C66A4A] text-white
                    text-xs uppercase tracking-[0.18em] font-semibold
                    hover:bg-white hover:text-[#234236]
                    transition-colors
                  "
                >
                  Find local experiences
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* =====================================================
          MODALS
      ===================================================== */}

      <ExperienceModal
        experience={selectedExperience}
        destination={destination}
        onClose={() => setSelectedExperience(null)}
        onAdd={handleAdd}
        added={selectedExperience ? addedId === selectedExperience.id : false}
      />

      <ArticleModal
        story={selectedStory}
        destinationName={destination.name}
        onClose={() => setSelectedStory(null)}
      />
    </main>
  );
}

export default LocalExperiences;
