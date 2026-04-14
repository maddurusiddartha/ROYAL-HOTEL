import { useState, useEffect } from "react";

// ─── PRICING ─────────────────────────────────────────────────────────────────
function calcRoomPrice(checkIn, checkOut, adults, children, seniors) {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn),
    end = new Date(checkOut);
  let total = 0;
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    const isWeekend = d.getDay() === 5 || d.getDay() === 6;
    total += isWeekend ? 9600 : 8000;
    total += children * 500 + seniors * 300;
  }
  return Math.round(total);
}
const NIGHTS = (ci, co) =>
  !ci || !co ? 0 : Math.round((new Date(co) - new Date(ci)) / 86400000);

// ─── COLORS ───────────────────────────────────────────────────────────────────
const G = {
  gold: "#C9A84C",
  goldLight: "#E8C97A",
  goldDim: "#8A6A2A",
  navy: "#0B1426",
  navyMid: "#122040",
  navyLight: "#1A2E55",
  cream: "#F7F0E3",
  creamDark: "#EDE4D0",
  white: "#FFFFFF",
  text: "#2A1F0E",
  textLight: "#6B5A3E",
};

// ─── SERVICES TREE (3-level) ──────────────────────────────────────────────────
const SERVICES_TREE = [
  {
    icon: "🍽️",
    title: "Dining & Culinary",
    desc: "From sizzling Hyderabadi Dum Biryani to Continental steaks — a universe of flavours by our master chefs.",
    subcategories: [
      {
        name: "🍛 Biryani Collection",
        items: [
          {
            name: "🍗 Chicken Biryani",
            subitems: [
              "Hyderabadi Dum Biryani",
              "Kacchi Biryani",
              "Masala Biryani",
              "Pepper Chicken Biryani",
            ],
          },
          {
            name: "🐑 Mutton Biryani",
            subitems: [
              "Hyderabadi Mutton Dum Biryani",
              "Spicy Andhra Mutton Biryani",
              "Lucknowi Dum Biryani",
            ],
          },
          {
            name: "🦐 Seafood Biryani",
            subitems: ["Prawn Biryani", "Fish Biryani", "Crab Biryani"],
          },
          {
            name: "🥚 Egg Biryani",
            subitems: ["Classic Egg Dum Biryani", "Spicy Andhra Egg Biryani"],
          },
          {
            name: "🥦 Veg Biryani",
            subitems: [
              "Paneer Biryani",
              "Mixed Vegetable Biryani",
              "Mushroom Biryani",
              "Soya Biryani",
            ],
          },
        ],
      },
      {
        name: "🦐 Seafood Specialties",
        items: [
          {
            name: "Prawn Dishes",
            subitems: [
              "Butter Garlic Prawns",
              "Tandoori Prawns",
              "Prawn Masala",
              "Chilli Prawns",
            ],
          },
          {
            name: "Fish Dishes",
            subitems: [
              "Grilled Fish Steak",
              "Fish Curry – Andhra Style",
              "Fish Curry – Kerala Style",
              "Fish Fry",
            ],
          },
          {
            name: "Other Seafood",
            subitems: ["Crab Masala", "Squid Fry", "Lobster Thermidor"],
          },
        ],
      },
      {
        name: "🍗 Indian Cuisine",
        items: [
          {
            name: "Chicken",
            subitems: [
              "Butter Chicken",
              "Chicken Tikka Masala",
              "Tandoori Chicken",
              "Chicken Chettinad",
              "Chicken Rogan Josh",
            ],
          },
          {
            name: "Paneer & Veg",
            subitems: [
              "Paneer Butter Masala",
              "Dal Tadka",
              "Palak Paneer",
              "Aloo Gobi",
              "Chana Masala",
            ],
          },
          {
            name: "Breads & Rice",
            subitems: [
              "Garlic Naan",
              "Tandoori Roti",
              "Laccha Paratha",
              "Jeera Rice",
              "Dal Fry",
            ],
          },
        ],
      },
      {
        name: "🍝 Continental Cuisine",
        items: [
          {
            name: "Grills & Steaks",
            subitems: [
              "Grilled Chicken Steak",
              "Grilled Fish",
              "BBQ Ribs",
              "Lamb Chops",
            ],
          },
          {
            name: "Pasta",
            subitems: [
              "Pasta Alfredo",
              "Pasta Arrabbiata",
              "Penne Pesto",
              "Spaghetti Bolognese",
            ],
          },
          {
            name: "Burgers & Sandwiches",
            subitems: [
              "Veg Burger",
              "Chicken Burger",
              "Beef Burger",
              "Club Sandwich",
              "Panini",
            ],
          },
          {
            name: "Pizza",
            subitems: [
              "Margherita",
              "Pepperoni",
              "BBQ Chicken",
              "Farmhouse",
              "Four Cheese",
            ],
          },
        ],
      },
      {
        name: "🥗 Buffet Dining",
        items: [
          {
            name: "Breakfast Buffet",
            subitems: [
              "Continental Spread",
              "South Indian Special",
              "North Indian Special",
              "Live Omelette Counter",
            ],
          },
          {
            name: "Lunch Buffet",
            subitems: [
              "Veg Thali",
              "Non-Veg Thali",
              "International Spread",
              "Salad Bar",
            ],
          },
          {
            name: "Dinner Buffet",
            subitems: [
              "Live Pasta Counter",
              "Live Grill Station",
              "Dessert Counter",
              "Chef's Special",
            ],
          },
        ],
      },
      {
        name: "🍨 Desserts",
        items: [
          {
            name: "Indian Sweets",
            subitems: ["Gulab Jamun", "Rasmalai", "Kheer", "Jalebi", "Halwa"],
          },
          {
            name: "Continental Desserts",
            subitems: [
              "Brownie with Ice Cream",
              "Cheesecake",
              "Tiramisu",
              "Crème Brûlée",
              "Panna Cotta",
            ],
          },
          {
            name: "Ice Cream",
            subitems: [
              "Vanilla",
              "Chocolate Fudge",
              "Mango Sorbet",
              "Pistachio",
              "Strawberry",
            ],
          },
        ],
      },
      {
        name: "🍽️ In-Room Dining (24/7)",
        items: [
          {
            name: "Full Menu Service",
            subitems: [
              "Any item from the full menu delivered to your room",
              "Express 30-min delivery guarantee",
            ],
          },
          {
            name: "Midnight Snacks",
            subitems: [
              "Sandwiches & Wraps",
              "Soups",
              "Fries & Finger Foods",
              "Fruit Platter",
            ],
          },
          {
            name: "Custom Requests",
            subitems: [
              "Dietary-specific meals (Vegan, Keto, Jain)",
              "Custom Chef preparation",
              "Baby food on request",
            ],
          },
        ],
      },
    ],
  },
  {
    icon: "🥤",
    title: "Beverages",
    desc: "Hand-pressed juices, artisan coffees, indulgent mocktails and wellness elixirs to refresh your senses.",
    subcategories: [
      {
        name: "🧃 Fresh Juices",
        items: [
          {
            name: "Tropical Juices",
            subitems: [
              "Mango Juice 🥭",
              "Pineapple Juice 🍍",
              "Coconut Water",
              "Watermelon Juice 🍉",
            ],
          },
          {
            name: "Citrus & Mixed",
            subitems: [
              "Orange Juice 🍊",
              "Pomegranate Juice",
              "Mixed Fruit Juice",
              "Lemon Mint",
            ],
          },
        ],
      },
      {
        name: "🥤 Soft Drinks",
        items: [
          {
            name: "Sodas",
            subitems: [
              "Coca-Cola",
              "Pepsi",
              "Sprite",
              "Fanta",
              "Diet Coke",
              "Soda Water",
            ],
          },
          {
            name: "Flavoured Drinks",
            subitems: ["Limca", "Thums Up", "Appy Fizz", "Mountain Dew"],
          },
        ],
      },
      {
        name: "🍹 Mocktails",
        items: [
          {
            name: "Classic Mocktails",
            subitems: [
              "Virgin Mojito",
              "Blue Lagoon",
              "Strawberry Punch",
              "Fruit Punch",
            ],
          },
          {
            name: "Signature Mocktails",
            subitems: [
              "Green Apple Cooler",
              "Rose Lychee Sparkle",
              "Cucumber Mint Bliss",
              "Mango Tango",
            ],
          },
        ],
      },
      {
        name: "☕ Hot Beverages",
        items: [
          {
            name: "Coffee",
            subitems: [
              "Espresso",
              "Cappuccino",
              "Latte",
              "Americano",
              "Cold Brew",
              "Filter Coffee",
            ],
          },
          {
            name: "Tea & Others",
            subitems: [
              "Masala Chai",
              "Green Tea",
              "Chamomile Tea",
              "Ginger Lemon Tea",
              "Hot Chocolate",
            ],
          },
        ],
      },
      {
        name: "💧 Health Drinks",
        items: [
          {
            name: "Wellness",
            subitems: [
              "Coconut Water",
              "Lemon Honey Water",
              "Detox Green Drink",
              "Wheatgrass Shot",
            ],
          },
          {
            name: "Dairy & Probiotic",
            subitems: [
              "Buttermilk",
              "Lassi (Sweet / Salted)",
              "Flavoured Milk",
              "Protein Shake",
            ],
          },
        ],
      },
    ],
  },
  {
    icon: "🍷",
    title: "Bar & Spirits",
    desc: "Premium international brands, expert sommelier guidance and bespoke cocktails for the discerning palate.",
    subcategories: [
      {
        name: "🍺 Beers",
        items: [
          {
            name: "Indian Beers",
            subitems: [
              "Kingfisher Premium",
              "Kingfisher Ultra",
              "Bira 91 White",
              "Budweiser Magnum",
            ],
          },
          {
            name: "International Beers",
            subitems: [
              "Heineken",
              "Corona Extra",
              "Tuborg Green",
              "Stella Artois",
              "Hoegaarden",
            ],
          },
        ],
      },
      {
        name: "🍷 Wines",
        items: [
          {
            name: "Indian Wines",
            subitems: [
              "Sula Vineyards – Sauvignon Blanc",
              "Sula – Shiraz",
              "Grover Zampa Viognier",
              "Four Seasons White Zinfandel",
            ],
          },
          {
            name: "International Wines",
            subitems: [
              "Jacob's Creek (Australia)",
              "Robert Mondavi (USA)",
              "Moët & Chandon Champagne",
              "Veuve Clicquot Brut",
              "Penfolds Grange",
            ],
          },
        ],
      },
      {
        name: "🥃 Whiskey",
        items: [
          {
            name: "Scotch",
            subitems: [
              "Johnnie Walker Red Label",
              "Johnnie Walker Black Label",
              "Chivas Regal 12Y",
              "Glenfiddich 12Y",
              "Macallan 12Y",
            ],
          },
          {
            name: "Indian & Irish",
            subitems: [
              "Blenders Pride",
              "Royal Stag",
              "Jameson Irish Whiskey",
              "Paul John Indian Single Malt",
            ],
          },
          {
            name: "American",
            subitems: [
              "Jack Daniel's",
              "Maker's Mark",
              "Woodford Reserve",
              "Jim Beam",
            ],
          },
        ],
      },
      {
        name: "🍸 Vodka & Gin",
        items: [
          {
            name: "Vodka",
            subitems: [
              "Grey Goose",
              "Absolut Blue",
              "Belvedere",
              "Smirnoff",
              "Russian Standard",
            ],
          },
          {
            name: "Gin",
            subitems: [
              "Bombay Sapphire",
              "Hendrick's",
              "Tanqueray",
              "Beefeater",
              "Gordon's",
            ],
          },
        ],
      },
      {
        name: "🍹 Cocktails",
        items: [
          {
            name: "Classic Cocktails",
            subitems: [
              "Mojito",
              "Margarita",
              "Cosmopolitan",
              "Old Fashioned",
              "Daiquiri",
            ],
          },
          {
            name: "Long Drinks",
            subitems: [
              "Long Island Iced Tea",
              "Singapore Sling",
              "Pina Colada",
              "Sex on the Beach",
              "Tequila Sunrise",
            ],
          },
          {
            name: "Signature Cocktails",
            subitems: [
              "Royal Saffron Martini",
              "Palace Sunset",
              "Nizam's Secret",
              "Gold Rush",
              "Midnight Royale",
            ],
          },
        ],
      },
      {
        name: "🥂 Premium Bar Services",
        items: [
          {
            name: "Exclusive",
            subitems: [
              "Sommelier Service (Wine Expert Consultation)",
              "Private Bar Setup in Room",
              "Custom Cocktail Mixing by Head Mixologist",
            ],
          },
          {
            name: "Packages",
            subitems: [
              "Royal Bar Package (Premium Spirits + Nibbles)",
              "Champagne Tower Setup",
              "Whiskey Tasting Session",
            ],
          },
        ],
      },
    ],
  },
  {
    icon: "💆",
    title: "Spa & Wellness",
    desc: "Surrender to ancient Ayurvedic wisdom and modern therapies in our opulent retreat.",
    subcategories: [
      {
        name: "🧘 Body Treatments",
        items: [
          {
            name: "Massages",
            subitems: [
              "Full Body Swedish Massage",
              "Deep Tissue Massage",
              "Hot Stone Therapy",
              "Aromatherapy Massage",
              "Thai Massage",
            ],
          },
          {
            name: "Scrubs & Wraps",
            subitems: [
              "Coffee Body Scrub",
              "Turmeric & Sandalwood Wrap",
              "Mud Body Wrap",
              "Chocolate Indulgence Wrap",
            ],
          },
        ],
      },
      {
        name: "🌿 Ayurveda",
        items: [
          {
            name: "Classic Therapies",
            subitems: [
              "Abhyanga (Full Body Oil Massage)",
              "Shirodhara (Oil Pour Therapy)",
              "Navarakizhi",
              "Elakizhi (Herbal Pouch)",
            ],
          },
          {
            name: "Detox Programs",
            subitems: [
              "Panchakarma Detox (5-Day)",
              "Herbal Steam Therapy",
              "Virechana Cleanse",
              "Nasya Therapy",
            ],
          },
        ],
      },
      {
        name: "♨️ Relaxation",
        items: [
          {
            name: "Heat Therapies",
            subitems: [
              "Sauna Bath (Finnish / Infrared)",
              "Steam Bath",
              "Jacuzzi Therapy",
              "Hydrotherapy Pool",
            ],
          },
          {
            name: "Float & Chill",
            subitems: [
              "Sensory Float Tank",
              "Ice Plunge Pool",
              "Relaxation Lounge Access",
              "Himalayan Salt Room",
            ],
          },
        ],
      },
      {
        name: "💅 Beauty & Grooming",
        items: [
          {
            name: "Face & Skin",
            subitems: [
              "Anti-Ageing Facial",
              "Gold Facial",
              "De-Tan Treatment",
              "Microdermabrasion",
              "LED Light Therapy",
            ],
          },
          {
            name: "Hair",
            subitems: [
              "Hair Spa & Keratin Treatment",
              "Scalp Oil Massage",
              "Hair Colour & Highlights",
              "Blowout & Styling",
            ],
          },
          {
            name: "Nails & Grooming",
            subitems: [
              "Manicure (Classic / Gel)",
              "Pedicure (Classic / Spa)",
              "Beard Grooming & Trim",
              "Bridal Grooming Package",
            ],
          },
        ],
      },
      {
        name: "🧖 Wellness Programs",
        items: [
          {
            name: "Mind & Body",
            subitems: [
              "Stress Relief Therapy (3-Day)",
              "Yoga & Pranayama Sessions",
              "Guided Meditation",
              "Sound Healing Bath",
            ],
          },
          {
            name: "Fitness Programs",
            subitems: [
              "Weight Loss Spa Program (7-Day)",
              "Full Body Detox Program",
              "Personalised Fitness Plan",
              "Nutritionist Consultation",
            ],
          },
        ],
      },
    ],
  },
  {
    icon: "🎉",
    title: "Events & Celebrations",
    desc: "Create timeless memories in our grand banquet halls with world-class event planning.",
    subcategories: [
      {
        name: "💒 Weddings",
        items: [
          {
            name: "Wedding Packages",
            subitems: [
              "Royal Palace Wedding Package",
              "Intimate Garden Wedding",
              "Destination Wedding Planning",
              "Pre-Wedding Shoot Setup",
            ],
          },
          {
            name: "Reception Services",
            subitems: [
              "Banquet Hall (800 pax)",
              "Catering & Bar Service",
              "Floral Decoration",
              "Live Entertainment & DJ",
            ],
          },
        ],
      },
      {
        name: "🎂 Social Events",
        items: [
          {
            name: "Birthdays",
            subitems: [
              "Kids Birthday Party Package",
              "Adult Milestone Celebration",
              "Surprise Party Planning",
              "Custom Themed Décor",
            ],
          },
          {
            name: "Anniversaries",
            subitems: [
              "Candlelight Dinner Package",
              "Couple's Spa & Dining Package",
              "Rooftop Anniversary Setup",
              "Personalised Gift Arrangements",
            ],
          },
        ],
      },
      {
        name: "🏢 Corporate Events",
        items: [
          {
            name: "Meetings & Conferences",
            subitems: [
              "Boardroom (20 pax)",
              "Conference Hall (200 pax)",
              "AV & Tech Setup",
              "Business Lunch Catering",
            ],
          },
          {
            name: "Team Events",
            subitems: [
              "Corporate Team Dinner",
              "Annual Day Celebrations",
              "Product Launch Events",
              "Award Ceremonies",
            ],
          },
        ],
      },
      {
        name: "🎊 Event Services",
        items: [
          {
            name: "Planning & Décor",
            subitems: [
              "Full Event Planning & Coordination",
              "Floral & Theme Decoration",
              "Stage & Lighting Design",
              "Photography & Videography",
            ],
          },
          {
            name: "Catering",
            subitems: [
              "Live Cooking Stations",
              "Multi-Cuisine Catering",
              "Custom Menu Planning",
              "Cake & Dessert Counter",
            ],
          },
        ],
      },
    ],
  },
  {
    icon: "🚗",
    title: "Guest Convenience",
    desc: "Seamless services ensuring every moment of your stay is effortless and extraordinary.",
    subcategories: [
      {
        name: "✈️ Transport",
        items: [
          {
            name: "Airport Services",
            subitems: [
              "Airport Pickup (Standard Car)",
              "Airport Drop",
              "Airport Pickup (Luxury BMW/Mercedes)",
              "Flight Booking Assistance",
            ],
          },
          {
            name: "City Transport",
            subitems: [
              "Taxi / Cab Booking",
              "Auto & App Cab Coordination",
              "Chauffeur-Driven Day Tours",
              "Outstation Cab Booking",
            ],
          },
        ],
      },
      {
        name: "🗺️ Travel & Tours",
        items: [
          {
            name: "Local Tours",
            subitems: [
              "Hyderabad Heritage Tour",
              "Charminar & Old City Tour",
              "Ramoji Film City Tour",
              "Golconda Fort & Qutb Shahi Tombs",
            ],
          },
          {
            name: "Outstation",
            subitems: [
              "Srisailam Day Trip",
              "Nagarjunasagar Tour",
              "Tirupati Package",
              "Custom Multi-Day Tour",
            ],
          },
        ],
      },
      {
        name: "🛎️ In-Hotel Services",
        items: [
          {
            name: "Housekeeping",
            subitems: [
              "Daily Room Cleaning",
              "Extra Pillow / Blanket Request",
              "Room Fragrance Change",
              "Turndown Service",
            ],
          },
          {
            name: "Laundry & More",
            subitems: [
              "Laundry (Standard 24hr)",
              "Express Laundry (3hr)",
              "Dry Cleaning",
              "Ironing & Pressing",
            ],
          },
          {
            name: "Concierge",
            subitems: [
              "Restaurant Reservations",
              "Event Tickets",
              "Courier & Postal Service",
              "Medical Assistance",
              "Wake-up Call Service",
            ],
          },
        ],
      },
    ],
  },
  {
    icon: "👑",
    title: "Royal & Premium",
    desc: "Unparalleled luxury — every detail bespoke, every moment unforgettable.",
    subcategories: [
      {
        name: "👑 Royal Stay",
        items: [
          {
            name: "Suite Experience",
            subitems: [
              "Royal Suite Access & Priority Allocation",
              "Personalised Room Setup & Décor",
              "Luxury Egyptian Cotton Bedding",
              "Aromatic Room Fragrance Setup",
              "Fresh Flower Arrangements Daily",
            ],
          },
          {
            name: "Exclusive Privileges",
            subitems: [
              "Complimentary Welcome Hamper",
              "Personal Butler Assigned",
              "Priority Early Check-in / Late Check-out",
              "Dedicated Royal Concierge Line",
            ],
          },
        ],
      },
      {
        name: "🍽️ Private Dining",
        items: [
          {
            name: "Indoor",
            subitems: [
              "Private Candlelight Dinner (Indoor)",
              "In-Room Private Chef Experience",
              "Wine Pairing Dinner",
              "Chef's Table Experience",
            ],
          },
          {
            name: "Outdoor",
            subitems: [
              "Rooftop Royal Dining",
              "Garden Private Dining",
              "Poolside Dinner",
              "Beachside Private Setup (On Request)",
            ],
          },
        ],
      },
      {
        name: "🛎️ VIP Services",
        items: [
          {
            name: "Butler & Assistant",
            subitems: [
              "Dedicated Personal Butler (24/7)",
              "Personal Shopping Assistant",
              "Wardrobe Valet Service",
              "Daily Newspaper & Itinerary Briefing",
            ],
          },
          {
            name: "Fast-Track",
            subitems: [
              "Priority Check-in (No Queue)",
              "Express Check-out",
              "Fast-track Laundry (1hr)",
              "Priority Dining Reservations",
            ],
          },
        ],
      },
      {
        name: "🎁 Luxury Personalisation",
        items: [
          {
            name: "Celebrations",
            subitems: [
              "Customised Birthday / Anniversary Décor",
              "Personalised Celebration Cake",
              "Luxury Surprise Arrangement",
              "Branded Gift Hampers",
            ],
          },
          {
            name: "Wellness Luxury",
            subitems: [
              "In-room Jacuzzi Setup",
              "Couples Spa Package",
              "Aromatherapy Room Diffuser",
              "Private Yoga & Meditation Session",
            ],
          },
        ],
      },
      {
        name: "🚘 Premium Transport",
        items: [
          {
            name: "Fleet",
            subitems: [
              "BMW 7 Series Pickup",
              "Mercedes S-Class",
              "Range Rover HSE",
              "Rolls-Royce (Special Request)",
            ],
          },
          {
            name: "Tours",
            subitems: [
              "City Royal Tour (Half Day)",
              "City Royal Tour (Full Day)",
              "Heritage Hyderabad in Luxury",
              "Couples Scenic Drive",
            ],
          },
        ],
      },
    ],
  },
];

