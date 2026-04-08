export const indianPartners = [
    {
        email: "taj.palace.delhi@example.com",
        password: "partner123",
        companyName: "The Taj Palace Delhi",
        destinations: "New Delhi",
        type: "Hotel",
        specializations: ["Luxury", "Heritage", "Business"],
        budgetRange: { min: 15000, max: 45000 },
        rating: 5,
        description: "An iconic luxury hotel in the heart of India's capital, The Taj Palace Delhi offers world-class hospitality with stunning views of the city. Experience regal comfort with modern amenities, Michelin-starred dining, and impeccable service.",
        images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"],
        amenities: ["Rooftop Pool", "Jiva Spa", "Multiple Dining Options", "Business Center", "Concierge Service", "Valet Parking"],
        startingPrice: 18500,
        
        // Hotel-specific fields
        address: {
            street: "Man Singh Road, Area B",
            city: "New Delhi",
            pinCode: "110001",
            country: "India"
        },
        starRating: 5,
        roomTypes: [
            { name: "Deluxe Room", price: 18500 },
            { name: "Luxury Suite", price: 28000 },
            { name: "Presidential Suite", price: 45000 }
        ],
        contactInfo: {
            phone: "+91-11-23060161",
            website: "www.tajhotels.com",
            email: "tajpalace.delhi@tajhotels.com",
            facebook: "https://www.facebook.com/TajPalaceDelhi",
            instagram: "https://www.instagram.com/tajpalacedelhi"
        },
        activities: [
            { name: "Heritage Walk", category: "Cultural", duration: "3 hours", price: 2500, description: "Guided tour through Delhi's historic landmarks" },
            { name: "Spa Therapy", category: "Wellness", duration: "2 hours", price: 8000, description: "Traditional Indian wellness treatments" },
            { name: "City Tour", category: "Sightseeing", duration: "Full day", price: 5000, description: "Comprehensive city exploration with expert guide" }
        ],
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        sightSeeings: [
            {
                name: "India Gate",
                images: ["https://images.unsplash.com/photo-1564507592325-021d7daf1c94?w=800"],
                description: "Iconic war memorial and national symbol of India",
                entryFee: 0
            },
            {
                name: "Red Fort",
                images: ["https://images.unsplash.com/photo-1564507592325-021d7daf1c94?w=800"],
                description: "Historic fort and former residence of Mughal emperors",
                entryFee: 500
            }
        ]
    },
    {
        email: "oberoi.udaivilas@example.com",
        password: "partner123",
        companyName: "The Oberoi Udaivilas",
        destinations: "Udaipur",
        type: "Hotel",
        specializations: ["Ultra-Luxury", "Honeymoon", "Royal"],
        budgetRange: { min: 35000, max: 120000 },
        rating: 5,
        description: "Situated on the banks of Lake Pichola, The Oberoi Udaivilas is a magnificent palace hotel that epitomizes royal Rajasthani hospitality. With intricate architecture, private pools, and breathtaking lake views, it's a dream destination.",
        images: ["https://images.unsplash.c om/photo-1582719508461-905c673771fd?w=800"],
        amenities: ["Private Pool Villas", "Spa", "Lake View Dining", "Boat Rides", "Cultural Performances", "Butler Service"],
        startingPrice: 42000,
        
        // Hotel-specific fields
        address: {
            street: "Haridas Ji Ki Magri",
            city: "Udaipur",
            pinCode: "313001",
            country: "India"
        },
        starRating: 5,
        roomTypes: [
            { name: "Premier Room", price: 42000 },
            { name: "Luxury Suite", price: 65000 },
            { name: "Kohinoor Suite", price: 120000 }
        ],
        contactInfo: {
            phone: "+91-294-2433300",
            website: "www.oberoihotels.com",
            email: "udaivilas@oberoihotels.com"
        },
        activities: [
            { name: "Boat Ride", category: "Experience", duration: "1 hour", price: 3000, description: "Scenic boat ride on Lake Pichola" },
            { name: "Spa Treatment", category: "Wellness", duration: "2 hours", price: 8000, description: "Traditional Rajasthani spa therapies" },
            { name: "Cultural Show", category: "Entertainment", duration: "1.5 hours", price: 2000, description: "Rajasthani folk dance and music performance" }
        ],
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        sightSeeings: [
            {
                name: "City Palace",
                images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"],
                description: "Largest palace complex in Rajasthan overlooking Lake Pichola",
                entryFee: 300
            },
            {
                name: "Lake Pichola",
                images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"],
                description: "Artificial freshwater lake with scenic boat rides",
                entryFee: 0
            }
        ]
    },
    {
        email: "taj.mahal.palace.mumbai@example.com",
        password: "partner123",
        companyName: "Taj Mahal Palace Mumbai",
        destinations: "Mumbai",
        type: "Hotel",
        specializations: ["Iconic", "Luxury", "Heritage"],
        budgetRange: { min: 25000, max: 85000 },
        rating: 5,
        description: "India's most iconic hotel, the Taj Mahal Palace Mumbai stands majestically overlooking the Arabian Sea and the Gateway of India. A symbol of Indian hospitality since 1903, it combines old-world charm with modern luxury.",
        images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"],
        amenities: ["Sea-facing Rooms", "Jiva Spa", "Zodiac Grill", "Heritage Wing", "Pool", "Shopping Arcade"],
        startingPrice: 28500,
        
        // Hotel-specific fields
        address: {
            street: "Apollo Bandar",
            city: "Mumbai",
            pinCode: "400001",
            country: "India"
        },
        starRating: 5,
        roomTypes: [
            { name: "Deluxe Room", price: 28500 },
            { name: "Luxury Suite", price: 45000 },
            { name: "Grand Suite", price: 85000 }
        ],
        contactInfo: {
            phone: "+91-22-66653333",
            website: "www.tajhotels.com",
            email: "tajmahal.mumbai@tajhotels.com",
            facebook: "https://www.facebook.com/TajMahalPalaceMumbai",
            twitter: "https://twitter.com/TajMahalPalace"
        },
        activities: [
            { name: "Heritage Tour", category: "Cultural", duration: "2 hours", price: 3000, description: "Guided tour of the historic hotel" },
            { name: "Spa Treatment", category: "Wellness", duration: "2 hours", price: 9000, description: "Luxury spa therapies" },
            { name: "Yacht Experience", category: "Experience", duration: "3 hours", price: 15000, description: "Private yacht ride on Arabian Sea" }
        ],
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        sightSeeings: [
            {
                name: "Gateway of India",
                images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"],
                description: "Iconic monument and Mumbai's most recognizable landmark",
                entryFee: 0
            },
            {
                name: "Marine Drive",
                images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"],
                description: "Scenic waterfront promenade known as Queen's Necklace",
                entryFee: 0
            }
        ]
    },
    {
        email: "leela.palace.bangalore@example.com",
        password: "partner123",
        companyName: "The Leela Palace Bangalore",
        destinations: "Bangalore",
        type: "Hotel",
        specializations: ["Luxury", "Art", "Wellness"],
        budgetRange: { min: 12000, max: 45000 },
        rating: 5,
        description: "Inspired by the royal Mysore Palace, The Leela Palace Bangalore is an architectural marvel featuring hand-carved furniture, original artworks, and lush gardens. A sanctuary of luxury in India's Silicon Valley.",
        images: ["https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800"],
        amenities: ["Art Gallery", "Spa", "Rooftop Pool", "Fine Dining", "Library", "Yoga Pavilion"],
        startingPrice: 14500,
        
        // Hotel-specific fields
        address: {
            street: "23, Old Airport Road",
            city: "Bangalore",
            pinCode: "560008",
            country: "India"
        },
        starRating: 5,
        roomTypes: [
            { name: "Deluxe Room", price: 14500 },
            { name: "Royal Club", price: 22000 },
            { name: "Grand Suite", price: 45000 }
        ],
        contactInfo: {
            phone: "+91-80-25212121",
            website: "www.theleela.com",
            email: "leela.bangalore@theleela.com",
            facebook: "https://www.facebook.com/TheLeelaBangalore",
            instagram: "https://www.instagram.com/theleela_palace_bangalore"
        },
        activities: [
            { name: "Art Tour", category: "Cultural", duration: "1 hour", price: 1500, description: "Guided tour of hotel's art collection" },
            { name: "Spa Treatment", category: "Wellness", duration: "2 hours", price: 7000, description: "Traditional Kerala spa therapies" },
            { name: "Wine Tasting", category: "Experience", duration: "2 hours", price: 4000, description: "Premium wine tasting sessions" }
        ],
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        sightSeeings: [
            {
                name: "Lalbagh Botanical Garden",
                images: ["https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800"],
                description: "Famous botanical garden with rare plant species",
                entryFee: 50
            },
            {
                name: "Bangalore Palace",
                images: ["https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800"],
                description: "Historic palace inspired by Windsor Castle",
                entryFee: 230
            }
        ]
    },
    {
        email: "wildflower.hall.shimla@example.com",
        password: "partner123",
        companyName: "Wildflower Hall Shimla",
        destinations: "Shimla",
        type: "Hotel",
        specializations: ["Mountain", "Luxury", "Adventure"],
        budgetRange: { min: 18000, max: 55000 },
        rating: 5,
        description: "Perched at 8,250 feet in the Himalayas, Wildflower Hall offers panoramic views of snow-capped peaks and cedar forests. Once the residence of Lord Kitchener, it's now an Oberoi luxury retreat perfect for mountain lovers.",
        images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800"],
        amenities: ["Mountain Views", "Spa", "Heated Pool", "Adventure Activities", "Fine Dining", "Bonfire Evenings"],
        startingPrice: 22000,
        
        // Hotel-specific fields
        address: {
            street: "Charabra",
            city: "Shimla",
            pinCode: "171012",
            country: "India"
        },
        starRating: 5,
        roomTypes: [
            { name: "Deluxe Room", price: 22000 },
            { name: "Premium Suite", price: 35000 },
            { name: "Honeymoon Suite", price: 55000 }
        ],
        contactInfo: {
            phone: "+91-177-2548585",
            website: "www.oberoihotels.com",
            email: "wildflowerhall.shimla@oberoihotels.com",
            facebook: "https://www.facebook.com/WildflowerHallShimla",
            instagram: "https://www.instagram.com/wildflowerhall"
        },
        activities: [
            { name: "Mountain Trek", category: "Adventure", duration: "4 hours", price: 4000, description: "Guided trek through Himalayan trails" },
            { name: "Spa Therapy", category: "Wellness", duration: "2 hours", price: 8500, description: "Mountain-inspired wellness treatments" },
            { name: "Bonfire Dinner", category: "Experience", duration: "3 hours", price: 6000, description: "Evening bonfire with mountain cuisine" }
        ],
        checkIn: "2:00 PM",
        checkOut: "11:00 AM",
        sightSeeings: [
            {
                name: "The Ridge",
                images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800"],
                description: "Famous open space with panoramic mountain views",
                entryFee: 0
            },
            {
                name: "Mall Road",
                images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800"],
                description: "Historic pedestrian street with colonial architecture",
                entryFee: 0
            }
        ]
    },
    {
        email: "rambagh.palace.jaipur@example.com",
        password: "partner123",
        companyName: "Rambagh Palace Jaipur",
        destinations: "Jaipur",
        type: "Hotel",
        specializations: ["Royal", "Heritage", "Luxury"],
        budgetRange: { min: 30000, max: 150000 },
        rating: 5,
        description: "The former residence of the Maharaja of Jaipur, Rambagh Palace is a jewel of Rajasthan. With 47 acres of Mughal gardens, opulent suites, and royal dining experiences, it offers an authentic taste of royalty.",
        images: ["https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800"],
        amenities: ["Palace Suites", "Spa", "Royal Gardens", "Heritage Tours", "Traditional Dining", "Vintage Car Rides"],
        startingPrice: 35000,

        address: {
        street: "Bhawani Singh Rd",
        city: "Jaipur",
        pinCode: "302005",
        country: "India"
        },
        starRating: 5,
        roomTypes: [
        { name: "Palace Room", price: 35000 },
        { name: "Royal Suite", price: 80000 },
        { name: "Grand Presidential Suite", price: 150000 }
        ],
        contactInfo: {
        phone: "+91-141-2385700",
        website: "www.tajhotels.com",
        email: "rambagh.jaipur@tajhotels.com",
        facebook: "https://www.facebook.com/TajRambaghPalace",
        instagram: "https://www.instagram.com/tajrambaghpalace"
        },
        activities: [
        { name: "Heritage Walk", category: "Culture", duration: "2 hours", price: 3000, description: "Guided tour of palace history and architecture" },
        { name: "Royal Dining Experience", category: "Experience", duration: "2 hours", price: 7000, description: "Traditional Rajasthani fine dining" },
        { name: "Vintage Car Ride", category: "Leisure", duration: "1 hour", price: 5000, description: "Ride in a classic royal car" }
        ],
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        sightSeeings: [
        { name: "Amber Fort", images: [], description: "Historic fort known for artistic Hindu style elements", entryFee: 500 },
        { name: "Hawa Mahal", images: [], description: "Iconic palace with honeycomb facade", entryFee: 200 },
        { name: "City Palace", images: [], description: "Royal residence with museums and courtyards", entryFee: 700 },
        { name: "Jantar Mantar", images: [], description: "UNESCO-listed astronomical observatory", entryFee: 200 },
        { name: "Nahargarh Fort", images: [], description: "Fort offering panoramic views of Jaipur", entryFee: 300 },
        { name: "Jal Mahal", images: [], description: "Palace located in the middle of Man Sagar Lake", entryFee: 0 }
        ]
    },
    {
        email: "taj.exotica.goa@example.com",
        password: "partner123",
        companyName: "Taj Exotica Resort & Spa Goa",
        destinations: "Goa",
        type: "Hotel",
        specializations: ["Beach", "Luxury", "Wellness"],
        budgetRange: { min: 15000, max: 60000 },
        rating: 4,
        description: "Set amidst 56 acres of lush gardens and overlooking the Arabian Sea, Taj Exotica Goa is a Mediterranean-style resort offering pristine beaches, world-class spa treatments, and vibrant Goan culture.",
        images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"],
        amenities: ["Private Beach", "Jiva Spa", "9-hole Golf Course", "Water Sports", "Multiple Pools", "Kids Club"],
        startingPrice: 18000,

        address: {
        street: "Benaulim Beach",
        city: "Goa",
        pinCode: "403716",
        country: "India"
        },
        starRating: 4,
        roomTypes: [
        { name: "Garden View Room", price: 18000 },
        { name: "Sea View Room", price: 30000 },
        { name: "Luxury Villa", price: 60000 }
        ],
        contactInfo: {
        phone: "+91-832-6683333",
        website: "www.tajhotels.com",
        email: "exotica.goa@tajhotels.com",
        facebook: "https://www.facebook.com/TajExoticaGoa",
        instagram: "https://www.instagram.com/tajexoticagoa"
        },
        activities: [
        { name: "Water Sports", category: "Adventure", duration: "2 hours", price: 4000, description: "Jet skiing, parasailing, and more" },
        { name: "Spa Therapy", category: "Wellness", duration: "2 hours", price: 6000, description: "Relaxing treatments at Jiva Spa" },
        { name: "Beach Dinner", category: "Experience", duration: "2 hours", price: 8000, description: "Private dining by the sea" }
        ],
        checkIn: "2:00 PM",
        checkOut: "11:00 AM",
        sightSeeings: [
        { name: "Basilica of Bom Jesus", images: [], description: "Famous church and UNESCO site", entryFee: 0 },
        { name: "Fort Aguada", images: [], description: "Historic Portuguese fort", entryFee: 0 },
        { name: "Dudhsagar Falls", images: [], description: "Spectacular four-tiered waterfall", entryFee: 400 },
        { name: "Anjuna Beach", images: [], description: "Popular beach known for nightlife", entryFee: 0 },
        { name: "Chapora Fort", images: [], description: "Fort with scenic sunset views", entryFee: 0 },
        { name: "Spice Plantations", images: [], description: "Guided tours of spice farms", entryFee: 500 }
        ]
    },
    {
        email: "aman.i.khas.ranthambore@example.com",
        password: "partner123",
        companyName: "Aman-i-Khás Ranthambore",
        destinations: "Ranthambore",
        type: "Hotel",
        specializations: ["Wildlife", "Luxury", "Adventure"],
        budgetRange: { min: 80000, max: 250000 },
        rating: 5,
        description: "A luxurious tented camp on the outskirts of Ranthambore National Park, Aman-i-Khás offers an intimate wildlife experience. Combining adventure with Aman's signature luxury, it's perfect for tiger safaris and nature lovers.",
        images: ["https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800"],
        amenities: ["Luxury Tents", "Private Dining", "Spa Tent", "Tiger Safaris", "Nature Walks", "Stargazing"],
        startingPrice: 95000,

        address: {
        street: "Ranthambore National Park Road",
        city: "Sawai Madhopur",
        pinCode: "322001",
        country: "India"
        },
        starRating: 5,
        roomTypes: [
        { name: "Luxury Tent", price: 95000 },
        { name: "Premium Tent Suite", price: 150000 },
        { name: "Exclusive Camp Package", price: 250000 }
        ],
        contactInfo: {
        phone: "+91-7462-252222",
        website: "www.aman.com",
        email: "ranthambore@aman.com",
        facebook: "https://www.facebook.com/AmanResorts",
        instagram: "https://www.instagram.com/aman"
        },
        activities: [
        { name: "Tiger Safari", category: "Wildlife", duration: "3 hours", price: 7000, description: "Guided safari in Ranthambore National Park" },
        { name: "Nature Walk", category: "Adventure", duration: "2 hours", price: 3000, description: "Explore local flora and fauna" },
        { name: "Stargazing", category: "Experience", duration: "1 hour", price: 2000, description: "Night sky observation in wilderness" }
        ],
        checkIn: "1:00 PM",
        checkOut: "11:00 AM",
        sightSeeings: [
        { name: "Ranthambore Fort", images: [], description: "Historic fort within the national park", entryFee: 200 },
        { name: "Tiger Safari", images: [], description: "Wildlife safari experience", entryFee: 7000 },
        { name: "Padam Talao", images: [], description: "Largest lake in the park", entryFee: 0 },
        { name: "Surwal Lake", images: [], description: "Bird watching spot", entryFee: 0 },
        { name: "Trinetra Ganesh Temple", images: [], description: "Ancient temple inside the fort", entryFee: 0 },
        { name: "Kachida Valley", images: [], description: "Known for leopard sightings", entryFee: 0 }
        ]
    },
    {
        email: "itc.grand.chola.chennai@example.com",
        password: "partner123",
        companyName: "ITC Grand Chola Chennai",
        destinations: "Chennai",
        type: "Hotel",
        specializations: ["Luxury", "Business", "Culture"],
        budgetRange: { min: 10000, max: 40000 },
        rating: 5,
        description: "Inspired by the grandeur of the Chola dynasty, ITC Grand Chola is South India's largest luxury hotel. With stunning architecture, multiple award-winning restaurants, and a world-class spa, it's a cultural landmark.",
        images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800"],
        amenities: ["Kaya Kalp Spa", "Multiple Restaurants", "Grand Ballroom", "Pool", "Fitness Center", "Art Gallery"],
        startingPrice: 12500,

        address: {
        street: "Mount Road",
        city: "Chennai",
        pinCode: "600032",
        country: "India"
        },
        starRating: 5,
        roomTypes: [
        { name: "Executive Room", price: 12500 },
        { name: "Luxury Suite", price: 25000 },
        { name: "Grand Presidential Suite", price: 40000 }
        ],
        contactInfo: {
        phone: "+91-44-22200000",
        website: "www.itchotels.com",
        email: "itchola@itchotels.in",
        facebook: "https://www.facebook.com/ITCGrandChola",
        instagram: "https://www.instagram.com/itcgrandchola"
        },
        activities: [
        { name: "Cultural Tour", category: "Culture", duration: "2 hours", price: 2000, description: "Explore Chola-inspired architecture" },
        { name: "Spa Therapy", category: "Wellness", duration: "2 hours", price: 5000, description: "Relax at Kaya Kalp Spa" },
        { name: "Fine Dining", category: "Experience", duration: "2 hours", price: 4000, description: "Multi-cuisine luxury dining" }
        ],
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        sightSeeings: [
        { name: "Marina Beach", images: [], description: "One of the longest urban beaches", entryFee: 0 },
        { name: "Kapaleeshwarar Temple", images: [], description: "Ancient Dravidian-style temple", entryFee: 0 },
        { name: "Fort St. George", images: [], description: "Historic British fort", entryFee: 200 },
        { name: "Mahabalipuram", images: [], description: "UNESCO heritage rock-cut temples", entryFee: 500 },
        { name: "San Thome Cathedral", images: [], description: "Historic church built over St. Thomas tomb", entryFee: 0 },
        { name: "DakshinaChitra", images: [], description: "Cultural heritage village", entryFee: 150 }
        ]
    },

    {
        email: "vivanta.dal.view.srinagar@example.com",
        password: "partner123",
        companyName: "Vivanta Dal View Srinagar",
        destinations: "Srinagar",
        type: "Hotel",
        specializations: ["Scenic", "Luxury", "Honeymoon"],
        budgetRange: { min: 15000, max: 50000 },
        rating: 4,
        description: "Overlooking the serene Dal Lake with the Zabarwan mountains as backdrop, Vivanta Dal View offers a perfect blend of Kashmiri hospitality and modern luxury.",
        images: ["https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800"],
        amenities: ["Lake View Rooms", "Spa", "Kashmiri Cuisine", "Shikara Rides", "Garden", "Bonfire"],
        startingPrice: 18000,

        address: {
        street: "Kralsangri",
        city: "Srinagar",
        pinCode: "190018",
        country: "India"
        },
        starRating: 4,
        roomTypes: [
        { name: "Lake View Room", price: 18000 },
        { name: "Premium Room", price: 30000 },
        { name: "Luxury Suite", price: 50000 }
        ],
        contactInfo: {
        phone: "+91-194-2461111",
        website: "www.vivantahotels.com",
        email: "dalview.srinagar@tajhotels.com",
        facebook: "https://www.facebook.com/VivantaDalView",
        instagram: "https://www.instagram.com/vivantadalview"
        },
        activities: [
        { name: "Shikara Ride", category: "Experience", duration: "1 hour", price: 1500, description: "Boat ride on Dal Lake" },
        { name: "Garden Tour", category: "Leisure", duration: "2 hours", price: 1000, description: "Visit Mughal gardens" },
        { name: "Bonfire Night", category: "Experience", duration: "2 hours", price: 2000, description: "Evening bonfire with views" }
        ],
        checkIn: "2:00 PM",
        checkOut: "11:00 AM",
        sightSeeings: [
        { name: "Dal Lake", images: [], description: "Famous lake with houseboats", entryFee: 0 },
        { name: "Mughal Gardens", images: [], description: "Beautiful Persian-style gardens", entryFee: 50 },
        { name: "Shankaracharya Temple", images: [], description: "Hilltop temple with views", entryFee: 0 },
        { name: "Hazratbal Shrine", images: [], description: "Sacred Muslim shrine", entryFee: 0 },
        { name: "Pari Mahal", images: [], description: "Historic garden palace", entryFee: 100 },
        { name: "Nigeen Lake", images: [], description: "Peaceful lake near Dal Lake", entryFee: 0 }
        ]
    },

    {
        email: "taj.falaknuma.hyderabad@example.com",
        password: "partner123",
        companyName: "Taj Falaknuma Palace Hyderabad",
        destinations: "Hyderabad",
        type: "Hotel",
        specializations: ["Royal", "Heritage", "Luxury"],
        budgetRange: { min: 35000, max: 150000 },
        rating: 5,
        description: "Perched 2,000 feet above Hyderabad, Falaknuma Palace means 'Mirror of the Sky'. A truly regal experience with Nizam heritage.",
        images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"],
        amenities: ["Palace Suites", "Jiva Spa", "Vintage Car Tours", "Royal Dining", "Billiards Room", "Library"],
        startingPrice: 45000,

        address: {
        street: "Falaknuma",
        city: "Hyderabad",
        pinCode: "500053",
        country: "India"
        },
        starRating: 5,
        roomTypes: [
        { name: "Heritage Room", price: 45000 },
        { name: "Royal Suite", price: 90000 },
        { name: "Presidential Suite", price: 150000 }
        ],
        contactInfo: {
        phone: "+91-40-66298585",
        website: "www.tajhotels.com",
        email: "falaknuma@tajhotels.com",
        facebook: "https://www.facebook.com/TajFalaknuma",
        instagram: "https://www.instagram.com/tajfalaknuma"
        },
        activities: [
        { name: "Palace Tour", category: "Culture", duration: "2 hours", price: 3000, description: "Guided palace exploration" },
        { name: "Royal Dining", category: "Experience", duration: "2 hours", price: 8000, description: "Nizam-style dining" },
        { name: "Vintage Car Ride", category: "Leisure", duration: "1 hour", price: 5000, description: "Ride through palace grounds" }
        ],
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        sightSeeings: [
        { name: "Charminar", images: [], description: "Iconic monument of Hyderabad", entryFee: 100 },
        { name: "Golconda Fort", images: [], description: "Historic fort with acoustics", entryFee: 200 },
        { name: "Ramoji Film City", images: [], description: "World's largest film studio complex", entryFee: 1500 },
        { name: "Hussain Sagar Lake", images: [], description: "Lake with Buddha statue", entryFee: 0 },
        { name: "Salar Jung Museum", images: [], description: "Famous art museum", entryFee: 500 },
        { name: "Chowmahalla Palace", images: [], description: "Nizam's palace complex", entryFee: 200 }
        ]
    },

    {
        email: "kumarakom.lake.resort@example.com",
        password: "partner123",
        companyName: "Kumarakom Lake Resort",
        destinations: "Kumarakom",
        type: "Hotel",
        specializations: ["Backwaters", "Ayurveda", "Luxury"],
        budgetRange: { min: 12000, max: 45000 },
        rating: 4,
        description: "Set on the banks of Vembanad Lake, offering traditional Kerala architecture and Ayurvedic wellness.",
        images: ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800"],
        amenities: ["Heritage Villas", "Ayurveda Spa", "Houseboat Cruises", "Infinity Pool", "Traditional Cuisine", "Bird Sanctuary Tours"],
        startingPrice: 15000,

        address: {
        street: "Vembanad Lake",
        city: "Kumarakom",
        pinCode: "686563",
        country: "India"
        },
        starRating: 4,
        roomTypes: [
        { name: "Heritage Villa", price: 15000 },
        { name: "Lake View Villa", price: 30000 },
        { name: "Luxury Pool Villa", price: 45000 }
        ],
        contactInfo: {
        phone: "+91-481-2524900",
        website: "www.kumarakomlakeresort.in",
        email: "info@kumarakomlakeresort.in",
        facebook: "https://www.facebook.com/KumarakomLakeResort",
        instagram: "https://www.instagram.com/kumarakomlakeresort"
        },
        activities: [
        { name: "Houseboat Cruise", category: "Experience", duration: "3 hours", price: 5000, description: "Backwater cruise" },
        { name: "Ayurveda Therapy", category: "Wellness", duration: "2 hours", price: 4000, description: "Traditional treatment" },
        { name: "Bird Watching", category: "Nature", duration: "2 hours", price: 1500, description: "Explore sanctuary" }
        ],
        checkIn: "2:00 PM",
        checkOut: "11:00 AM",
        sightSeeings: [
        { name: "Vembanad Lake", images: [], description: "Largest lake in Kerala", entryFee: 0 },
        { name: "Kumarakom Bird Sanctuary", images: [], description: "Bird watching paradise", entryFee: 100 },
        { name: "Pathiramanal Island", images: [], description: "Small scenic island", entryFee: 0 },
        { name: "Bay Island Museum", images: [], description: "Driftwood museum", entryFee: 50 },
        { name: "Aruvikkuzhi Waterfall", images: [], description: "Scenic waterfall", entryFee: 0 },
        { name: "Vaikom Temple", images: [], description: "Famous Shiva temple", entryFee: 0 }
        ]
    },

    {
        email: "wildernest.goa@example.com",
        password: "partner123",
        companyName: "Wildernest Nature Resort",
        destinations: "Goa",
        type: "Hotel",
        specializations: ["Nature", "Eco-Tourism", "Adventure"],
        budgetRange: { min: 8000, max: 25000 },
        rating: 4,
        description: "Eco-resort in Western Ghats offering jungle treks and adventure activities.",
        images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800"],
        amenities: ["Jungle Cottages", "Nature Trails", "Bird Watching", "Waterfall Rappelling", "Organic Food", "Campfire"],
        startingPrice: 9500,

        address: {
        street: "Chorla Ghats",
        city: "Goa",
        pinCode: "403530",
        country: "India"
        },
        starRating: 4,
        roomTypes: [
        { name: "Eco Cottage", price: 9500 },
        { name: "Premium Cottage", price: 15000 },
        { name: "Luxury Jungle Stay", price: 25000 }
        ],
        contactInfo: {
        phone: "+91-832-1234567",
        website: "www.wildernestgoa.com",
        email: "info@wildernestgoa.com",
        facebook: "https://www.facebook.com/WildernestGoa",
        instagram: "https://www.instagram.com/wildernestgoa"
        },
        activities: [
        { name: "Jungle Trek", category: "Adventure", duration: "3 hours", price: 2000, description: "Guided forest trek" },
        { name: "Bird Watching", category: "Nature", duration: "2 hours", price: 1500, description: "Spot rare species" },
        { name: "Waterfall Rappelling", category: "Adventure", duration: "2 hours", price: 3000, description: "Thrilling activity" }
        ],
        checkIn: "1:00 PM",
        checkOut: "11:00 AM",
        sightSeeings: [
        { name: "Dudhsagar Falls", images: [], description: "Majestic waterfall", entryFee: 400 },
        { name: "Mollem National Park", images: [], description: "Rich biodiversity park", entryFee: 200 },
        { name: "Tambdi Surla Temple", images: [], description: "Ancient temple in forest", entryFee: 0 },
        { name: "Bhagwan Mahavir Sanctuary", images: [], description: "Wildlife sanctuary", entryFee: 200 },
        { name: "Devil's Canyon", images: [], description: "Natural gorge", entryFee: 0 },
        { name: "Netravali Sanctuary", images: [], description: "Wildlife sanctuary", entryFee: 200 }
        ]
    },
      {
    email: "evolve.back.coorg@example.com",
    password: "partner123",
    companyName: "Evolve Back Coorg",
    destinations: "Coorg",
    type: "Hotel",
    specializations: ["Plantation", "Luxury", "Wellness"],
    budgetRange: { min: 20000, max: 65000 },
    rating: 5,
    description: "Set amidst 300 acres of coffee and spice plantations, offering luxury villas with private pools and plantation experiences.",
    images: ["https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800"],
    amenities: ["Private Pool Villas", "Spa", "Plantation Tours", "Infinity Pool", "Coorgi Cuisine", "Nature Walks"],
    startingPrice: 24000,

    address: {
      street: "Siddapura",
      city: "Coorg",
      pinCode: "571253",
      country: "India"
    },
    starRating: 5,
    roomTypes: [
      { name: "Luxury Villa", price: 24000 },
      { name: "Pool Villa", price: 40000 },
      { name: "Presidential Villa", price: 65000 }
    ],
    contactInfo: {
      phone: "+91-8274-123456",
      website: "www.evolveback.com",
      email: "coorg@evolveback.com",
      facebook: "https://www.facebook.com/EvolveBackResorts",
      instagram: "https://www.instagram.com/evolveback"
    },
    activities: [
      { name: "Plantation Walk", category: "Nature", duration: "2 hours", price: 1500, description: "Guided coffee plantation walk" },
      { name: "Spa Therapy", category: "Wellness", duration: "2 hours", price: 4000, description: "Relaxation treatments" },
      { name: "Nature Walk", category: "Adventure", duration: "2 hours", price: 1000, description: "Explore surroundings" }
    ],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    sightSeeings: [
      { name: "Abbey Falls", images: [], description: "Scenic waterfall", entryFee: 50 },
      { name: "Raja's Seat", images: [], description: "Sunset viewpoint", entryFee: 20 },
      { name: "Dubare Elephant Camp", images: [], description: "Elephant interaction", entryFee: 100 },
      { name: "Talacauvery", images: [], description: "Origin of river Cauvery", entryFee: 0 },
      { name: "Namdroling Monastery", images: [], description: "Golden temple monastery", entryFee: 0 },
      { name: "Iruppu Falls", images: [], description: "Popular waterfall trek", entryFee: 50 }
    ]
  },

  {
    email: "ananda.himalayas@example.com",
    password: "partner123",
    companyName: "Ananda in the Himalayas",
    destinations: "Rishikesh",
    type: "Hotel",
    specializations: ["Wellness", "Spa", "Yoga"],
    budgetRange: { min: 30000, max: 100000 },
    rating: 5,
    description: "A luxury wellness retreat combining Ayurveda, Yoga, and holistic healing in Himalayan foothills.",
    images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800"],
    amenities: ["Spa Pavilion", "Yoga Pavilion", "Ayurveda", "Meditation", "Organic Cuisine", "Palace Suites"],
    startingPrice: 35000,

    address: {
      street: "Narendra Nagar",
      city: "Rishikesh",
      pinCode: "249175",
      country: "India"
    },
    starRating: 5,
    roomTypes: [
      { name: "Deluxe Room", price: 35000 },
      { name: "Wellness Suite", price: 60000 },
      { name: "Luxury Villa", price: 100000 }
    ],
    contactInfo: {
      phone: "+91-1378-227500",
      website: "www.anandaspa.com",
      email: "reservations@anandaspa.com",
      facebook: "https://www.facebook.com/AnandaSpa",
      instagram: "https://www.instagram.com/anandainthehimalayas"
    },
    activities: [
      { name: "Yoga Session", category: "Wellness", duration: "1 hour", price: 1000, description: "Guided yoga class" },
      { name: "Meditation", category: "Wellness", duration: "1 hour", price: 800, description: "Mindfulness practice" },
      { name: "Spa Therapy", category: "Wellness", duration: "2 hours", price: 6000, description: "Holistic treatments" }
    ],
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
    sightSeeings: [
      { name: "Laxman Jhula", images: [], description: "Famous suspension bridge", entryFee: 0 },
      { name: "Ram Jhula", images: [], description: "Iconic bridge", entryFee: 0 },
      { name: "Triveni Ghat", images: [], description: "Ganga aarti spot", entryFee: 0 },
      { name: "Beatles Ashram", images: [], description: "Meditation retreat", entryFee: 150 },
      { name: "Neelkanth Temple", images: [], description: "Sacred Shiva temple", entryFee: 0 },
      { name: "Rajaji National Park", images: [], description: "Wildlife sanctuary", entryFee: 200 }
    ]
  },

  {
    email: "suryagarh.jaisalmer@example.com",
    password: "partner123",
    companyName: "Suryagarh Jaisalmer",
    destinations: "Jaisalmer",
    type: "Hotel",
    specializations: ["Desert", "Heritage", "Luxury"],
    budgetRange: { min: 18000, max: 60000 },
    rating: 5,
    description: "A luxurious desert fort-palace offering authentic Rajasthani experiences.",
    images: ["https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800"],
    amenities: ["Desert Safaris", "Spa", "Dune Dining", "Cultural Shows", "Heritage Tours", "Pool"],
    startingPrice: 22000,

    address: {
      street: "Sam Road",
      city: "Jaisalmer",
      pinCode: "345001",
      country: "India"
    },
    starRating: 5,
    roomTypes: [
      { name: "Fort Room", price: 22000 },
      { name: "Luxury Suite", price: 40000 },
      { name: "Royal Suite", price: 60000 }
    ],
    contactInfo: {
      phone: "+91-2992-266666",
      website: "www.suryagarh.com",
      email: "info@suryagarh.com",
      facebook: "https://www.facebook.com/SuryagarhJaisalmer",
      instagram: "https://www.instagram.com/suryagarh"
    },
    activities: [
      { name: "Camel Safari", category: "Adventure", duration: "3 hours", price: 3000, description: "Desert safari experience" },
      { name: "Dune Dinner", category: "Experience", duration: "2 hours", price: 5000, description: "Dinner in dunes" },
      { name: "Cultural Show", category: "Culture", duration: "2 hours", price: 2000, description: "Folk performances" }
    ],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    sightSeeings: [
      { name: "Jaisalmer Fort", images: [], description: "Golden fort", entryFee: 250 },
      { name: "Sam Sand Dunes", images: [], description: "Desert dunes", entryFee: 0 },
      { name: "Patwon Ki Haveli", images: [], description: "Historic mansions", entryFee: 100 },
      { name: "Gadisar Lake", images: [], description: "Scenic lake", entryFee: 0 },
      { name: "Bada Bagh", images: [], description: "Royal cenotaphs", entryFee: 100 },
      { name: "Kuldhara Village", images: [], description: "Abandoned village", entryFee: 50 }
    ]
  },

  {
    email: "taj.lake.palace.udaipur@example.com",
    password: "partner123",
    companyName: "Taj Lake Palace Udaipur",
    destinations: "Udaipur",
    type: "Hotel",
    specializations: ["Iconic", "Luxury", "Romantic"],
    budgetRange: { min: 40000, max: 150000 },
    rating: 5,
    description: "Iconic marble palace floating on Lake Pichola offering unmatched romantic luxury.",
    images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"],
    amenities: ["Lake Palace Suites", "Jiva Spa", "Boat Transfers", "Rooftop Dining", "Butler Service"],
    startingPrice: 48000,

    address: {
      street: "Lake Pichola",
      city: "Udaipur",
      pinCode: "313001",
      country: "India"
    },
    starRating: 5,
    roomTypes: [
      { name: "Palace Room", price: 48000 },
      { name: "Luxury Suite", price: 90000 },
      { name: "Grand Presidential Suite", price: 150000 }
    ],
    contactInfo: {
      phone: "+91-294-2428800",
      website: "www.tajhotels.com",
      email: "lakepalace.udaipur@tajhotels.com",
      facebook: "https://www.facebook.com/TajLakePalace",
      instagram: "https://www.instagram.com/tajlakepalace"
    },
    activities: [
      { name: "Boat Ride", category: "Experience", duration: "1 hour", price: 3000, description: "Lake cruise" },
      { name: "Spa Therapy", category: "Wellness", duration: "2 hours", price: 7000, description: "Luxury spa" },
      { name: "Rooftop Dining", category: "Experience", duration: "2 hours", price: 6000, description: "Fine dining" }
    ],
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
    sightSeeings: [
      { name: "City Palace", images: [], description: "Royal palace complex", entryFee: 300 },
      { name: "Lake Pichola", images: [], description: "Scenic lake", entryFee: 0 },
      { name: "Jag Mandir", images: [], description: "Island palace", entryFee: 300 },
      { name: "Saheliyon Ki Bari", images: [], description: "Garden", entryFee: 50 },
      { name: "Fateh Sagar Lake", images: [], description: "Popular lake", entryFee: 0 },
      { name: "Sajjangarh Palace", images: [], description: "Monsoon palace", entryFee: 100 }
    ]
  }
];