// ─── MOCK GUEST ───────────────────────────────────────────────────────────────
const MOCK_GUESTS = {
  ROYAL001: {
    password: "guest123",
    name: "Mr. Arjun Mehta",
    room: "Grand Deluxe Suite – Room 501",
    checkIn: "2025-04-10",
    checkOut: "2025-04-17",
    adults: 2,
    children: 1,
    seniors: 0,
    services: [
      {
        date: "2025-04-10",
        item: "Airport Pickup (BMW)",
        category: "Transport",
        qty: 1,
        rate: 3500,
      },
      {
        date: "2025-04-11",
        item: "Hyderabadi Dum Biryani",
        category: "Dining",
        qty: 3,
        rate: 450,
      },
      {
        date: "2025-04-11",
        item: "Butter Chicken",
        category: "Dining",
        qty: 2,
        rate: 380,
      },
      {
        date: "2025-04-12",
        item: "Full Body Swedish Massage",
        category: "Spa",
        qty: 2,
        rate: 2200,
      },
      {
        date: "2025-04-12",
        item: "Sauna Bath Session",
        category: "Spa",
        qty: 2,
        rate: 800,
      },
      {
        date: "2025-04-13",
        item: "Kingfisher Premium",
        category: "Bar",
        qty: 4,
        rate: 220,
      },
      {
        date: "2025-04-13",
        item: "Rooftop Royal Dining (Private)",
        category: "Dining",
        qty: 1,
        rate: 6500,
      },
      {
        date: "2025-04-14",
        item: "Laundry & Dry Cleaning",
        category: "Convenience",
        qty: 1,
        rate: 1200,
      },
      {
        date: "2025-04-15",
        item: "Shirodhara Therapy",
        category: "Spa",
        qty: 1,
        rate: 3500,
      },
      {
        date: "2025-04-15",
        item: "Personalised Cake & Celebration Décor",
        category: "Premium",
        qty: 1,
        rate: 4500,
      },
      {
        date: "2025-04-16",
        item: "Buffet Breakfast",
        category: "Dining",
        qty: 3,
        rate: 650,
      },
      {
        date: "2025-04-16",
        item: "In-Room Dining – Midnight Snacks",
        category: "Dining",
        qty: 1,
        rate: 980,
      },
    ],
  },
};

// ─── FONT INJECTION ────────────────────────────────────────────────────────────
const injectFonts = () => {
  if (document.getElementById("rp-fonts")) return;
  const l = document.createElement("link");
  l.id = "rp-fonts";
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&display=swap";
  document.head.appendChild(l);
  const s = document.createElement("style");
  s.textContent = `*{box-sizing:border-box;margin:0;padding:0;}html{scroll-behavior:smooth;}body{background:${G.navy};font-family:'Lato',sans-serif;color:${G.cream};overflow-x:hidden;}::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-track{background:${G.navy};}::-webkit-scrollbar-thumb{background:${G.goldDim};border-radius:3px;}@keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}`;
  document.head.appendChild(s);
};

// ─── SMALL UI BITS ────────────────────────────────────────────────────────────
function GoldDivider() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "12px auto",
        maxWidth: 300,
      }}
    >
      <div
        style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(to right,transparent,${G.gold})`,
        }}
      />
      <span style={{ color: G.gold, fontSize: 16 }}>✦</span>
      <div
        style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(to left,transparent,${G.gold})`,
        }}
      />
    </div>
  );
}

function SectionTitle({ sub, title, light }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 48 }}>
      <p
        style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 11,
          letterSpacing: 4,
          color: G.gold,
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {sub}
      </p>
      <h2
        style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "clamp(28px,5vw,48px)",
          fontWeight: 700,
          color: light ? G.cream : G.navy,
          lineHeight: 1.2,
        }}
      >
        {title}
      </h2>
      <GoldDivider />
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ active, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [
    { id: "home", label: "Home" },
    { id: "rooms", label: "Rooms" },
    { id: "services", label: "Services" },
    { id: "book", label: "Book Now" },
    { id: "vault", label: "Royal Vault" },
  ];
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? `rgba(11,20,38,0.97)` : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${G.goldDim}33` : "none",
        transition: "all .4s ease",
        padding: "0 5%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 72,
      }}
    >
      <div
        style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 20,
          letterSpacing: 3,
          color: G.goldLight,
          cursor: "pointer",
        }}
        onClick={() => setPage("home")}
      >
        ✦ ROYAL PALACE
      </div>
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {links.map((l) => (
          <button
            key={l.id}
            onClick={() => setPage(l.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Cinzel',serif",
              fontSize: 11,
              letterSpacing: 2,
              color: active === l.id ? G.gold : G.cream,
              textTransform: "uppercase",
              borderBottom:
                active === l.id
                  ? `1px solid ${G.gold}`
                  : "1px solid transparent",
              paddingBottom: 2,
              transition: "all .3s",
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ setPage }) {
  return (
    <section
      style={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(ellipse at 60% 40%,${G.navyLight} 0%,${G.navy} 60%,#050A14 100%)`,
        overflow: "hidden",
      }}
    >
      {[400, 600, 800].map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: s,
            height: s,
            marginTop: -s / 2,
            marginLeft: -s / 2,
            border: `1px solid ${G.gold}${["22", "18", "10"][i]}`,
            borderRadius: "50%",
            animation: `spin ${30 + i * 10}s linear infinite`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.12,
        }}
      />
      <div
        style={{
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          padding: "0 5%",
          animation: "fadeUp .9s ease both",
        }}
      >
        <p
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 12,
            letterSpacing: 6,
            color: G.gold,
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          ✦ HYDERABAD'S FINEST LUXURY RETREAT ✦
        </p>
        <h1
          style={{
            fontFamily: "'Playfair Display',serif",
            fontStyle: "italic",
            fontSize: "clamp(40px,9vw,100px)",
            fontWeight: 900,
            lineHeight: 1.05,
            background: `linear-gradient(135deg,${G.goldLight},${G.gold},${G.goldDim},${G.gold})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 12,
          }}
        >
          Royal Palace
        </h1>
        <p
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "clamp(16px,2.5vw,24px)",
            color: G.creamDark,
            fontStyle: "italic",
            marginBottom: 8,
          }}
        >
          Where Royalty Meets Timeless Elegance
        </p>
        <GoldDivider />
        <p
          style={{
            fontFamily: "'Lato',sans-serif",
            fontSize: 14,
            color: `${G.cream}99`,
            letterSpacing: 2,
            marginBottom: 40,
          }}
        >
          EXPERIENCE THE GRANDEUR OF ROYAL HOSPITALITY
        </p>
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setPage("book")}
            style={{
              background: `linear-gradient(135deg,${G.gold},${G.goldDim})`,
              color: G.navy,
              border: "none",
              padding: "14px 40px",
              fontFamily: "'Cinzel',serif",
              fontSize: 12,
              letterSpacing: 3,
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: 2,
              boxShadow: `0 8px 30px ${G.gold}44`,
              transition: "transform .2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "translateY(-2px)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "")}
          >
            Reserve Your Chamber
          </button>
          <button
            onClick={() => setPage("services")}
            style={{
              background: "transparent",
              color: G.gold,
              border: `1px solid ${G.gold}`,
              padding: "14px 40px",
              fontFamily: "'Cinzel',serif",
              fontSize: 12,
              letterSpacing: 3,
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: 2,
              transition: "all .2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = `${G.gold}22`)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Explore Services
          </button>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          animation: "float 2s ease infinite",
        }}
      >
        <div
          style={{
            width: 1,
            height: 60,
            background: `linear-gradient(to bottom,transparent,${G.gold})`,
          }}
        />
      </div>
    </section>
  );
}

// ─── ROOMS ────────────────────────────────────────────────────────────────────
function RoomsSection({ setPage }) {
  const features = [
    "Panoramic city views from private balcony",
    "King-sized luxury bed with Egyptian cotton linens",
    "Marble ensuite with rain shower & Jacuzzi",
    "24/7 In-room dining & dedicated butler service",
    "Smart home controls — lighting, temperature, curtains",
    "Complimentary minibar & welcome fruit basket",
    "High-speed Wi-Fi & 65″ 4K Smart TV",
    "In-room safe, dressing lounge & walk-in wardrobe",
  ];
  return (
    <section style={{ background: G.cream, padding: "100px 5%" }}>
      <SectionTitle sub="Our Accommodation" title="The Grand Deluxe Suite" />
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              background: `url("https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80") center/cover`,
              height: 480,
              borderRadius: 4,
              boxShadow: `12px 12px 0 ${G.gold}44`,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: 20,
                right: -20,
                background: G.navy,
                color: G.gold,
                padding: "16px 24px",
                fontFamily: "'Cinzel',serif",
                fontSize: 12,
                letterSpacing: 2,
                borderLeft: `3px solid ${G.gold}`,
              }}
            >
              FROM ₹8,000 / NIGHT
            </div>
          </div>
        </div>
        <div>
          <p
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 18,
              color: G.textLight,
              fontStyle: "italic",
              marginBottom: 24,
              lineHeight: 1.7,
            }}
          >
            Step into a world of unrivalled opulence. Our signature Grand Deluxe
            Suite is a sanctuary of refined luxury, blending Royal heritage with
            contemporary comforts.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 32,
            }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                style={{ display: "flex", gap: 8, alignItems: "flex-start" }}
              >
                <span style={{ color: G.gold, fontSize: 14, marginTop: 2 }}>
                  ✦
                </span>
                <span
                  style={{
                    fontFamily: "'Lato',sans-serif",
                    fontSize: 13,
                    color: G.text,
                    lineHeight: 1.5,
                  }}
                >
                  {f}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setPage("book")}
            style={{
              background: G.navy,
              color: G.gold,
              border: `1px solid ${G.gold}`,
              padding: "14px 36px",
              fontFamily: "'Cinzel',serif",
              fontSize: 11,
              letterSpacing: 3,
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: 2,
              transition: "all .2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = G.gold;
              e.currentTarget.style.color = G.navy;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = G.navy;
              e.currentTarget.style.color = G.gold;
            }}
          >
            Book This Suite
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES (3-level tree) ───────────────────────────────────────────────────
function ServicesSection() {
  const [activeMain, setActiveMain] = useState(0);
  const [activeSub, setActiveSub] = useState(0);
  const [activeItem, setActiveItem] = useState(null);

  const mainSvc = SERVICES_TREE[activeMain];
  const subSvc = mainSvc.subcategories[activeSub];

  return (
    <section style={{ background: G.navy, padding: "100px 5%" }}>
      <SectionTitle sub="At Your Service" title="World-Class Amenities" light />
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        {/* Level 1: Main category tabs */}
        <div
          style={{
            display: "flex",
            gap: 0,
            marginBottom: 32,
            overflowX: "auto",
            borderBottom: `1px solid ${G.gold}33`,
          }}
        >
          {SERVICES_TREE.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveMain(i);
                setActiveSub(0);
                setActiveItem(null);
              }}
              style={{
                background: "none",
                border: "none",
                borderBottom:
                  activeMain === i
                    ? `2px solid ${G.gold}`
                    : "2px solid transparent",
                color: activeMain === i ? G.gold : `${G.cream}88`,
                padding: "14px 20px",
                fontFamily: "'Cinzel',serif",
                fontSize: 10,
                letterSpacing: 2,
                textTransform: "uppercase",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all .25s",
                marginBottom: -1,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              {s.title}
            </button>
          ))}
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 }}
        >
          {/* Level 2: Sub-category sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {mainSvc.subcategories.map((sc, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveSub(i);
                  setActiveItem(null);
                }}
                style={{
                  background: activeSub === i ? `${G.gold}22` : "transparent",
                  border: `1px solid ${
                    activeSub === i ? G.gold : G.gold + "22"
                  }`,
                  color: activeSub === i ? G.gold : G.creamDark,
                  padding: "12px 16px",
                  textAlign: "left",
                  cursor: "pointer",
                  fontFamily: "'Lato',sans-serif",
                  fontSize: 13,
                  transition: "all .2s",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    color: G.gold,
                    fontSize: 10,
                    opacity: activeSub === i ? 1 : 0.4,
                  }}
                >
                  ◆
                </span>
                {sc.name}
              </button>
            ))}
          </div>

          {/* Level 3 + detail panel */}
          <div
            style={{
              background: `linear-gradient(135deg,${G.navyMid},${G.navyLight})`,
              border: `1px solid ${G.gold}33`,
              borderRadius: 4,
              padding: 32,
              animation: "fadeUp .35s ease both",
            }}
          >
            <h3
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 26,
                color: G.goldLight,
                marginBottom: 6,
              }}
            >
              {mainSvc.icon} {subSvc.name}
            </h3>
            <p
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 15,
                color: `${G.cream}88`,
                fontStyle: "italic",
                marginBottom: 24,
              }}
            >
              {mainSvc.desc}
            </p>
            <GoldDivider />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
                gap: 12,
                marginTop: 20,
              }}
            >
              {subSvc.items.map((item, i) => (
                <div key={i}>
                  <button
                    onClick={() =>
                      setActiveItem(
                        activeItem === `${activeSub}-${i}`
                          ? null
                          : `${activeSub}-${i}`
                      )
                    }
                    style={{
                      width: "100%",
                      background:
                        activeItem === `${activeSub}-${i}`
                          ? `${G.gold}33`
                          : `${G.navy}88`,
                      border: `1px solid ${
                        activeItem === `${activeSub}-${i}`
                          ? G.gold
                          : G.gold + "33"
                      }`,
                      color:
                        activeItem === `${activeSub}-${i}`
                          ? G.goldLight
                          : G.cream,
                      padding: "12px 16px",
                      textAlign: "left",
                      cursor: "pointer",
                      borderRadius: 2,
                      fontFamily: "'Lato',sans-serif",
                      fontSize: 13,
                      transition: "all .2s",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{item.name}</span>
                    <span
                      style={{
                        color: G.gold,
                        fontSize: 12,
                        transition: "transform .2s",
                        transform:
                          activeItem === `${activeSub}-${i}`
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                      }}
                    >
                      ▶
                    </span>
                  </button>
                  {activeItem === `${activeSub}-${i}` && (
                    <div
                      style={{
                        background: `${G.navy}`,
                        border: `1px solid ${G.gold}22`,
                        borderTop: "none",
                        borderRadius: "0 0 2px 2px",
                        padding: "8px 12px",
                        animation: "fadeUp .25s ease both",
                      }}
                    >
                      {item.subitems.map((sub, j) => (
                        <div
                          key={j}
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                            padding: "5px 0",
                            borderBottom:
                              j < item.subitems.length - 1
                                ? `1px solid ${G.gold}11`
                                : "none",
                          }}
                        >
                          <span style={{ color: G.gold, fontSize: 9 }}>◈</span>
                          <span
                            style={{
                              fontFamily: "'Lato',sans-serif",
                              fontSize: 12,
                              color: `${G.cream}cc`,
                            }}
                          >
                            {sub}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── BOOKING ──────────────────────────────────────────────────────────────────
function BookingSection({ onBooked }) {
  const [step, setStep] = useState(1);
  const [flexMode, setFlexMode] = useState("dates");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [flexDuration, setFlexDuration] = useState("1 Week");
  const [guestName, setGuestName] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [seniors, setSeniors] = useState(0);
  const [payMode, setPayMode] = useState("");
  const [booked, setBooked] = useState(false);
  const [bookingId] = useState(
    "ROYAL" + Math.floor(1000 + Math.random() * 9000)
  );
  const [guestPass] = useState("rp" + Math.floor(100 + Math.random() * 900));

  const FLEX_MAP = { "3 Days": 3, "1 Week": 7, "2 Weeks": 14, "1 Month": 30 };
  const effectiveCI =
    checkIn ||
    (flexMode === "flexible" ? new Date().toISOString().split("T")[0] : "");
  let effectiveCO = checkOut;
  if (flexMode === "flexible" && effectiveCI) {
    const d = new Date(effectiveCI);
    d.setDate(d.getDate() + FLEX_MAP[flexDuration]);
    effectiveCO = d.toISOString().split("T")[0];
  }
  const nights = NIGHTS(effectiveCI, effectiveCO);
  const price = calcRoomPrice(
    effectiveCI,
    effectiveCO,
    adults,
    children,
    seniors
  );
  const canProceed1 =
    (flexMode === "dates" ? checkIn && checkOut && nights > 0 : true) &&
    adults + children + seniors > 0 &&
    guestName.trim().length > 1;

  function handleBook() {
    onBooked({
      id: bookingId,
      password: guestPass,
      name: guestName,
      checkIn: effectiveCI,
      checkOut: effectiveCO,
      adults,
      children,
      seniors,
      price,
      room: "Grand Deluxe Suite",
      services: [],
    });
    setBooked(true);
  }

  const inputS = {
    width: "100%",
    background: G.navyLight,
    border: `1px solid ${G.gold}55`,
    color: G.cream,
    padding: "12px 16px",
    fontFamily: "'Lato',sans-serif",
    fontSize: 14,
    outline: "none",
    borderRadius: 2,
  };
  const labelS = {
    fontFamily: "'Cinzel',serif",
    fontSize: 10,
    letterSpacing: 3,
    color: G.gold,
    textTransform: "uppercase",
    display: "block",
    marginBottom: 8,
  };
  const btnP = {
    background: `linear-gradient(135deg,${G.gold},${G.goldDim})`,
    color: G.navy,
    border: "none",
    padding: "14px 40px",
    fontFamily: "'Cinzel',serif",
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    cursor: "pointer",
    borderRadius: 2,
    boxShadow: `0 6px 20px ${G.gold}44`,
  };

  if (booked)
    return (
      <section
        style={{
          background: G.navy,
          padding: "100px 5%",
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: 560,
            width: "100%",
            textAlign: "center",
            background: `linear-gradient(135deg,${G.navyMid},${G.navyLight})`,
            border: `1px solid ${G.gold}66`,
            borderRadius: 4,
            padding: 60,
            animation: "fadeUp .6s ease both",
          }}
        >
          <div style={{ fontSize: 60, marginBottom: 20 }}>✦</div>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 36,
              color: G.goldLight,
              marginBottom: 8,
            }}
          >
            Reservation Confirmed!
          </h2>
          <GoldDivider />
          <p
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 17,
              color: G.creamDark,
              fontStyle: "italic",
              marginBottom: 32,
            }}
          >
            Welcome to Royal Palace, {guestName}. Your royal chamber awaits.
          </p>
          <div
            style={{
              background: G.navy,
              border: `1px solid ${G.gold}44`,
              borderRadius: 4,
              padding: 24,
              marginBottom: 24,
              textAlign: "left",
            }}
          >
            <p style={labelS}>Your Guest ID</p>
            <p
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 22,
                color: G.gold,
                letterSpacing: 4,
                marginBottom: 16,
              }}
            >
              {bookingId}
            </p>
            <p style={labelS}>Access Password</p>
            <p
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 22,
                color: G.gold,
                letterSpacing: 4,
                marginBottom: 16,
              }}
            >
              {guestPass}
            </p>
            <p
              style={{
                fontFamily: "'Lato',sans-serif",
                fontSize: 12,
                color: `${G.cream}88`,
                lineHeight: 1.6,
              }}
            >
              Use these in the{" "}
              <strong style={{ color: G.gold }}>Royal Vault</strong> to track
              your services and view your itemised bill throughout your stay.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              textAlign: "left",
              marginBottom: 24,
            }}
          >
            {[
              ["Guest Name", guestName],
              ["Check-In", effectiveCI],
              ["Check-Out", effectiveCO],
              ["Nights", nights],
              ["Payment", payMode.toUpperCase()],
              ["Room Total", `₹${price.toLocaleString("en-IN")}`],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{ borderLeft: `2px solid ${G.gold}`, paddingLeft: 12 }}
              >
                <div style={{ ...labelS, marginBottom: 4 }}>{k}</div>
                <div
                  style={{
                    color: G.cream,
                    fontSize: 14,
                    fontFamily: "'Lato',sans-serif",
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );

  return (
    <section
      style={{ background: G.navy, padding: "100px 5%", minHeight: "80vh" }}
    >
      <SectionTitle
        sub="Reserve Your Stay"
        title="Book Your Royal Chamber"
        light
      />
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {/* Step indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 48,
            gap: 0,
          }}
        >
          {["Dates, Guests & Name", "Review & Pay"].map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background:
                    step > i + 1
                      ? G.gold
                      : step === i + 1
                      ? `linear-gradient(135deg,${G.gold},${G.goldDim})`
                      : "transparent",
                  border: `1px solid ${G.gold}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Cinzel',serif",
                  fontSize: 12,
                  color: step === i + 1 || step > i + 1 ? G.navy : G.gold,
                }}
              >
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span
                style={{
                  marginLeft: 8,
                  fontFamily: "'Cinzel',serif",
                  fontSize: 10,
                  letterSpacing: 2,
                  color: step === i + 1 ? G.gold : `${G.cream}66`,
                  marginRight: 24,
                }}
              >
                {label}
              </span>
              {i < 1 && (
                <div
                  style={{
                    width: 60,
                    height: 1,
                    background: step > 1 ? G.gold : `${G.gold}33`,
                    marginRight: 24,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            background: `linear-gradient(135deg,${G.navyMid},${G.navyLight})`,
            border: `1px solid ${G.gold}33`,
            borderRadius: 4,
            padding: 48,
          }}
        >
          {step === 1 && (
            <div style={{ animation: "fadeUp .4s ease both" }}>
              {/* Guest Name */}
              <div style={{ marginBottom: 28 }}>
                <label style={labelS}>Full Name of Guest *</label>
                <input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Mr. Rajesh Kumar"
                  style={inputS}
                />
              </div>

              {/* Date mode */}
              <div
                style={{
                  display: "flex",
                  gap: 0,
                  marginBottom: 28,
                  borderRadius: 2,
                  overflow: "hidden",
                  border: `1px solid ${G.gold}44`,
                  width: "fit-content",
                }}
              >
                {["dates", "flexible"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFlexMode(mode)}
                    style={{
                      background:
                        flexMode === mode
                          ? `linear-gradient(135deg,${G.gold},${G.goldDim})`
                          : "transparent",
                      border: "none",
                      color: flexMode === mode ? G.navy : G.cream,
                      padding: "10px 24px",
                      fontFamily: "'Cinzel',serif",
                      fontSize: 10,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    {mode === "dates" ? "📅 Select Dates" : "✨ I'm Flexible"}
                  </button>
                ))}
              </div>

              {flexMode === "dates" ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 24,
                    marginBottom: 28,
                  }}
                >
                  <div>
                    <label style={labelS}>Check-In Date</label>
                    <input
                      type="date"
                      value={checkIn}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setCheckIn(e.target.value)}
                      style={inputS}
                    />
                  </div>
                  <div>
                    <label style={labelS}>Check-Out Date</label>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn || new Date().toISOString().split("T")[0]}
                      onChange={(e) => setCheckOut(e.target.value)}
                      style={inputS}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: 28 }}>
                  <label style={labelS}>Duration</label>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      flexWrap: "wrap",
                      marginBottom: 20,
                    }}
                  >
                    {Object.keys(FLEX_MAP).map((d) => (
                      <button
                        key={d}
                        onClick={() => setFlexDuration(d)}
                        style={{
                          background:
                            flexDuration === d
                              ? `linear-gradient(135deg,${G.gold},${G.goldDim})`
                              : "transparent",
                          border: `1px solid ${
                            flexDuration === d ? G.gold : G.gold + "44"
                          }`,
                          color: flexDuration === d ? G.navy : G.cream,
                          padding: "10px 20px",
                          fontFamily: "'Cinzel',serif",
                          fontSize: 10,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                          cursor: "pointer",
                          borderRadius: 2,
                        }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  <label style={labelS}>Arrival Date</label>
                  <input
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckIn(e.target.value)}
                    style={{ ...inputS, maxWidth: 280 }}
                  />
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 24,
                  marginBottom: 32,
                }}
              >
                {[
                  ["Adults (18–59)", adults, setAdults],
                  ["Children (3–12)", children, setChildren],
                  ["Seniors (60+)", seniors, setSeniors],
                ].map(([label, val, set]) => (
                  <div key={label}>
                    <label style={labelS}>{label}</label>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <button
                        onClick={() => set(Math.max(0, val - 1))}
                        style={{
                          ...inputS,
                          width: 36,
                          height: 36,
                          textAlign: "center",
                          fontSize: 18,
                          padding: 0,
                          cursor: "pointer",
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          fontFamily: "'Cinzel',serif",
                          fontSize: 20,
                          color: G.gold,
                          minWidth: 24,
                          textAlign: "center",
                        }}
                      >
                        {val}
                      </span>
                      <button
                        onClick={() => set(val + 1)}
                        style={{
                          ...inputS,
                          width: 36,
                          height: 36,
                          textAlign: "center",
                          fontSize: 18,
                          padding: 0,
                          cursor: "pointer",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {nights > 0 && (
                <div
                  style={{
                    borderTop: `1px solid ${G.gold}33`,
                    paddingTop: 20,
                    marginBottom: 28,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontFamily: "'Lato',sans-serif",
                          fontSize: 13,
                          color: `${G.cream}88`,
                        }}
                      >
                        {nights} night{nights > 1 ? "s" : ""} · {adults} adult
                        {adults > 1 ? "s" : ""}
                        {children > 0
                          ? ` · ${children} child${children > 1 ? "ren" : ""}`
                          : ""}
                        {seniors > 0
                          ? ` · ${seniors} senior${seniors > 1 ? "s" : ""}`
                          : ""}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Lato',sans-serif",
                          fontSize: 11,
                          color: `${G.cream}55`,
                          marginTop: 4,
                        }}
                      >
                        ₹8,000/night base · ₹500/child/night · ₹300/senior/night
                        · Weekend +20%
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          fontFamily: "'Cinzel',serif",
                          fontSize: 11,
                          letterSpacing: 2,
                          color: G.gold,
                          marginBottom: 4,
                        }}
                      >
                        ROOM TOTAL
                      </p>
                      <p
                        style={{
                          fontFamily: "'Playfair Display',serif",
                          fontSize: 32,
                          color: G.goldLight,
                        }}
                      >
                        ₹{price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                disabled={!canProceed1}
                onClick={() => setStep(2)}
                style={{
                  ...btnP,
                  opacity: canProceed1 ? 1 : 0.4,
                  cursor: canProceed1 ? "pointer" : "default",
                }}
              >
                Continue to Payment →
              </button>
              {!guestName.trim() && (
                <p
                  style={{
                    color: `${G.gold}99`,
                    fontSize: 12,
                    marginTop: 10,
                    fontFamily: "'Lato',sans-serif",
                  }}
                >
                  * Please enter your name to continue.
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <div style={{ animation: "fadeUp .4s ease both" }}>
              <h3
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 26,
                  color: G.goldLight,
                  marginBottom: 24,
                }}
              >
                Select Payment Method
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginBottom: 32,
                }}
              >
                {[
                  {
                    id: "cash",
                    label: "💵 Cash at Reception",
                    desc: "Pay at front desk on arrival",
                  },
                  {
                    id: "online",
                    label: "📱 Online Payment",
                    desc: "UPI / Net Banking / Wallets",
                  },
                  {
                    id: "credit",
                    label: "💳 Credit / Debit Card",
                    desc: "Visa, Mastercard, Amex",
                  },
                  {
                    id: "mixed",
                    label: "🔀 Mixed Payment",
                    desc: "Combine multiple methods",
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPayMode(opt.id)}
                    style={{
                      background:
                        payMode === opt.id ? `${G.gold}22` : "transparent",
                      border: `1px solid ${
                        payMode === opt.id ? G.gold : G.gold + "33"
                      }`,
                      color: G.cream,
                      padding: 20,
                      textAlign: "left",
                      cursor: "pointer",
                      borderRadius: 2,
                      transition: "all .2s",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Cinzel',serif",
                        fontSize: 11,
                        letterSpacing: 1,
                        color: payMode === opt.id ? G.gold : G.cream,
                        marginBottom: 6,
                      }}
                    >
                      {opt.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Lato',sans-serif",
                        fontSize: 12,
                        color: `${G.cream}77`,
                      }}
                    >
                      {opt.desc}
                    </p>
                  </button>
                ))}
              </div>
              <div
                style={{
                  background: G.navy,
                  border: `1px solid ${G.gold}33`,
                  borderRadius: 4,
                  padding: 24,
                  marginBottom: 32,
                }}
              >
                <h4
                  style={{
                    fontFamily: "'Cinzel',serif",
                    fontSize: 11,
                    letterSpacing: 3,
                    color: G.gold,
                    marginBottom: 16,
                    textTransform: "uppercase",
                  }}
                >
                  Booking Summary
                </h4>
                {[
                  ["Guest", guestName],
                  ["Grand Deluxe Suite", `${nights} nights`],
                  ["Room Total", `₹${price.toLocaleString("en-IN")}`],
                  ["Additional Services", "Billed at checkout"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: `1px solid ${G.gold}22`,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Lato',sans-serif",
                        fontSize: 13,
                        color: `${G.cream}aa`,
                      }}
                    >
                      {k}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Lato',sans-serif",
                        fontSize: 13,
                        color: G.cream,
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    background: "transparent",
                    color: G.gold,
                    border: `1px solid ${G.gold}`,
                    padding: "14px 32px",
                    fontFamily: "'Cinzel',serif",
                    fontSize: 11,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    cursor: "pointer",
                    borderRadius: 2,
                  }}
                >
                  ← Back
                </button>
                <button
                  disabled={!payMode}
                  onClick={handleBook}
                  style={{
                    ...btnP,
                    opacity: payMode ? 1 : 0.4,
                    cursor: payMode ? "pointer" : "default",
                  }}
                >
                  Confirm Reservation ✦
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── GUEST VAULT ──────────────────────────────────────────────────────────────
function GuestVault({ newBooking }) {
  const [guestId, setGuestId] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [guest, setGuest] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Merge static mock with newly booked guest — use ref so it persists
  const allGuests = {
    ...MOCK_GUESTS,
    ...(newBooking ? { [newBooking.id]: { ...newBooking } } : {}),
  };

  function handleLogin() {
    const key = guestId.trim().toUpperCase();
    const g = allGuests[key];
    if (g && g.password === password.trim()) {
      setGuest({ ...g, id: key });
      setLoggedIn(true);
      setError("");
    } else {
      setError(
        "Invalid Guest ID or Password. Please check your booking confirmation."
      );
    }
  }

  const inputS = {
    width: "100%",
    background: G.navyLight,
    border: `1px solid ${G.gold}55`,
    color: G.cream,
    padding: "14px 18px",
    fontFamily: "'Lato',sans-serif",
    fontSize: 15,
    outline: "none",
    borderRadius: 2,
  };
  const labelS = {
    fontFamily: "'Cinzel',serif",
    fontSize: 10,
    letterSpacing: 3,
    color: G.gold,
    textTransform: "uppercase",
    display: "block",
    marginBottom: 8,
  };

  if (!loggedIn)
    return (
      <section
        style={{
          background: G.navy,
          padding: "100px 5%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            width: "100%",
            background: `linear-gradient(135deg,${G.navyMid},${G.navyLight})`,
            border: `1px solid ${G.gold}44`,
            borderRadius: 4,
            padding: "60px 52px",
            animation: "fadeUp .6s ease both",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 36,
                color: G.gold,
                marginBottom: 8,
              }}
            >
              ✦
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 32,
                color: G.goldLight,
                marginBottom: 4,
              }}
            >
              The Royal Vault
            </h2>
            <p
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 16,
                color: `${G.cream}88`,
                fontStyle: "italic",
              }}
            >
              Your private sanctuary of services & billing
            </p>
            <GoldDivider />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelS}>Guest ID</label>
            <input
              value={guestId}
              onChange={(e) => setGuestId(e.target.value)}
              placeholder="e.g. ROYAL1234"
              style={inputS}
            />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={labelS}>Access Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputS}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          {error && (
            <p
              style={{
                color: "#E57373",
                fontSize: 13,
                marginBottom: 16,
                fontFamily: "'Lato',sans-serif",
              }}
            >
              {error}
            </p>
          )}
          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              background: `linear-gradient(135deg,${G.gold},${G.goldDim})`,
              color: G.navy,
              border: "none",
              padding: 16,
              fontFamily: "'Cinzel',serif",
              fontSize: 12,
              letterSpacing: 3,
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: 2,
            }}
          >
            Enter The Vault
          </button>
          <p
            style={{
              textAlign: "center",
              marginTop: 24,
              fontFamily: "'Lato',sans-serif",
              fontSize: 12,
              color: `${G.cream}55`,
            }}
          >
            Your credentials appear in your booking confirmation.
            <br />
            Demo: ID = <span style={{ color: G.gold }}>ROYAL001</span> · Pass ={" "}
            <span style={{ color: G.gold }}>guest123</span>
          </p>
        </div>
      </section>
    );

  const svcTotal = (guest.services || []).reduce(
    (s, x) => s + x.qty * x.rate,
    0
  );
  const roomTotal = calcRoomPrice(
    guest.checkIn,
    guest.checkOut,
    guest.adults || 2,
    guest.children || 0,
    guest.seniors || 0
  );
  const grandTotal = svcTotal + roomTotal;
  const nights = NIGHTS(guest.checkIn, guest.checkOut);
  const catColors = {
    Dining: "#F0A04B",
    Spa: "#9B7FD4",
    Bar: "#E57373",
    Transport: "#4FC3F7",
    Premium: "#C9A84C",
    Convenience: "#81C784",
  };
  const categories = [
    ...new Set((guest.services || []).map((s) => s.category)),
  ];

  return (
    <section
      style={{ background: G.navy, padding: "100px 5%", minHeight: "100vh" }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 40,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 10,
                letterSpacing: 4,
                color: G.gold,
                marginBottom: 4,
              }}
            >
              ✦ THE ROYAL VAULT
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 36,
                color: G.goldLight,
              }}
            >
              Welcome, {guest.name}
            </h2>
            <p
              style={{
                fontFamily: "'Lato',sans-serif",
                fontSize: 13,
                color: `${G.cream}77`,
                marginTop: 4,
              }}
            >
              Guest ID: {guest.id} · {guest.room || "Grand Deluxe Suite"}
            </p>
          </div>
          <button
            onClick={() => {
              setLoggedIn(false);
              setGuest(null);
              setGuestId("");
              setPassword("");
            }}
            style={{
              background: "transparent",
              border: `1px solid ${G.gold}55`,
              color: G.gold,
              padding: "10px 20px",
              fontFamily: "'Cinzel',serif",
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: 2,
            }}
          >
            Sign Out
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {[
            { label: "Check-In", value: guest.checkIn, icon: "📅" },
            { label: "Check-Out", value: guest.checkOut, icon: "🏁" },
            {
              label: "Duration",
              value: `${nights} Night${nights > 1 ? "s" : ""}`,
              icon: "🌙",
            },
            {
              label: "Outstanding",
              value: `₹${grandTotal.toLocaleString("en-IN")}`,
              icon: "💰",
              hi: true,
            },
          ].map((c) => (
            <div
              key={c.label}
              style={{
                background: `linear-gradient(135deg,${G.navyMid},${G.navyLight})`,
                border: `1px solid ${c.hi ? G.gold : G.gold + "33"}`,
                borderRadius: 4,
                padding: 20,
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
              <p
                style={{
                  fontFamily: "'Cinzel',serif",
                  fontSize: 9,
                  letterSpacing: 3,
                  color: G.gold,
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                {c.label}
              </p>
              <p
                style={{
                  fontFamily: c.hi
                    ? "'Playfair Display',serif"
                    : "'Lato',sans-serif",
                  fontSize: c.hi ? 22 : 15,
                  color: c.hi ? G.goldLight : G.cream,
                }}
              >
                {c.value}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: 0,
            marginBottom: 32,
            borderBottom: `1px solid ${G.gold}33`,
          }}
        >
          {["overview", "services", "bill"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "none",
                border: "none",
                borderBottom:
                  activeTab === tab
                    ? `2px solid ${G.gold}`
                    : "2px solid transparent",
                color: activeTab === tab ? G.gold : `${G.cream}88`,
                padding: "12px 24px",
                fontFamily: "'Cinzel',serif",
                fontSize: 10,
                letterSpacing: 3,
                textTransform: "uppercase",
                cursor: "pointer",
                marginBottom: -1,
              }}
            >
              {tab === "overview"
                ? "Overview"
                : tab === "services"
                ? "Services Used"
                : "Full Bill"}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div
            style={{
              animation: "fadeUp .4s ease both",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
            }}
          >
            <div
              style={{
                background: `linear-gradient(135deg,${G.navyMid},${G.navyLight})`,
                border: `1px solid ${G.gold}33`,
                borderRadius: 4,
                padding: 28,
              }}
            >
              <h4
                style={{
                  fontFamily: "'Cinzel',serif",
                  fontSize: 11,
                  letterSpacing: 3,
                  color: G.gold,
                  marginBottom: 20,
                  textTransform: "uppercase",
                }}
              >
                Spending by Category
              </h4>
              {[
                ["Room Charges", roomTotal],
                ...categories.map((cat) => [
                  cat,
                  (guest.services || [])
                    .filter((s) => s.category === cat)
                    .reduce((s, x) => s + x.qty * x.rate, 0),
                ]),
              ].map(([label, amt]) => {
                const pct = grandTotal > 0 ? (amt / grandTotal) * 100 : 0;
                return (
                  <div key={label} style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Lato',sans-serif",
                          fontSize: 13,
                          color: G.cream,
                        }}
                      >
                        {label}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Lato',sans-serif",
                          fontSize: 13,
                          color: catColors[label] || G.gold,
                        }}
                      >
                        ₹{amt.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 4,
                        background: `${G.cream}22`,
                        borderRadius: 2,
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: catColors[label] || G.gold,
                          borderRadius: 2,
                          transition: "width .6s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                background: `linear-gradient(135deg,${G.navyMid},${G.navyLight})`,
                border: `1px solid ${G.gold}33`,
                borderRadius: 4,
                padding: 28,
              }}
            >
              <h4
                style={{
                  fontFamily: "'Cinzel',serif",
                  fontSize: 11,
                  letterSpacing: 3,
                  color: G.gold,
                  marginBottom: 20,
                  textTransform: "uppercase",
                }}
              >
                Bill Summary
              </h4>
              {[
                ["Room Charges", roomTotal],
                ...categories.map((cat) => [
                  cat,
                  (guest.services || [])
                    .filter((s) => s.category === cat)
                    .reduce((s, x) => s + x.qty * x.rate, 0),
                ]),
              ].map(([l, a]) => (
                <div
                  key={l}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: `1px solid ${G.gold}22`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Lato',sans-serif",
                      fontSize: 13,
                      color: `${G.cream}cc`,
                    }}
                  >
                    {l}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Lato',sans-serif",
                      fontSize: 13,
                      color: G.cream,
                    }}
                  >
                    ₹{a.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cinzel',serif",
                    fontSize: 11,
                    letterSpacing: 2,
                    color: G.gold,
                  }}
                >
                  GRAND TOTAL
                </span>
                <span
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: 24,
                    color: G.goldLight,
                  }}
                >
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div style={{ animation: "fadeUp .4s ease both" }}>
            {(guest.services || []).length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 60,
                  color: `${G.cream}55`,
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 18,
                  fontStyle: "italic",
                }}
              >
                No services recorded yet. Enjoy your royal stay!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(guest.services || []).map((s, i) => (
                  <div
                    key={i}
                    style={{
                      background: `linear-gradient(135deg,${G.navyMid},${G.navyLight})`,
                      border: `1px solid ${G.gold}22`,
                      borderRadius: 4,
                      padding: "16px 24px",
                      display: "grid",
                      gridTemplateColumns: "110px 1fr auto auto auto",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Lato',sans-serif",
                        fontSize: 12,
                        color: `${G.cream}66`,
                      }}
                    >
                      {s.date}
                    </span>
                    <div>
                      <p
                        style={{
                          fontFamily: "'Lato',sans-serif",
                          fontSize: 14,
                          color: G.cream,
                        }}
                      >
                        {s.item}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Lato',sans-serif",
                          fontSize: 11,
                          color: catColors[s.category] || G.gold,
                          marginTop: 2,
                        }}
                      >
                        {s.category}
                      </p>
                    </div>
                    <span
                      style={{
                        fontFamily: "'Lato',sans-serif",
                        fontSize: 13,
                        color: `${G.cream}88`,
                      }}
                    >
                      Qty: {s.qty}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Lato',sans-serif",
                        fontSize: 13,
                        color: `${G.cream}88`,
                      }}
                    >
                      ₹{s.rate.toLocaleString("en-IN")} each
                    </span>
                    <span
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: 16,
                        color: G.goldLight,
                        minWidth: 90,
                        textAlign: "right",
                      }}
                    >
                      ₹{(s.qty * s.rate).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "bill" && (
          <div style={{ animation: "fadeUp .4s ease both" }}>
            <div
              style={{
                background: `linear-gradient(135deg,${G.navyMid},${G.navyLight})`,
                border: `1px solid ${G.gold}44`,
                borderRadius: 4,
                padding: "48px 52px",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <p
                  style={{
                    fontFamily: "'Cinzel',serif",
                    fontSize: 14,
                    letterSpacing: 6,
                    color: G.gold,
                  }}
                >
                  ✦ ROYAL PALACE ✦
                </p>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 13,
                    color: `${G.cream}77`,
                    letterSpacing: 3,
                    marginTop: 4,
                  }}
                >
                  HYDERABAD'S FINEST LUXURY RETREAT
                </p>
                <div style={{ margin: "16px 0" }}>
                  <GoldDivider />
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: 28,
                    color: G.goldLight,
                  }}
                >
                  FOLIO / INVOICE
                </h3>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 24,
                  marginBottom: 28,
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "'Cinzel',serif",
                      fontSize: 9,
                      letterSpacing: 3,
                      color: G.gold,
                      marginBottom: 8,
                    }}
                  >
                    GUEST DETAILS
                  </p>
                  <p
                    style={{
                      fontFamily: "'Lato',sans-serif",
                      fontSize: 14,
                      color: G.cream,
                    }}
                  >
                    {guest.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Lato',sans-serif",
                      fontSize: 13,
                      color: `${G.cream}77`,
                    }}
                  >
                    ID: {guest.id}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Lato',sans-serif",
                      fontSize: 13,
                      color: `${G.cream}77`,
                    }}
                  >
                    {guest.room || "Grand Deluxe Suite"}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontFamily: "'Cinzel',serif",
                      fontSize: 9,
                      letterSpacing: 3,
                      color: G.gold,
                      marginBottom: 8,
                    }}
                  >
                    STAY DETAILS
                  </p>
                  <p
                    style={{
                      fontFamily: "'Lato',sans-serif",
                      fontSize: 13,
                      color: `${G.cream}77`,
                    }}
                  >
                    Check-In: {guest.checkIn}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Lato',sans-serif",
                      fontSize: 13,
                      color: `${G.cream}77`,
                    }}
                  >
                    Check-Out: {guest.checkOut}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Lato',sans-serif",
                      fontSize: 13,
                      color: `${G.cream}77`,
                    }}
                  >
                    {nights} Nights
                  </p>
                </div>
              </div>
              <div
                style={{
                  borderTop: `1px solid ${G.gold}33`,
                  borderBottom: `1px solid ${G.gold}33`,
                  padding: "8px 0",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "90px 1fr 60px 110px 110px",
                    gap: 12,
                    padding: "6px 0",
                  }}
                >
                  {["Date", "Description", "Qty", "Rate (₹)", "Amount (₹)"].map(
                    (h) => (
                      <span
                        key={h}
                        style={{
                          fontFamily: "'Cinzel',serif",
                          fontSize: 9,
                          letterSpacing: 2,
                          color: G.gold,
                          textTransform: "uppercase",
                        }}
                      >
                        {h}
                      </span>
                    )
                  )}
                </div>
              </div>
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "90px 1fr 60px 110px 110px",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom: `1px solid ${G.gold}11`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Lato',sans-serif",
                      fontSize: 12,
                      color: `${G.cream}66`,
                    }}
                  >
                    {guest.checkIn}
                  </span>
                  <div>
                    <p
                      style={{
                        fontFamily: "'Lato',sans-serif",
                        fontSize: 13,
                        color: G.cream,
                      }}
                    >
                      Grand Deluxe Suite Accommodation
                    </p>
                    <p
                      style={{
                        fontFamily: "'Lato',sans-serif",
                        fontSize: 11,
                        color: `${G.gold}88`,
                      }}
                    >
                      Room Charges
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: "'Lato',sans-serif",
                      fontSize: 13,
                      color: `${G.cream}88`,
                    }}
                  >
                    {nights}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Lato',sans-serif",
                      fontSize: 13,
                      color: `${G.cream}88`,
                    }}
                  >
                    8,000+
                  </span>
                  <span
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: 14,
                      color: G.goldLight,
                      textAlign: "right",
                    }}
                  >
                    ₹{roomTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                {(guest.services || []).map((s, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "90px 1fr 60px 110px 110px",
                      gap: 12,
                      padding: "10px 0",
                      borderBottom: `1px solid ${G.gold}11`,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Lato',sans-serif",
                        fontSize: 12,
                        color: `${G.cream}66`,
                      }}
                    >
                      {s.date}
                    </span>
                    <div>
                      <p
                        style={{
                          fontFamily: "'Lato',sans-serif",
                          fontSize: 13,
                          color: G.cream,
                        }}
                      >
                        {s.item}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Lato',sans-serif",
                          fontSize: 11,
                          color: catColors[s.category] || G.gold,
                        }}
                      >
                        {s.category}
                      </p>
                    </div>
                    <span
                      style={{
                        fontFamily: "'Lato',sans-serif",
                        fontSize: 13,
                        color: `${G.cream}88`,
                      }}
                    >
                      {s.qty}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Lato',sans-serif",
                        fontSize: 13,
                        color: `${G.cream}88`,
                      }}
                    >
                      ₹{s.rate.toLocaleString("en-IN")}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: 14,
                        color: G.goldLight,
                        textAlign: "right",
                      }}
                    >
                      ₹{(s.qty * s.rate).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <div style={{ minWidth: 300 }}>
                  {[
                    ["Room Subtotal", roomTotal],
                    ["Services Subtotal", svcTotal],
                  ].map(([l, a]) => (
                    <div
                      key={l}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: `1px solid ${G.gold}22`,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Lato',sans-serif",
                          fontSize: 13,
                          color: `${G.cream}aa`,
                        }}
                      >
                        {l}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Lato',sans-serif",
                          fontSize: 13,
                          color: G.cream,
                        }}
                      >
                        ₹{a.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: 16,
                      borderTop: `1px solid ${G.gold}44`,
                      marginTop: 8,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Cinzel',serif",
                        fontSize: 12,
                        letterSpacing: 2,
                        color: G.gold,
                      }}
                    >
                      GRAND TOTAL
                    </span>
                    <span
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: 28,
                        color: G.goldLight,
                      }}
                    >
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  marginTop: 32,
                  paddingTop: 24,
                  borderTop: `1px solid ${G.gold}22`,
                }}
              >
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 14,
                    color: `${G.cream}66`,
                    fontStyle: "italic",
                  }}
                >
                  Thank you for choosing Royal Palace. It has been our honour to
                  serve you.
                </p>
                <p
                  style={{
                    fontFamily: "'Cinzel',serif",
                    fontSize: 10,
                    letterSpacing: 3,
                    color: G.gold,
                    marginTop: 8,
                  }}
                >
                  ✦ ROYAL PALACE, HYDERABAD ✦
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer
      style={{
        background: "#050A14",
        borderTop: `1px solid ${G.gold}33`,
        padding: "60px 5% 40px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: 48,
            marginBottom: 48,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 22,
                color: G.gold,
                letterSpacing: 3,
                marginBottom: 12,
              }}
            >
              ✦ ROYAL PALACE
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 15,
                color: `${G.cream}88`,
                fontStyle: "italic",
                lineHeight: 1.7,
                maxWidth: 320,
              }}
            >
              A timeless sanctuary of royal luxury in the heart of Hyderabad,
              where every guest is treated as royalty.
            </p>
          </div>
          <div>
            <p
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 10,
                letterSpacing: 3,
                color: G.gold,
                marginBottom: 16,
              }}
            >
              NAVIGATE
            </p>
            {[
              ["home", "Home"],
              ["rooms", "Rooms"],
              ["services", "Services"],
              ["book", "Book Now"],
              ["vault", "Royal Vault"],
            ].map(([id, label]) => (
              <p
                key={id}
                onClick={() => setPage(id)}
                style={{
                  fontFamily: "'Lato',sans-serif",
                  fontSize: 13,
                  color: `${G.cream}88`,
                  cursor: "pointer",
                  marginBottom: 8,
                  transition: "color .2s",
                }}
                onMouseOver={(e) => (e.target.style.color = G.gold)}
                onMouseOut={(e) => (e.target.style.color = `${G.cream}88`)}
              >
                {label}
              </p>
            ))}
          </div>
          <div>
            <p
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 10,
                letterSpacing: 3,
                color: G.gold,
                marginBottom: 16,
              }}
            >
              CONTACT
            </p>
            {[
              "📍 Banjara Hills, Hyderabad",
              "📞 +91 40 2345 6789",
              "✉ royalstay@royalpalace.in",
              "⏰ Open 24/7",
            ].map((c) => (
              <p
                key={c}
                style={{
                  fontFamily: "'Lato',sans-serif",
                  fontSize: 13,
                  color: `${G.cream}88`,
                  marginBottom: 8,
                }}
              >
                {c}
              </p>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {[
            { symbol: "f", bg: "#1877F2", title: "Facebook" },
            {
              symbol: "◎",
              bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
              title: "Instagram",
            },
            { symbol: "𝕏", bg: "#111", title: "X / Twitter" },
            { symbol: "⊕", bg: "#333", title: "Threads" },
            { symbol: "in", bg: "#0A66C2", title: "LinkedIn" },
          ].map((s) => (
            <a
              key={s.title}
              href="#"
              title={s.title}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: s.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Georgia,serif",
                fontSize: 16,
                color: G.white,
                textDecoration: "none",
                transition: "transform .2s,box-shadow .2s",
                boxShadow: "0 4px 12px rgba(0,0,0,.4)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 8px 20px ${G.gold}66`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,.4)";
              }}
            >
              {s.symbol}
            </a>
          ))}
        </div>
        <GoldDivider />
        <p
          style={{
            textAlign: "center",
            fontFamily: "'Lato',sans-serif",
            fontSize: 12,
            color: `${G.cream}44`,
            marginTop: 16,
          }}
        >
          © 2025 Royal Palace Hotel, Hyderabad. All Rights Reserved. · Crafted
          with grandeur.
        </p>
      </div>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [newBooking, setNewBooking] = useState(null);
  useEffect(() => {
    injectFonts();
  }, []);

  function navigateTo(p) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div style={{ minHeight: "100vh", background: G.navy }}>
      <Navbar active={page} setPage={navigateTo} />
      {page === "home" && (
        <>
          <Hero setPage={navigateTo} />
          <RoomsSection setPage={navigateTo} />
          <ServicesSection />
          <Footer setPage={navigateTo} />
        </>
      )}
      {page === "rooms" && (
        <>
          <div style={{ paddingTop: 72 }}>
            <RoomsSection setPage={navigateTo} />
          </div>
          <Footer setPage={navigateTo} />
        </>
      )}
      {page === "services" && (
        <>
          <div style={{ paddingTop: 72 }}>
            <ServicesSection />
          </div>
          <Footer setPage={navigateTo} />
        </>
      )}
      {page === "book" && (
        <>
          <div style={{ paddingTop: 72 }}>
            <BookingSection
              onBooked={(b) => {
                setNewBooking(b);
              }}
            />
          </div>
          <Footer setPage={navigateTo} />
        </>
      )}
      {page === "vault" && (
        <>
          <div style={{ paddingTop: 72 }}>
            <GuestVault newBooking={newBooking} />
          </div>
          <Footer setPage={navigateTo} />
        </>
      )}
    </div>
  );
}