export const internationalPartners = [
    // Maldives
    {
    email: "soneva.jani.maldives@example.com",
    password: "partner123",
    companyName: "Soneva Jani",
    destinations: "Maldives",
    type: "Hotel",
    specializations: ["Luxury", "Honeymoon", "Wellness"],
    budgetRange: { min: 150000, max: 1000000 },
    rating: 5,
    description: "A benchmark for overwater luxury with private villas, pools, and retractable roofs for stargazing.",
    images: [
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1000&auto=format&fit=crop"
    ],
    amenities: ["Private Pool", "Retractable Roof", "Water Slide", "Cinema Paradiso", "Observatory", "Organic Gardens"],
    startingPrice: 250000,

    address: {
      street: "Noonu Atoll",
      city: "Maldives",
      pinCode: "20001",
      country: "Maldives"
    },
    starRating: 5,
    roomTypes: [
      { name: "Water Villa", price: 250000 },
      { name: "Luxury Water Retreat", price: 600000 },
      { name: "Island Reserve", price: 1000000 }
    ],
    contactInfo: {
      phone: "+960-6566666",
      website: "www.soneva.com",
      email: "jani@soneva.com",
      facebook: "https://www.facebook.com/Soneva",
      instagram: "https://www.instagram.com/soneva"
    },
    activities: [
      { name: "Dolphin Cruise", category: "Experience", duration: "2 hours", price: 15000, description: "Sunset dolphin watching" },
      { name: "Snorkeling", category: "Adventure", duration: "2 hours", price: 10000, description: "Explore coral reefs" },
      { name: "Stargazing", category: "Leisure", duration: "1 hour", price: 8000, description: "Observatory experience" }
    ],
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
    sightSeeings: [
      { name: "Noonu Atoll Marine Park", images: [], description: "Protected marine ecosystem", entryFee: 0 },
      { name: "Dolphin Cruise", images: [], description: "Ocean wildlife experience", entryFee: 15000 },
      { name: "Private Sandbank", images: [], description: "Isolated island experience", entryFee: 20000 }
    ]
  },

  {
    email: "gili.lankanfushi@example.com",
    password: "partner123",
    companyName: "Gili Lankanfushi",
    destinations: "Maldives",
    type: "Hotel",
    specializations: ["Eco-Luxury", "Honeymoon"],
    budgetRange: { min: 100000, max: 500000 },
    rating: 5,
    description: "An intimate coral island resort offering privacy, eco-luxury, and overwater villas.",
    images: [
      "https://images.unsplash.com/photo-1439066615861-d1fbced6530e?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1000&auto=format&fit=crop"
    ],
    amenities: ["Overwater Bar", "Meera Spa", "Jungle Cinema", "Wine Cellar", "Butler Service"],
    startingPrice: 120000,

    address: {
      street: "North Malé Atoll",
      city: "Maldives",
      pinCode: "20002",
      country: "Maldives"
    },
    starRating: 5,
    roomTypes: [
      { name: "Villa Suite", price: 120000 },
      { name: "Residence Villa", price: 300000 },
      { name: "Private Reserve", price: 500000 }
    ],
    contactInfo: {
      phone: "+960-6640304",
      website: "www.gili-lankanfushi.com",
      email: "reservations@gili-lankanfushi.com",
      facebook: "https://www.facebook.com/GiliLankanfushi",
      instagram: "https://www.instagram.com/gili.lankanfushi"
    },
    activities: [
      { name: "Sunset Cruise", category: "Experience", duration: "2 hours", price: 12000, description: "Traditional dhoni cruise" },
      { name: "Snorkeling", category: "Adventure", duration: "2 hours", price: 9000, description: "Lagoon exploration" },
      { name: "Cinema Night", category: "Leisure", duration: "2 hours", price: 5000, description: "Outdoor movie experience" }
    ],
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
    sightSeeings: [
      { name: "Manta Ray Point", images: [], description: "Diving hotspot", entryFee: 10000 },
      { name: "Local Island Visit", images: [], description: "Cultural exploration", entryFee: 5000 },
      { name: "Sunset Dhoni Cruise", images: [], description: "Traditional boat ride", entryFee: 12000 }
    ]
  },

  {
    email: "velaa.private.island@example.com",
    password: "partner123",
    companyName: "Velaa Private Island",
    destinations: "Maldives",
    type: "Hotel",
    specializations: ["Ultra-Luxury", "Privacy"],
    budgetRange: { min: 300000, max: 1500000 },
    rating: 5,
    description: "Ultra-exclusive boutique island offering unmatched privacy and luxury experiences.",
    images: [
      "https://images.unsplash.com/photo-1590523741831-ab7f8512d568?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000&auto=format&fit=crop"
    ],
    amenities: ["Golf Academy", "Snow Room", "Clarins Spa", "Private Submarine", "Kids Club"],
    startingPrice: 350000,

    address: {
      street: "Noonu Atoll",
      city: "Maldives",
      pinCode: "20003",
      country: "Maldives"
    },
    starRating: 5,
    roomTypes: [
      { name: "Beach Pool Villa", price: 350000 },
      { name: "Ocean Residence", price: 800000 },
      { name: "Private Island Villa", price: 1500000 }
    ],
    contactInfo: {
      phone: "+960-6565000",
      website: "www.velaaprivateisland.com",
      email: "info@velaaprivateisland.com",
      facebook: "https://www.facebook.com/VelaaPrivateIsland",
      instagram: "https://www.instagram.com/velaaprivateisland"
    },
    activities: [
      { name: "Private Yacht", category: "Luxury", duration: "3 hours", price: 50000, description: "Yacht charter" },
      { name: "Night Golf", category: "Leisure", duration: "2 hours", price: 20000, description: "Golf under lights" },
      { name: "Submarine Ride", category: "Adventure", duration: "1 hour", price: 60000, description: "Underwater exploration" }
    ],
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
    sightSeeings: [
      { name: "Turtle Conservation", images: [], description: "Marine conservation program", entryFee: 10000 },
      { name: "Private Yacht Charter", images: [], description: "Luxury cruise", entryFee: 50000 },
      { name: "Night Golf", images: [], description: "Unique golf experience", entryFee: 20000 }
    ]
  },

  {
    email: "oneonly.reethi.rah@example.com",
    password: "partner123",
    companyName: "One&Only Reethi Rah",
    destinations: "Maldives",
    type: "Hotel",
    specializations: ["Family", "Luxury"],
    budgetRange: { min: 200000, max: 800000 },
    rating: 4,
    description: "A luxurious island resort ideal for families, offering beaches, activities, and premium hospitality.",
    images: [
      "https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586611292717-f828b167408c?q=80&w=1000&auto=format&fit=crop"
    ],
    amenities: ["Private Beaches", "Kids Club", "Spa", "Climbing Wall", "Football Pitch"],
    startingPrice: 220000,

    address: {
      street: "North Malé Atoll",
      city: "Maldives",
      pinCode: "20004",
      country: "Maldives"
    },
    starRating: 4,
    roomTypes: [
      { name: "Beach Villa", price: 220000 },
      { name: "Water Villa", price: 450000 },
      { name: "Grand Residence", price: 800000 }
    ],
    contactInfo: {
      phone: "+960-6648800",
      website: "www.oneandonlyresorts.com",
      email: "reethirah@oneandonlyresorts.com",
      facebook: "https://www.facebook.com/OneOnlyReethiRah",
      instagram: "https://www.instagram.com/oooreethirah"
    },
    activities: [
      { name: "Shark Safari", category: "Adventure", duration: "2 hours", price: 15000, description: "Dive with sharks" },
      { name: "Fishing Trip", category: "Experience", duration: "3 hours", price: 12000, description: "Deep sea fishing" },
      { name: "Island Picnic", category: "Leisure", duration: "4 hours", price: 20000, description: "Private island outing" }
    ],
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
    sightSeeings: [
      { name: "Shark Safari", images: [], description: "Marine adventure", entryFee: 15000 },
      { name: "Big Game Fishing", images: [], description: "Fishing experience", entryFee: 12000 },
      { name: "Island Picnic", images: [], description: "Private beach outing", entryFee: 20000 }
    ]
  },

  // Paris
  {
    email: "four.seasons.george.v.paris@example.com",
    password: "partner123",
    companyName: "Four Seasons Hotel George V",
    destinations: "Paris",
    type: "Hotel",
    specializations: ["Luxury", "City", "Gastronomy"],
    budgetRange: { min: 150000, max: 600000 },
    rating: 5,
    description: "An iconic art deco luxury hotel in Paris known for Michelin-starred dining and exceptional service.",
    images: [
      "https://images.unsplash.com/photo-1560131914-6870372444d8?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1499856871940-a09627c6dcf6?q=80&w=1000&auto=format&fit=crop"
    ],
    amenities: ["Michelin Dining", "Luxury Spa", "Floral Design", "Indoor Pool", "Concierge"],
    startingPrice: 180000,

    address: {
      street: "31 Avenue George V",
      city: "Paris",
      pinCode: "75008",
      country: "France"
    },
    starRating: 5,
    roomTypes: [
      { name: "Deluxe Room", price: 180000 },
      { name: "Suite", price: 350000 },
      { name: "Presidential Suite", price: 600000 }
    ],
    contactInfo: {
      phone: "+33-1-49527000",
      website: "www.fourseasons.com",
      email: "georgev.paris@fourseasons.com",
      facebook: "https://www.facebook.com/FourSeasonsParis",
      instagram: "https://www.instagram.com/fourseasons"
    },
    activities: [
      { name: "Fine Dining", category: "Gastronomy", duration: "2 hours", price: 15000, description: "Michelin-star experience" },
      { name: "Spa Session", category: "Wellness", duration: "2 hours", price: 12000, description: "Luxury spa treatments" },
      { name: "City Tour", category: "Culture", duration: "3 hours", price: 8000, description: "Explore Paris landmarks" }
    ],
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
    sightSeeings: [
      { name: "Eiffel Tower", images: [], description: "Iconic Paris landmark", entryFee: 3000 },
      { name: "Arc de Triomphe", images: [], description: "Historic monument", entryFee: 1500 },
      { name: "Champs-Elysées", images: [], description: "Famous shopping avenue", entryFee: 0 }
    ]
  },

  {
    email: "ritz.paris@example.com",
    password: "partner123",
    companyName: "The Ritz Paris",
    destinations: "Paris",
    type: "Hotel",
    specializations: ["History", "Luxury"],
    budgetRange: { min: 200000, max: 700000 },
    rating: 5,
    description: "A legendary luxury hotel overlooking Place Vendôme, known for its rich history and timeless elegance.",
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop"
    ],
    amenities: ["Hemingway Bar", "Luxury Spa", "Cooking School", "Private Garden"],
    startingPrice: 210000,

    address: {
      street: "15 Place Vendôme",
      city: "Paris",
      pinCode: "75001",
      country: "France"
    },
    starRating: 5,
    roomTypes: [
      { name: "Superior Room", price: 210000 },
      { name: "Executive Suite", price: 400000 },
      { name: "Royal Suite", price: 700000 }
    ],
    contactInfo: {
      phone: "+33-1-43163030",
      website: "www.ritzparis.com",
      email: "contact@ritzparis.com",
      facebook: "https://www.facebook.com/RitzParis",
      instagram: "https://www.instagram.com/ritzparis"
    },
    activities: [
      { name: "Cooking Class", category: "Gastronomy", duration: "3 hours", price: 20000, description: "Learn French cuisine" },
      { name: "Spa Therapy", category: "Wellness", duration: "2 hours", price: 15000, description: "Luxury treatments" },
      { name: "Bar Experience", category: "Leisure", duration: "2 hours", price: 8000, description: "Hemingway Bar visit" }
    ],
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
    sightSeeings: [
      { name: "Place Vendôme", images: [], description: "Luxury square", entryFee: 0 },
      { name: "Louvre Museum", images: [], description: "World-famous museum", entryFee: 2000 },
      { name: "Opera Garnier", images: [], description: "Historic opera house", entryFee: 1500 }
    ]
  },

  {
    email: "lemeurice.paris@example.com",
    password: "partner123",
    companyName: "Le Meurice",
    destinations: "Paris",
    type: "Hotel",
    specializations: ["Art", "Luxury"],
    budgetRange: { min: 120000, max: 500000 },
    rating: 4,
    description: "A historic luxury hotel blending art, elegance, and Parisian charm near the Louvre.",
    images: [
      "https://images.unsplash.com/photo-1549651721-f9b050d4403f?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1000&auto=format&fit=crop"
    ],
    amenities: ["Spa", "Fine Dining", "Pastry Shop", "Pet Friendly", "Fitness Center"],
    startingPrice: 140000,

    address: {
      street: "228 Rue de Rivoli",
      city: "Paris",
      pinCode: "75001",
      country: "France"
    },
    starRating: 4,
    roomTypes: [
      { name: "Classic Room", price: 140000 },
      { name: "Deluxe Suite", price: 300000 },
      { name: "Presidential Suite", price: 500000 }
    ],
    contactInfo: {
      phone: "+33-1-44581010",
      website: "www.dorchestercollection.com",
      email: "lemeurice@dorchestercollection.com",
      facebook: "https://www.facebook.com/LeMeuriceParis",
      instagram: "https://www.instagram.com/lemeurice"
    },
    activities: [
      { name: "Pastry Workshop", category: "Gastronomy", duration: "2 hours", price: 10000, description: "French pastry making" },
      { name: "Spa Therapy", category: "Wellness", duration: "2 hours", price: 12000, description: "Relaxation treatments" },
      { name: "Art Tour", category: "Culture", duration: "2 hours", price: 8000, description: "Explore nearby museums" }
    ],
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
    sightSeeings: [
      { name: "Tuileries Garden", images: [], description: "Historic garden", entryFee: 0 },
      { name: "Musée d'Orsay", images: [], description: "Art museum", entryFee: 2000 },
      { name: "Rue de Rivoli", images: [], description: "Famous street", entryFee: 0 }
    ]
  },

    // Bali
      {
    email: "viceroy.bali@example.com",
    password: "partner123",
    companyName: "Viceroy Bali",
    destinations: "Bali",
    type: "Hotel",
    specializations: ["Jungle", "Honeymoon", "Wellness"],
    budgetRange: { min: 40000, max: 200000 },
    rating: 5,
    description: "Luxury jungle resort in Ubud offering private pool villas and serene valley views.",
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=1000&auto=format&fit=crop"
    ],
    amenities: ["Infinity Pool", "Spa", "Fine Dining", "Helipad", "Yoga Pavilion"],
    startingPrice: 55000,

    address: {
      street: "Ubud",
      city: "Bali",
      pinCode: "80571",
      country: "Indonesia"
    },
    starRating: 5,
    roomTypes: [
      { name: "Pool Villa", price: 55000 },
      { name: "Luxury Pool Villa", price: 120000 },
      { name: "Presidential Villa", price: 200000 }
    ],
    contactInfo: {
      phone: "+62-361-971777",
      website: "www.viceroybali.com",
      email: "reservations@viceroybali.com",
      facebook: "https://www.facebook.com/ViceroyBali",
      instagram: "https://www.instagram.com/viceroybali"
    },
    activities: [
      { name: "Yoga Session", category: "Wellness", duration: "1 hour", price: 2000, description: "Guided yoga" },
      { name: "Spa Therapy", category: "Wellness", duration: "2 hours", price: 5000, description: "Luxury spa" },
      { name: "Nature Walk", category: "Adventure", duration: "2 hours", price: 1500, description: "Explore jungle" }
    ],
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
    sightSeeings: [
      { name: "Ubud Monkey Forest", images: [], description: "Sacred forest sanctuary", entryFee: 500 },
      { name: "Tegallalang Rice Terrace", images: [], description: "Famous rice fields", entryFee: 300 },
      { name: "Goa Gajah", images: [], description: "Ancient temple cave", entryFee: 300 }
    ]
  },

  {
    email: "mandapa.ritz.reserve@example.com",
    password: "partner123",
    companyName: "Mandapa, a Ritz-Carlton Reserve",
    destinations: "Bali",
    type: "Hotel",
    specializations: ["Culture", "Luxury", "Nature"],
    budgetRange: { min: 80000, max: 300000 },
    rating: 5,
    description: "Riverfront luxury retreat in Ubud offering wellness and cultural immersion.",
    images: [
      "https://images.unsplash.com/photo-1552853843-bf7e211bb43f?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?q=80&w=1000&auto=format&fit=crop"
    ],
    amenities: ["Riverfront Dining", "Spa", "Organic Farm", "Butler Service"],
    startingPrice: 90000,

    address: {
      street: "Ubud",
      city: "Bali",
      pinCode: "80571",
      country: "Indonesia"
    },
    starRating: 5,
    roomTypes: [
      { name: "Suite", price: 90000 },
      { name: "Pool Villa", price: 180000 },
      { name: "Reserve Villa", price: 300000 }
    ],
    contactInfo: {
      phone: "+62-361-4792777",
      website: "www.ritzcarlton.com",
      email: "mandapa.reserve@ritzcarlton.com",
      facebook: "https://www.facebook.com/MandapaReserve",
      instagram: "https://www.instagram.com/mandapareserve"
    },
    activities: [
      { name: "River Yoga", category: "Wellness", duration: "1 hour", price: 3000, description: "Yoga by the riverside" },
      { name: "Farm Visit", category: "Nature", duration: "2 hours", price: 2000, description: "Tour organic farm" },
      { name: "Cultural Tour", category: "Culture", duration: "3 hours", price: 5000, description: "Explore local culture" }
    ],
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
    sightSeeings: [
      { name: "Campuhan Ridge Walk", images: [], description: "Scenic trail", entryFee: 0 },
      { name: "Tirta Empul Temple", images: [], description: "Holy spring temple", entryFee: 300 },
      { name: "Bali Swing", images: [], description: "Adventure swing", entryFee: 1500 }
    ]
  },

  {
    email: "burj.al.arab@example.com",
    password: "partner123",
    companyName: "Burj Al Arab Jumeirah",
    destinations: "Dubai",
    type: "Hotel",
    specializations: ["Ultra-Luxury", "Iconic"],
    budgetRange: { min: 150000, max: 1000000 },
    rating: 5,
    description: "Iconic sail-shaped hotel symbolizing ultra-luxury in Dubai.",
    images: [
      "https://images.unsplash.com/photo-1528702748617-c64d49f918af?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512453979798-5ea9ba6a80f6?q=80&w=1000&auto=format&fit=crop"
    ],
    amenities: ["Helipad", "Spa", "Private Beach", "Luxury Dining", "Rolls Royce Transfers"],
    startingPrice: 180000,

    address: {
      street: "Jumeirah Beach Road",
      city: "Dubai",
      pinCode: "00000",
      country: "UAE"
    },
    starRating: 5,
    roomTypes: [
      { name: "Deluxe Suite", price: 180000 },
      { name: "Panoramic Suite", price: 500000 },
      { name: "Royal Suite", price: 1000000 }
    ],
    contactInfo: {
      phone: "+971-4-3017777",
      website: "www.jumeirah.com",
      email: "burjalarab@jumeirah.com",
      facebook: "https://www.facebook.com/BurjAlArab",
      instagram: "https://www.instagram.com/burjalarab"
    },
    activities: [
      { name: "Helicopter Tour", category: "Luxury", duration: "1 hour", price: 50000, description: "Aerial Dubai tour" },
      { name: "Spa Therapy", category: "Wellness", duration: "2 hours", price: 10000, description: "Luxury spa treatments" },
      { name: "Fine Dining", category: "Experience", duration: "2 hours", price: 15000, description: "Gourmet dining experience" }
    ],
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
    sightSeeings: [
      { name: "Palm Jumeirah", images: [], description: "Artificial island", entryFee: 0 },
      { name: "Dubai Mall", images: [], description: "Luxury mall", entryFee: 0 },
      { name: "Wild Wadi", images: [], description: "Water park", entryFee: 5000 }
    ]
  },

  {
    email: "badrutts.palace@example.com",
    password: "partner123",
    companyName: "Badrutt's Palace Hotel",
    destinations: "St. Moritz",
    type: "Hotel",
    specializations: ["Alpine", "Luxury", "Winter"],
    budgetRange: { min: 80000, max: 400000 },
    rating: 5,
    description: "Historic luxury alpine hotel with stunning views of the Swiss Alps.",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1483095348487-53dbf97d8d5b?q=80&w=1000&auto=format&fit=crop"
    ],
    amenities: ["Spa", "Ski School", "Ice Rink", "Luxury Dining"],
    startingPrice: 95000,

    address: {
      street: "Via Serlas",
      city: "St. Moritz",
      pinCode: "7500",
      country: "Switzerland"
    },
    starRating: 5,
    roomTypes: [
      { name: "Classic Room", price: 95000 },
      { name: "Alpine Suite", price: 200000 },
      { name: "Royal Suite", price: 400000 }
    ],
    contactInfo: {
      phone: "+41-81-8371000",
      website: "www.badruttspalace.com",
      email: "info@badruttspalace.com",
      facebook: "https://www.facebook.com/BadruttsPalace",
      instagram: "https://www.instagram.com/badruttspalace"
    },
    activities: [
      { name: "Skiing", category: "Adventure", duration: "4 hours", price: 8000, description: "Alpine skiing experience" },
      { name: "Spa", category: "Wellness", duration: "2 hours", price: 6000, description: "Luxury spa treatments" }
    ],
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
    sightSeeings: [
      { name: "Lake St. Moritz", images: [], description: "Scenic frozen lake", entryFee: 0 },
      { name: "Corviglia Ski Area", images: [], description: "Ski resort", entryFee: 5000 }
    ]
  },

      {
    email: "aman.tokyo@example.com",
    password: "partner123",
    companyName: "Aman Tokyo",
    destinations: "Tokyo",
    type: "Hotel",
    specializations: ["Urban", "Zen"],
    budgetRange: { min: 120000, max: 400000 },
    rating: 5,
    description: "An urban sanctuary blending traditional Japanese minimalism with modern luxury in the heart of Tokyo.",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493997181344-712f2f19dcf1?q=80&w=1000&auto=format&fit=crop"
    ],
    amenities: ["Aman Spa", "Wine Cellar", "Cigar Lounge", "Library", "Indoor Pool"],
    startingPrice: 130000,

    address: {
      street: "Otemachi Tower",
      city: "Tokyo",
      pinCode: "100-0004",
      country: "Japan"
    },
    starRating: 5,
    roomTypes: [
      { name: "Deluxe Room", price: 130000 },
      { name: "Suite", price: 250000 },
      { name: "Aman Suite", price: 400000 }
    ],
    contactInfo: {
      phone: "+81-3-52244000",
      website: "www.aman.com",
      email: "tokyo@aman.com",
      facebook: "https://www.facebook.com/AmanTokyo",
      instagram: "https://www.instagram.com/amantokyo"
    },
    activities: [
      { name: "Zen Meditation", category: "Wellness", duration: "1 hour", price: 3000, description: "Traditional meditation practice" },
      { name: "Spa Therapy", category: "Wellness", duration: "2 hours", price: 8000, description: "Japanese spa treatments" },
      { name: "City Exploration", category: "Culture", duration: "3 hours", price: 5000, description: "Guided city tour" }
    ],
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
    sightSeeings: [
      { name: "Imperial Palace", images: [], description: "Historic residence of Japan’s emperor", entryFee: 0 },
      { name: "Ginza District", images: [], description: "Luxury shopping and dining area", entryFee: 0 },
      { name: "Senso-ji Temple", images: [], description: "Tokyo’s oldest temple", entryFee: 0 }
    ]
  },

  {
    email: "marina.bay.sands@example.com",
    password: "partner123",
    companyName: "Marina Bay Sands",
    destinations: "Singapore",
    type: "Hotel",
    specializations: ["Iconic", "City"],
    budgetRange: { min: 40000, max: 200000 },
    rating: 4,
    description: "An iconic integrated resort featuring the world-famous infinity pool and skyline views.",
    images: [
      "https://images.unsplash.com/photo-1565967511849-76a60a516170?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1000&auto=format&fit=crop"
    ],
    amenities: ["Infinity Pool", "SkyPark", "Casino", "Museum", "Shopping Mall"],
    startingPrice: 50000,

    address: {
      street: "10 Bayfront Avenue",
      city: "Singapore",
      pinCode: "018956",
      country: "Singapore"
    },
    starRating: 5,
    roomTypes: [
      { name: "Deluxe Room", price: 50000 },
      { name: "Premier Room", price: 90000 },
      { name: "Sky Suite", price: 200000 }
    ],
    contactInfo: {
      phone: "+65-66888888",
      website: "www.marinabaysands.com",
      email: "info@marinabaysands.com",
      facebook: "https://www.facebook.com/marinabaysands",
      instagram: "https://www.instagram.com/marinabaysands"
    },
    activities: [
      { name: "SkyPark Visit", category: "Experience", duration: "2 hours", price: 3000, description: "Visit iconic infinity pool" },
      { name: "Casino Night", category: "Leisure", duration: "3 hours", price: 5000, description: "Casino gaming experience" },
      { name: "City Tour", category: "Culture", duration: "3 hours", price: 4000, description: "Explore Singapore city" }
    ],
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    sightSeeings: [
      { name: "Gardens by the Bay", images: [], description: "Futuristic garden", entryFee: 1500 },
      { name: "Merlion Park", images: [], description: "Iconic Singapore landmark", entryFee: 0 },
      { name: "Singapore Flyer", images: [], description: "Observation wheel", entryFee: 3000 }
    ]
  },

  {
    email: "grace.hotel.santorini@example.com",
    password: "partner123",
    companyName: "Grace Hotel, Auberge Resorts Collection",
    destinations: "Santorini",
    type: "Hotel",
    specializations: ["Romance", "Views"],
    budgetRange: { min: 80000, max: 300000 },
    rating: 4.9,
    description: "A romantic cliffside retreat offering stunning caldera views and unforgettable sunsets.",
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?q=80&w=1000&auto=format&fit=crop"
    ],
    amenities: ["Infinity Pool", "Champagne Lounge", "Yoga", "In-room Dining", "Concierge"],
    startingPrice: 90000,

    address: {
      street: "Imerovigli",
      city: "Santorini",
      pinCode: "84700",
      country: "Greece"
    },
    starRating: 5,
    roomTypes: [
      { name: "Deluxe Room", price: 90000 },
      { name: "Honeymoon Suite", price: 180000 },
      { name: "Infinity Suite", price: 300000 }
    ],
    contactInfo: {
      phone: "+30-22860-21300",
      website: "www.aubergeresorts.com",
      email: "grace.santorini@aubergeresorts.com",
      facebook: "https://www.facebook.com/GraceSantorini",
      instagram: "https://www.instagram.com/gracehotel"
    },
    activities: [
      { name: "Sunset Dinner", category: "Romance", duration: "2 hours", price: 10000, description: "Romantic sunset dining" },
      { name: "Yoga Session", category: "Wellness", duration: "1 hour", price: 2000, description: "Mediterranean yoga" },
      { name: "Island Tour", category: "Adventure", duration: "4 hours", price: 6000, description: "Explore Santorini island" }
    ],
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    sightSeeings: [
      { name: "Oia Sunset", images: [], description: "World-famous sunset", entryFee: 0 },
      { name: "Red Beach", images: [], description: "Unique volcanic beach", entryFee: 0 },
      { name: "Ancient Thera", images: [], description: "Historic ruins", entryFee: 500 }
    ]
  },

  {
    email: "four.seasons.bora.bora@example.com",
    password: "partner123",
    companyName: "Four Seasons Resort Bora Bora",
    destinations: "Bora Bora",
    type: "Hotel",
    specializations: ["Tropical", "Honeymoon"],
    budgetRange: { min: 150000, max: 600000 },
    rating: 5,
    description: "A luxury island resort offering overwater bungalows and breathtaking lagoon views.",
    images: [
      "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=1000&auto=format&fit=crop"
    ],
    amenities: ["Overwater Villas", "Lagoon", "Spa", "Tennis Court", "Kids Club"],
    startingPrice: 170000,

    address: {
      street: "Motu Tehotu",
      city: "Bora Bora",
      pinCode: "98730",
      country: "French Polynesia"
    },
    starRating: 5,
    roomTypes: [
      { name: "Beach Villa", price: 170000 },
      { name: "Overwater Bungalow", price: 350000 },
      { name: "Presidential Villa", price: 600000 }
    ],
    contactInfo: {
      phone: "+689-40-603170",
      website: "www.fourseasons.com",
      email: "borabora@fourseasons.com",
      facebook: "https://www.facebook.com/FourSeasonsBoraBora",
      instagram: "https://www.instagram.com/fourseasons"
    },
    activities: [
      { name: "Snorkeling", category: "Adventure", duration: "2 hours", price: 5000, description: "Explore coral reefs" },
      { name: "Spa Therapy", category: "Wellness", duration: "2 hours", price: 8000, description: "Tropical spa treatments" },
      { name: "Lagoon Tour", category: "Experience", duration: "3 hours", price: 7000, description: "Boat tour of lagoon" }
    ],
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
    sightSeeings: [
      { name: "Mount Otemanu", images: [], description: "Volcanic peak", entryFee: 0 },
      { name: "Matira Beach", images: [], description: "Famous beach", entryFee: 0 },
      { name: "Coral Gardens", images: [], description: "Snorkeling site", entryFee: 0 }
    ]
  }
];