export const getIconName = (name) => {
  switch (name) {
    case "Handyman":
      return "construct";

    case "Window Cleaning":
    case "Pool Cleaning":
      return "water-outline";
    case "Interior Design":
    case "Art Teaching":
      return "color-palette-outline";
    case "Auto Detailing":
    case "Automotive":
      return "car-sport-outline";
    case "Boarding":
      return "bed-outline";
    case "Boxing":
      return "fitness-outline";
    case "Business Legal Services":
    case "Legal Finance":
      return "briefcase-outline";
    case "Criminal Law":
      return "lock-closed-outline";
    case "Employment Law":
      return "people-outline";
    case "Estate Planning":
      return "document-text-outline";
    case "Family Law":
      return "heart-outline";
    case "Immigration":
      return "airplane-outline";
    case "Intellectual Property":
      return "bulb-outline";
    case "Personal Injury":
      return "medkit-outline";
    case "CrossFit":
    case "Personal Training":
    case "Fitness":
      return "medkit-outline";
    case "Martial Arts":
      return "fitness-outline";
    case "Dance":
    case "Salsa":
    case "Contemporary":
    case "Hip Hop":
    case "Ballroom":
    case "Breakdancing":
    case "Jazz":
    case "Belly Dancing":
    case "Ballet":
      return "musical-notes-outline";
    case "Dog Walking":
    case "Pets":
      return "paw-outline";
    case "Event Planning":
      return "calendar-outline";
    case "Group Classes":
      return "people-outline";
    case "Life Coaching":
      return "heart-half-outline";
    case "Makeup":
    case "Beauty":
      return "brush-outline";
    case "Massage":
      return "hand-left-outline";
    case "Music Teaching":
      return "musical-note-outline";
    case "Nutrition":
    case "Diet":
      return "restaurant-outline";
    case "Performance":
      return "mic-outline";
    case "Pet Sitting":
      return "home-outline";
    case "Photography":
      return "camera-outline";
    case "Real Estate":
      return "home-outline";
    case "Seasonal":
      return "leaf-outline";
    case "Training":
    case "Tutor":
    case "Education":
    case "Test Preparation":
    case "Academic Coaching":
    case "Study Skills Coaching":
    case "Homeschool Coaching":
    case "Learning Disabilities Coaching":
    case "College Admission Coaching":
      return "school-outline";
    case "Wellness":
    case "Winter Sports":
      return "snow-outline";
    case "Yoga":
      return "body-outline";
    case "Financial Services":
      return "cash-outline";
    case "Tax Services":
      return "document-outline";
    case "Coaching":
    case "Family Nutrition Plans":
    case "Senior Nutrition Plans":
    case "Daily Balanced Diet Plans":
    case "Weight Loss Coaching Groups":
    case "Group Nutrition Coaching":
    case "Prenatal Nutrition Coaching":
    case "Personal Nutrition Coaching":
    case "Wellness Nutrition Coaching Groups":
    case "One-on-One Nutrition Coaching":
    case "In-Person Nutrition Coaching":
    case "Virtual Nutrition Coaching":
    case "Sports Nutrition Coaching":
    case "Fitness Nutrition Coaching Groups":
    case "Postnatal Nutrition Coaching":
    case "Specialized Nutrition Coaching":
      return "school-outline"; // or "people-outline" if you prefer a group context
    case "Cooking":
      return "restaurant-outline";
    case "Fall Services":
    case "Seasonal Decorations":
      return "leaf-outline";
    case "Holiday Lights":
      return "bulb-outline";
    case "Home":
      return "construct-outline"; // Leaving it as 'home-outline' to be empty as per your request
    case "Legal":
      return "briefcase-outline";
    case "Medical":
      return "medkit-outline";
    case "Party":
      return "calendar-outline";
    case "Salon":
      return "cut-outline";
    case "Snow Services":
      return "snow-outline";
    case "Spring Cleaning":
      return "water-outline";
    case "Summer Services":
      return "sunny-outline";
    case "Repairs":
      return "hammer-outline"; // Represents repair work
    case "Car Wash":
    case "Automatic Car Wash":
    case "Hand Wash":
    case "Wax and Polish":
    case "Self-Service Car Wash":
      return "water-outline"; // Symbolizes washing with water
    case "Maintenance":
      return "settings-outline"; // Represents upkeep and adjustments
    case "Customization":
    case "Performance Upgrades":
    case "Audio System Installation":
    case "Custom Paint Jobs":
    case "Custom Wheels and Tires":
    case "Window Tinting":
      return "color-palette-outline"; // Symbolizes design and customization
    case "Inspections":
      return "eye-outline"; // Represents inspection and checking
    case "Detailing":
    case "Headlight Restoration":
    case "Ceramic Coating":
    case "Mobile Detailing":
    case "Full Detailing":
    case "Exterior Wash":
    case "Paint Protection Film":
    case "Exterior Waxing":
    case "Interior Cleaning":
    case "Paint Correction":
    case "Engine Bay Cleaning":
      return "brush-outline"; // Suitable for detailing work
    case "Specialty":
      return "star-outline"; // Represents unique or specialized services
    case "Tire":
      return "car-outline"; // Represents car and tire services
    case "Glass":
      return "glasses-outline"; // Symbolizes glass or transparency work
    case "Roadside":
      return "car-sport-outline"; // Represents roadside assistance
    case "Fleet":
      return "bus-outline"; // Symbolizes multiple vehicles or fleet services
    case "Mobile":
      return "phone-portrait-outline"; // Represents mobile services
    case "Health":
      return "medkit-outline"; // Represents health and medical services
    case "Wellness":
      return "body-outline"; // Symbolizes overall wellness and fitness
    case "Relationship":
      return "heart-outline"; // Represents relationships and connections
    case "Career":
    case "Professional Development":
    case "Interview Coaching":
    case "Career Transition Coaching":
    case "Skill Development Coaching":
    case "Resume Writing":
    case "Leadership Skills Coaching":
    case "Language Coaching":
    case "Technical Skills Coaching":
    case "Creative Skills Coaching":
    case "Communication Skills Coaching":
    case "Job Search Coaching":
      return "briefcase-outline"; // Represents career and professional services
    case "Education":
      return "school-outline"; // Symbolizes education and learning
    case "Business":
    case "Incorporation Services":
    case "Performance Coaching":
    case "Employment Law":
    case "Commercial Litigation":
    case "Entrepreneur Coaching":
    case "Small Business Coaching":
    case "Sales Coaching":
    case "Change Management":
    case "Productivity Coaching":
    case "Mergers and Acquisitions":
    case "Innovation Coaching":
    case "Team Building":
    case "Corporate Coaching":
    case "Contract Drafting":
    case "Intellectual Property":
    case "Strategic Planning":
      return "business-outline"; // Represents business and professional services
    case "Life":
      return "happy-outline"; // Represents life coaching and improvement
    case "Financial":
      return "cash-outline"; // Represents financial services and advice
    case "Specialty":
      return "star-outline"; // Represents unique or specialized services
    case "Athletic":
    case "Performance Improvement":
    case "Artistic Performance Coaching":
    case "Music Performance Coaching":
    case "Acting Coaching":
    case "Confidence Building":
    case "Public Speaking":
      return "fitness-outline"; // Represents sports and athletic activities

    case "Home":
      return "home-outline"; // Represents home-related services
    case "Classes":
    case "Couples Cooking Classes":
    case "Beginner Cooking Classes":
    case "Advanced Cooking Techniques":
    case "Kids Cooking Classes":
      return "school-outline"; // Symbolizes educational classes and learning
    case "Event":
      return "calendar-outline"; // Represents events and event planning
    case "Baking":
    case "Bread Baking":
    case "Custom Cakes":
    case "Pastries and Desserts":
      return "pizza-outline";
    case "Specialty":
      return "star-outline"; // Represents unique or specialized services
    case "Health":
      return "medkit-outline"; // Represents health and medical services
    case "Catering":
    case "Cocktail Catering":
    case "Dessert Catering":
    case "Small Event Catering":
    case "Buffet Catering":
    case "Corporate Catering":
    case "Large Event Catering":
    case "Beverage Service":
    case "Full-Service Catering":
    case "BBQ Catering":
      return "restaurant-outline"; // Represents catering and food services
    case "Gourmet":
      return "wine-outline"; // Symbolizes gourmet food and drink
    case "Cultural":
    case "French Cooking":
    case "Mexican Cooking":
    case "Chinese Cooking":
    case "Indian Cooking":
    case "Japanese Cooking":
    case "Italian Cooking":
      return "globe-outline"; // Represents cultural and global services
    case "Meal":
      return "restaurant-outline"; // Represents meals and food services
    case "Delivery":
    case "Paleo Meal Delivery":
    case "Personalized Meal Delivery":
    case "Gluten-Free Meal Delivery":
    case "Keto Meal Delivery":
    case "Family Meal Delivery":
    case "Diet-Specific Meal Delivery":
    case "Custom Meal Delivery":
    case "Organic Meal Delivery":
    case "Healthy Meal Delivery":
    case "Bulk Meal Delivery":
    case "Vegan Meal Delivery":
    case "Low-Carb Meal Delivery":
      return "bicycle-outline"; // Symbolizes delivery services
    case "Consultation":
    case "Follow-Up Consultations":
    case "Specialized Diet Consultations":
    case "Monthly Diet Adjustments":
    case "Fitness Goal Diet Consultations":
    case "Family Diet Consultations":
    case "Lifestyle-Based Diet Consultations":
    case "Initial Diet Consultations":
    case "Progress Tracking Consultations":
    case "Weekly Diet Check-ins":
    case "Dietary Needs Consultations":
    case "Health Assessment Consultations":
    case "Medical Condition Diet Consultations":
      return "chatbubble-outline"; // Represents consultation and advice
    case "Coaching":
      return "people-outline"; // Symbolizes coaching and guidance
    case "Specialized":
      return "star-outline"; // Represents unique or specialized services
    case "Balanced":
    case "Family Nutrition Plans":
    case "Senior Nutrition Plans":
    case "Daily Balanced Diet Plans":
      return "scale-outline"; // Represents balance and equilibrium

    case "Art":
    case "Mixed Media Classes":
    case "Calligraphy Classes":
    case "Photography Classes":
    case "Ceramics Classes":
    case "Printmaking Classes":
    case "Painting Classes":
    case "Sculpture Classes":
    case "Digital Art Classes":
    case "Drawing Classes":
      return "color-palette-outline"; // Represents art and creativity
    case "Music":
      return "musical-notes-outline"; // Symbolizes music and instruments

    case "STEM":
      return "flask-outline"; // Represents science and technology
    case "Early":
    case "Kindergarten Readiness":
    case "Play-Based Learning":
    case "Early Math Skills":
    case "Early Literacy":
    case "Preschool Prep":
      return "flower-outline"; // Symbolizes early childhood or development
    case "Life Skills":
      return "construct-outline";
    case "Professional":
      return "briefcase-outline"; // Symbolizes professional development
    case "Academic":
    case "ACT Prep":
    case "English Tutoring":
    case "History Tutoring":
    case "Science Tutoring":
    case "Language Tutoring":
    case "SAT Prep":
    case "College Prep":
    case "Geography Tutoring":
    case "Test Prep":
    case "Math Tutoring":
      return "school-outline";
    case "Test Prep":
      return "clipboard-outline"; // Symbolizes preparation and testing
    case "Special":
      return "star-outline"; // Represents unique or special services
    case "Language":
      return "chatbubble-ellipses-outline"; // Represents language and communication

    case "Fall Lawn Care":
      return "leaf-outline"; // Represents fall and lawn care activities
    case "Leaf Removal":
      return "leaf-outline"; // Symbolizes removing leaves and fall cleanup
    case "Gutter Cleaning":
      return "water-outline"; // Represents cleaning and water flow management

    case "Indian Dance":
      return "body-outline"; // Represents traditional dance and movement
    case "Nutrition":
      return "nutrition-outline"; // Represents healthy eating and nutrition
    case "Martial":
      return "fitness-outline"; // Represents martial arts and physical fitness
    case "Sports":
      return "trophy-outline"; // Symbolizes sports and athletic activities
    case "Dance":
      return "musical-notes-outline"; // Represents dance and rhythm
    case "Personal":
      return "person-outline"; // Symbolizes personal services or development
    case "Group":
      return "people-outline"; // Represents group activities or classes
    case "Wellness":
      return "heart-outline"; // Represents wellness and health

    case "Installation":
      return "build-outline"; // Represents installation and construction work
    case "Custom Design":
    case "Custom Seasonal Decorations Design":
    case "Custom Holiday Lights Design":
      return "color-palette-outline"; // Symbolizes design and creativity

    case "Electrical":
      return "flash-outline"; // Represents electrical work and services
    case "Landscaping":
      return "leaf-outline"; // Symbolizes gardening and landscaping
    case "Cleaning":
    case "House Cleaning":
    case "Window Cleaning":
    case "Gutter Cleaning":
    case "Chimney Cleaning":
    case "Pressure Washing":
    case "Deep Cleaning":
    case "Carpet Cleaning":
    case "Roof Cleaning":
    case "Move-in/Move-out":
    case "Post-Construction":
    case "Office Cleaning":
    case "Garage Cleaning":
    case "Tile & Grout":
    case "Upholstery Cleaning":
    case "Air Duct Cleaning":
      return "sparkles-outline"; // Represents cleaning and sanitation
    case "Roofing":
      return "home-outline"; // Represents roofing work on houses
    case "Appliance":
    case "Refrigerator Repair":
    case "Heater Repair":
    case "Small Appliance Repair":
    case "Washer Repair":
    case "Microwave Repair":
    case "Electrical Repair":
    case "Dryer Repair":
    case "HVAC Service":
    case "Oven Repair":
    case "AC Repair":
    case "Vacuum Repair":
    case "Dishwasher Repair":
      return "cog-outline"; // Symbolizes appliance services and repairs
    case "Window":
    case "Windows":
      return "layers-outline";
    case "PestControl":
      return "bug-outline"; // Represents pest control services
    case "Handyman":
      return "hammer-outline"; // Represents general handyman services
    case "Plumbing":
      return "umbrella-outline"; // Symbolizes plumbing services and water flow
    case "Contractors":
    case "Bathroom Remodeling":
    case "Garage Conversions":
    case "Basement Finishing":
    case "Home Extensions":
    case "Room Additions":
    case "Home Renovation":
    case "Kitchen Remodeling":
      return "construct-outline"; // Represents construction and contracting
    case "Painting":
      return "brush-outline"; // Represents painting and decoration
    case "Pool":
      return "fish-outline"; // Represents pool services and maintenance
    case "HVAC":
      return "thermometer-outline"; // Represents heating and cooling services
    case "Decor":
    case "Curtain Installation":
    case "Holiday Decoration":
    case "Lighting Design":
    case "Interior Design":
    case "Wall Art":
    case "Home Office Setup":
    case "Furniture Selection":
    case "Custom Shelving":
      return "color-palette-outline"; // Represents interior design and decor
    case "Automation":
    case "Smart Locks":
    case "Smart Thermostats":
    case "Whole-Home Audio":
    case "Home Theater":
    case "Smart Lighting":
      return "settings-outline"; // Represents automation and smart systems
    case "Insulation":
      return "snow-outline"; // Symbolizes insulation and energy efficiency
    case "Security":
      return "lock-closed-outline"; // Represents security services
    case "Junk":
      return "trash-outline"; // Represents junk removal and waste management
    case "Doors":
    case "Door Install":
    case "Garage Door Install":
    case "Garage Door Repair":
    case "Door Replacement":
    case "Screen Door Install":
      return "log-in-outline"; // Represents door installation and repair
    case "Septic":
      return "flask-outline"; // Represents septic system services
    case "Inspections":
      return "eye-outline"; // Represents inspections and assessments
    case "Water":
      return "water-outline"; // Represents inspections and assessments

    case "Criminal":
    case "White Collar Crimes":
    case "DUI Defense":
    case "Defense Services":
    case "Expungement":
    case "Assault Defense":
    case "Drug Crimes":
    case "Juvenile Defense":
      return "lock-closed-outline"; // Symbolizes legal proceedings and criminal law
    case "Immigration":
      return "airplane-outline"; // Represents travel and migration
    case "Real Estate":
      return "home-outline"; // Represents property and real estate services
    case "Environmental":
      return "leaf-outline"; // Symbolizes environmental concerns and nature
    case "Estate":
      return "document-text-outline"; // Represents legal documents and estate planning
    case "Employment":
      return "people-outline"; // Represents employment and workforce services
    case "Injury":
      return "bandage-outline"; // Symbolizes personal injury and medical concerns
    case "Mediation":
      return "people-outline"; // Represents negotiation and conflict resolution
    case "Financial":
      return "cash-outline"; // Symbolizes finance and monetary services
    case "IP":
      return "bulb-outline"; // Represents intellectual property and innovation
    case "Family":
      return "heart-outline"; // Symbolizes family law and related services
    case "Notary":
      return "document-outline"; // Represents legal documents and notarization
    case "Elder":
      return "accessibility-outline";
    case "Relaxation":
      return "bed-outline"; // Represents rest and relaxation
    case "Alternative":
    case "Polarity Therapy":
    case "Reiki":
    case "Acupressure":
    case "Rolfing":
    case "Hydrotherapy":
      return "leaf-outline"; // Symbolizes alternative and natural therapies
    case "Therapeutic":
      return "body-outline"; // Symbolizes therapeutic activities and healing

    case "OB-GYN":
      return "female-outline";
    case "Dentist":
    case "Broken Tooth Repair":
    case "Toothache Relief":
    case "Emergency Root Canal":
    case "Emergency Dental Care":
      return "medical-outline"; // Represents dental and oral health services
    case "Chiropractor":
    case "Acute Back Pain Relief":
    case "Emergency Chiropractic Care":
    case "Spinal Adjustment Emergency":
    case "Emergency Neck Pain Treatment":
      return "hand-left-outline"; // Symbolizes chiropractic care and spinal adjustments
    case "Pediatrician":
      return "shield-checkmark-outline"; // Represents children's healthcare services
    case "General Practitioner":
      return "medkit-outline"; // Represents general medical services
    case "Physical Therapist":
      return "body-outline"; // Symbolizes physical therapy and rehabilitation
    case "Physician":
      return "heart-outline";

    case "Characters":
    case "Superheroes":
    case "Movie Characters":
    case "Cartoon Characters":
    case "Toy Characters":
    case "Princesses":
    case "Classic Characters":
      return "happy-outline"; // Represents characters, mascots, and fun
    case "DJs":
    case "DJ Punjabi":
    case "DJ Pop":
    case "DJ House":
    case "DJ Latin":
    case "DJ Funk":
    case "DJ EDM":
    case "DJ Hip Hop":
    case "DJ R&B":
    case "DJ Bollywood":
    case "DJ Classical":
    case "DJ Jazz":
    case "DJ Rock":
    case "DJ Reggae":
      return "musical-note-outline"; // Symbolizes music and DJ services
    case "Catering":
      return "restaurant-outline"; // Represents food and catering services
    case "Invitations":
      return "mail-outline"; // Symbolizes sending invitations and cards
    case "Favors":
      return "gift-outline"; // Represents party favors and gifts
    case "Rentals":
      return "cart-outline"; // Represents rental services and equipment
    case "Photography":
      return "camera-outline"; // Symbolizes photography services
    case "Interactive":
      return "game-controller-outline"; // Represents interactive activities and games
    case "Planning":
      return "calendar-outline"; // Symbolizes event planning and scheduling
    case "Entertainment":
      return "play-outline"; // Represents entertainment and performances
    case "Transport":
      return "car-outline"; // Represents transportation services
    case "Decorations":
    case "Backdrops":
    case "Floral":
    case "Table Settings":
    case "Balloons":
    case "Centerpieces":
    case "Lighting":
    case "Themed":
      return "color-palette-outline"; // Represents decorative services
    case "Cleanup":
    case "Trash Removal":
    case "Equipment Breakdown":
    case "Post-Event Cleaning":
      return "trash-outline"; // Symbolizes cleanup and waste management

    case "Walking":
      return "walk-outline"; // Represents walking and exercise activities

    case "Insurance":
      return "shield-checkmark-outline"; // Symbolizes protection and insurance services
    case "Supplies":
      return "cart-outline"; // Represents supplies and shopping
    case "Boarding":
    case "Short-term Boarding":
    case "Boarding with Grooming":
    case "Exotic Pet Boarding":
    case "Special Needs Boarding":
    case "Luxury Pet Boarding":
    case "Cat Boarding":
    case "Dog Boarding":
    case "Pet Daycare":
    case "In-Home Boarding":
    case "Long-term Boarding":
    case "24-Hour Supervision":
      return "bed-outline"; // Represents lodging and boarding services
    case "Training":
      return "school-outline"; // Symbolizes training and educational services
    case "Travel":
      return "airplane-outline"; // Represents travel and transportation services
    case "Dog Adoption":
    case "Adoption":
    case "Exotic Pet Adoption":
    case "Cat Adoption":
    case "Senior Pet Adoption":
    case "Small Pet Adoption":
      return "paw-outline"; // Represents adoption and care
    case "Funeral":
      return "flower-outline"; // Represents funeral services and memorials
    case "Veterinary":
      return "paw-outline"; // Represents veterinary and pet care services
    case "Sitting":
      return "home-outline"; // Represents pet sitting or house sitting services
    case "Photography":
      return "camera-outline"; // Represents photography services

    case "Development":
    case "Mixed-use Development":
    case "Residential Development":
    case "Land Development":
    case "Commercial Development":
      return "construct-outline"; // Represents development and construction
    case "Rentals":
      return "home-outline"; // Represents property rentals and real estate
    case "Consulting":
    case "Market Analysis":
    case "Property Management":
    case "Development Consulting":
    case "Investment Consulting":
      return "chatbubble-outline"; // Symbolizes consulting and advisory services
    case "Residential":
      return "home-outline"; // Represents residential properties and housing
    case "Foreclosure":
      return "lock-closed-outline"; // Represents foreclosure and financial issues
    case "Staging":
      return "color-palette-outline"; // Represents staging and interior design
    case "Sales":
      return "cart-outline"; // Represents sales and transactions
    case "Relocation":
      return "swap-horizontal-outline"; // Represents relocation and moving services
    case "Appraisal":
    case "Land Appraisal":
    case "Residential Appraisal":
    case "Commercial Appraisal":
    case "Luxury Appraisal":
      return "clipboard-outline"; // Represents appraisals and assessments
    case "Management":
      return "briefcase-outline"; // Represents management and administrative services
    case "Commercial":
    case "Mixed-use Spaces":
    case "Office Spaces":
    case "Industrial Spaces":
    case "Retail Spaces":
      return "business-outline"; // Represents commercial properties and businesses
    case "Investment":
      return "trending-up-outline";

    case "Waxing":
      return "flame-outline"; // Represents waxing services, symbolizing heat and removal
    case "Nails":
      return "color-fill-outline"; // Represents nail services and manicure
    case "Skin Care":
      return "leaf-outline"; // Represents skin care, symbolizing natural and beauty treatments
    case "Hair":
      return "cut-outline";

    case "Custom Design":
      return "color-palette-outline"; // Represents creativity and custom design services
    case "Installation":
      return "build-outline"; // Represents installation and construction services
    case "Removal":
      return "trash-outline"; // Represents removal and disposal services
    case "Maintenance":
      return "settings-outline"; // Represents maintenance and upkeep services
    case "Snow Plowing":
      return "snow-outline"; // Represents snow removal and plowing services
    case "Salting":
      return "thermometer-outline"; // Represents salting for ice control and safety
    case "Yard":
      return "leaf-outline"; // Represents yard care and landscaping services
    case "Garage":
      return "car-outline"; // Represents garage and vehicle-related services
    case "Office":
      return "business-outline"; // Represents office-related services and management
    case "Pressure Washing":
      return "water-outline"; // Represents cleaning and washing services
    case "BBQ":
    case "BBQ Grill Cleaning":
      return "flame-outline";
    case "Lawn":
      return "flower-outline";

    case "Electrical":
    case "Security System":
    case "Wiring":
    case "Circuit Breaker":
    case "Inspection":
    case "Surge Protection":
    case "Landscape Lighting":
    case "EV Charger":
    case "Panel Upgrade":
    case "Outlet Install":
    case "Smoke Detector":
    case "Automation":
    case "Ceiling Fan":
    case "Generator":
    case "Lighting":
      return "flash-outline"; // Represents electrical services

    case "Employment":
    case "Workplace Harassment":
    case "Wrongful Termination":
    case "Discrimination Cases":
    case "Employment Contracts":
    case "Wage and Hour Disputes":
      return "briefcase-outline"; // Represents employment-related issues

    case "Entertainment":
    case "Face Painting":
    case "DJs":
    case "Live Bands":
    case "Photobooths":
    case "Magicians":
    case "Fireworks":
    case "Clowns":
      return "musical-notes-outline"; // Represents entertainment services

    case "Environmental":
    case "Regulatory Compliance":
    case "Wildlife Protection":
    case "Land Use":
    case "Environmental Impact":
    case "Pollution Control":
      return "leaf-outline"; // Represents environmental concerns

    case "Estate":
    case "Power of Attorney":
    case "Living Wills":
    case "Wills":
    case "Trusts":
    case "Estate Administration":
    case "Probate":
      return "document-text-outline"; // Represents estate planning services

    case "Event":
    case "Pop-up Restaurant Services":
    case "Festival Food Stalls":
    case "Wedding Catering":
    case "Party Catering":
      return "calendar-outline"; // Represents event services

    case "Fall Lawn Care":
    case "Residential Fall Lawn Care":
    case "Commercial Fall Lawn Care":
      return "leaf-outline"; // Represents fall lawn care services

    case "Family":
    case "Child Custody":
    case "Prenuptial Agreements":
    case "Guardianship":
    case "Domestic Violence":
    case "Adoption Services":
    case "Child Support":
    case "Divorce Services":
      return "heart-outline"; // Represents family law services

    case "Favors":
    case "Edible Favors":
    case "Customized Favors":
    case "Themed Favors":
    case "Eco-friendly Favors":
      return "gift-outline"; // Represents favor services

    case "Financial":
    case "Debt Management":
    case "Tax Law":
    case "Debt Settlement":
    case "Bankruptcy Services":
    case "Foreclosure Assistance":
    case "Wealth Building":
    case "Financial Fraud Defense":
    case "Investment Coaching":
    case "Budgeting Coaching":
    case "Retirement Planning":
      return "cash-outline"; // Represents financial services

    case "Fitness":
    case "Post-Workout Meal Plans":
    case "High-Protein Diet Plans":
    case "Pre-Workout Meal Plans":
      return "barbell-outline"; // Represents fitness meal plans

    case "Fleet":
    case "Fleet Maintenance":
    case "Fleet Inspections":
    case "Fleet Repair":
    case "Fleet Detailing":
      return "car-outline"; // Represents fleet services

    case "Flooring":
    case "Flooring Repair":
    case "Laminate Flooring":
    case "Vinyl Flooring":
    case "Carpet Install":
    case "Hardwood Flooring":
    case "Tile Flooring":
      return "layers-outline"; // Represents flooring services

    case "Foreclosure":
    case "Short Sales":
    case "REO Properties":
    case "Auction Properties":
    case "Prevention":
      return "home-outline"; // Represents foreclosure services

    case "Funeral":
    case "Burial Services":
    case "Cremation Services":
    case "Memorial Products":
      return "flower-outline"; // Represents funeral services

    case "Garage":
    case "Garage Cleaning":
      return "home-outline"; // Represents garage services

    case "General Practitioner":
    case "Emergency Allergy Treatment":
    case "Emergency General Practice":
    case "Acute Illness Emergency Care":
    case "Emergency Prescription Refills":
      return "medical-outline"; // Represents general practitioner services

    case "Glass":
    case "Window Replacement":
    case "Windshield Repair":
    case "Windshield Replacement":
    case "Window Repair":
      return "glass-outline"; // Represents glass services

    case "Gourmet":
    case "Gourmet Cooking":
    case "Gourmet Meal Prep":
    case "Private Gourmet Chef Services":
    case "Gourmet Cooking Classes":
    case "Gourmet Baking":
      return "restaurant-outline"; // Represents gourmet services

    case "Grooming":
    case "Basic Bath & Trim":
    case "Luxury Pet Grooming":
    case "Nail Trimming":
    case "De-shedding Treatment":
    case "Pet Full-Service Grooming":
    case "Eco-Friendly Pet Grooming":
    case "Ear Cleaning":
    case "Teeth Brushing":
    case "Aromatherapy Grooming":
    case "Fur Dyeing":
      return "paw-outline"; // Represents pet grooming services

    case "Group":
    case "HIIT (High-Intensity Interval Training)":
    case "Spinning":
    case "Pilates":
    case "Yoga":
    case "Aerobics":
    case "CrossFit":
    case "Boot Camps":
    case "Zumba":
      return "people-outline"; // Represents group fitness activities

    case "Gutter Cleaning":
    case "Commercial Gutter Cleaning":
    case "Residential Gutter Cleaning":
      return "water-outline"; // Represents gutter cleaning services

    case "HVAC":
    case "Furnace Repair":
    case "Humidifier Install":
    case "Inspection":
    case "Heater Repair":
    case "AC Repair":
    case "Air Quality Testing":
    case "Duct Cleaning":
    case "Thermostat Install":
    case "Maintenance":
    case "Vent Cleaning":
    case "Heat Pump Install":
    case "Dehumidifier Install":
    case "Refrigerant Recharge":
    case "Ductless AC Install":
      return "thermometer-outline"; // Represents HVAC services

    case "Hair":
    case "Hair Extensions":
    case "Mobile Hair Coloring":
    case "Mobile Hair Styling":
    case "Mobile Hair Treatments":
    case "Hair Treatments":
    case "Mobile Hair Extensions":
    case "Hair Coloring":
    case "Mobile Hair Perming":
    case "Hair Perming":
    case "Mobile Haircut":
    case "Haircut":
    case "Hair Styling":
      return "cut-outline"; // Represents hair services

    case "Handyman":
    case "Tile & Flooring":
    case "Drywall Repair":
    case "Roof Repair":
    case "Electrical Install":
    case "Maintenance":
    case "Furniture Assembly":
    case "Plumbing Repair":
    case "Electrical Repair":
    case "Carpentry":
    case "Plumbing Install":
    case "Door Repair":
    case "Window Repair":
    case "Painting":
      return "hammer-outline"; // Represents handyman services

    case "Health":
    case "Preventive Health Coaching":
    case "Chronic Disease Management":
    case "Organic Meal Prep":
    case "Weight Loss Coaching":
    case "Whole Foods Cooking":
    case "Nutrition Consultation Cooking":
    case "Fitness Coaching":
    case "Nutrition Coaching":
    case "Mental Health Coaching":
    case "Detox Meal Prep":
      return "heart-outline"; // Represents health services

    case "Hobby":
    case "Gardening Classes":
    case "Craft Workshops":
    case "Creative Writing":
    case "Photography Workshops":
    case "Cooking Classes":
    case "Sewing Classes":
      return "brush-outline"; // Represents hobby classes

    case "Home":
    case "Italian Weekly Meal Prep":
    case "Weekly Meal Delivery":
    case "Thai In-home Chef":
    case "Italian Personal Chef Services":
    case "Indian In-home Chef":
    case "Thai Special Event Cooking":
    case "Personal Chef Services":
    case "In-home Chef":
    case "Indian Special Event Cooking":
    case "Meal Prep Services":
    case "Mexican Personal Chef Services":
    case "Special Event Cooking":
    case "Italian In-home Chef":
    case "Indian Personal Chef Services":
    case "Thai Personal Chef Services":
    case "Italian Special Event Cooking":
    case "Thai Weekly Meal Prep":
    case "Mexican Special Event Cooking":
    case "Chinese Special Event Cooking":
    case "Family Meal Planning":
    case "Bulk Meal Preparation":
    case "Chinese Weekly Meal Prep":
    case "Chinese In-home Chef":
    case "Chinese Personal Chef Services":
    case "Weekly Meal Prep":
    case "Mexican Weekly Meal Prep":
    case "Indian Weekly Meal Prep":
    case "Home Spring Cleaning":
    case "Mexican In-home Chef":
      return "home-outline"; // Represents home services

    case "IP":
    case "IP Litigation":
    case "Patent Filing":
    case "Copyright Protection":
    case "Trademark Registration":
    case "Trade Secrets":
      return "shield-outline"; // Represents IP services

    case "Immigration":
    case "Family-Based Petitions":
    case "Student Visas":
    case "Work Permits":
    case "Citizenship Applications":
    case "Naturalization Services":
    case "Marriage Visas":
    case "Deportation Defense":
    case "Green Card Processing":
    case "Asylum Applications":
    case "Investor Visas":
    case "Visa Assistance":
      return "globe-outline"; // Represents immigration services

    case "Indian Dance":
    case "Indian Classical Dance":
    case "Lavani":
    case "Bhangra":
    case "Garba":
    case "Bollywood Dance":
    case "Manipuri":
    case "Kathakali":
    case "Mohiniyattam":
    case "Odissi":
    case "Kuchipudi":
    case "Kathak":
    case "Bharatanatyam":
    case "Sattriya":
      return "body-outline"; // Represents Indian dance forms

    case "Injury":
    case "Medical Malpractice":
    case "Car Accidents":
    case "Workplace Injuries":
    case "Product Liability":
    case "Slip and Fall":
    case "Wrongful Death":
      return "medkit-outline"; // Represents injury-related services

    case "Inspections":
    case "Pre-Purchase Inspection":
    case "Pre-sale":
    case "Mold Inspections":
    case "Emissions Testing":
    case "Diagnostic Services":
    case "Pre-purchase":
    case "Energy Audits":
    case "Safety Inspection":
    case "Radon Testing":
      return "search-outline"; // Represents inspection services

    case "Installation":
    case "Commercial Seasonal Decorations Installation":
    case "Residential Holiday Lights Installation":
    case "Residential Seasonal Decorations Installation":
    case "Commercial Holiday Lights Installation":
      return "construct-outline"; // Represents installation services

    case "Insulation":
    case "Spray Foam Insulation":
    case "Radiant Barrier Install":
    case "Insulation Removal":
    case "Attic Insulation":
    case "Floor Insulation":
    case "Blown-in Insulation":
    case "Wall Insulation":
      return "snow-outline"; // Represents insulation services

    case "Insurance":
    case "Accident Insurance":
    case "Wellness Plans":
    case "Health Insurance":
      return "umbrella-outline"; // Represents insurance services

    case "Interactive":
    case "Mobile Laser Tag":
    case "Escape Rooms":
    case "Virtual Reality (VR)":
    case "Game Buses":
    case "Interactive Theater":
    case "Augmented Reality (AR)":
      return "game-controller-outline"; // Represents interactive activities

    case "Investment":
    case "Commercial Investment":
    case "REITs":
    case "Residential Investment":
    case "Crowdfunding":
      return "trending-up-outline"; // Represents investment opportunities

    case "Invitations":
    case "Printed Invitations":
    case "Customized Invitations":
    case "Digital Invitations":
    case "RSVP Management":
      return "mail-outline"; // Represents invitation services

    case "Junk":
    case "Yard Waste Removal":
    case "Hoarding Cleanouts":
    case "Appliance Removal":
    case "Furniture Removal":
    case "Construction Debris Removal":
    case "Estate Cleanouts":
      return "trash-outline"; // Represents junk removal services

    case "Landscaping":
    case "Landscape Lighting":
    case "Soil Testing":
    case "Weed Control":
    case "Sod Install":
    case "Mulching":
    case "Deck & Patio":
    case "Paving":
    case "Garden Maintenance":
    case "Irrigation Install":
    case "Lawn Mowing":
    case "Hedge Trimming":
    case "Fence Install":
    case "Garden Design":
    case "Tree Trimming":
    case "Yard Cleanup":
    case "Landscaping Services":
      return "leaf-outline"; // Represents landscaping services

    case "Language":
    case "Japanese Classes":
    case "Arabic Classes":
    case "Chinese Classes":
    case "Russian Classes":
    case "German Classes":
    case "French Classes":
    case "English Classes":
    case "Spanish Classes":
    case "Italian Classes":
      return "language-outline"; // Represents language classes

    case "Lawn":
    case "Lawn Mowing":
      return "leaf-outline"; // Represents lawn care services

    case "Leaf Removal":
    case "Residential Leaf Removal":
    case "Commercial Leaf Removal":
      return "leaf-outline"; // Represents leaf removal services

    case "Life":
    case "Financial Coaching":
    case "Health and Wellness":
    case "Relationship Coaching":
    case "Stress Management":
    case "Career Coaching":
    case "Motivational Coaching":
    case "Executive Coaching":
    case "Personal Development":
    case "Leadership Coaching":
      return "bulb-outline"; // Represents life coaching services

    case "Life Skills":
    case "Cooking Classes":
    case "Personal Safety":
    case "Driver Education":
    case "Financial Literacy":
    case "Home Economics":
      return "book-outline"; // Represents life skills education

    case "Maintenance":
    case "Air Filter Replacement":
    case "Wiper Blade Replacement":
    case "Seasonal Decorations Maintenance":
    case "Tire Rotation":
    case "Light Bulb Replacement":
    case "Holiday Lights Maintenance":
    case "Battery Replacement":
    case "Belt and Hose Replacement":
    case "Fluid Checks and Top-Ups":
    case "Oil Change":
    case "Brake Service":
      return "build-outline"; // Represents maintenance services

    case "Management":
    case "Vacation Management":
    case "HOA Management":
    case "Residential Management":
    case "Commercial Management":
      return "business-outline"; // Represents management services

    case "Martial":
    case "Karate":
    case "Muay Thai":
    case "Brazilian Jiu-Jitsu":
    case "Boxing":
    case "Mixed Martial Arts (MMA)":
    case "Judo":
    case "Kickboxing":
    case "Taekwondo":
      return "fitness-outline"; // Represents martial arts training

    case "Meal":
    case "Group Weight Loss Programs":
    case "Personalized Weight Loss Plans":
    case "Weekly Meal Planning for Weight Loss":
      return "restaurant-outline"; // Represents meal planning services

    case "Mediation":
    case "Business Disputes":
    case "Labor Disputes":
    case "Conflict Resolution":
    case "Divorce Mediation":
    case "Contractual Disputes":
      return "handshake-outline"; // Represents mediation services

    case "Medical":
    case "Medical Massage":
    case "Rehabilitation Massage":
    case "Post-Surgical Massage":
      return "medkit-outline"; // Represents medical massage services

    case "Mobile":
    case "Mobile Mechanic":
    case "Mobile Tire Service":
    case "Mobile Oil Change":
    case "Mobile Detailing":
      return "car-outline"; // Represents mobile mechanic services

    case "Music":
    case "Violin Lessons":
    case "Flute Lessons":
    case "Clarinet Lessons":
    case "Composition Lessons":
    case "Electronic Music":
    case "Cello Lessons":
    case "Drum Lessons":
    case "Guitar Lessons":
    case "Saxophone Lessons":
    case "Music Theory":
    case "Piano Lessons":
    case "Voice Lessons":
      return "musical-notes-outline"; // Represents music lessons

    case "Nails":
    case "Acrylic Nails":
    case "Gel Nails":
    case "Nail Art":
    case "Mobile Gel Nails":
    case "Pedicure":
    case "Mobile Manicure":
    case "Mobile Pedicure":
    case "Manicure":
    case "Mobile Acrylic Nails":
    case "Mobile Nail Art":
      return "color-palette-outline"; // Represents nail services

    case "Notary":
    case "Loan Signing Agent":
    case "Mobile Notary":
    case "Document Notarization":
    case "Real Estate Closings":
    case "Witness Services":
    case "Document Preparation":
      return "document-outline"; // Represents notary services

    case "Nutrition":
    case "Sports Nutrition":
    case "Diabetic Diets":
    case "Paleo Diets":
    case "Vegetarian/Vegan Diets":
    case "Meal Planning":
    case "Gluten-Free Diets":
    case "Keto Diets":
    case "Weight Loss Plans":
      return "nutrition-outline"; // Represents nutrition services

    case "OB-GYN":
    case "Emergency Menstrual Pain Treatment":
    case "Emergency Gynecological Services":
    case "Emergency Pregnancy Care":
    case "Emergency OB-GYN Care":
      return "female-outline"; // Represents OB-GYN services

    case "Office":
    case "Office Spring Cleaning":
      return "broom-outline"; // Represents office cleaning services

    case "Painting":
    case "Interior Painting":
    case "Cabinet Painting":
    case "Deck Staining":
    case "Exterior Painting":
    case "Fence Painting":
      return "color-fill-outline"; // Represents painting services

    case "Pediatrician":
    case "Childhood Illness Emergency":
    case "Emergency Pediatric Care":
    case "Emergency Vaccinations":
    case "Injury Emergency Care for Children":
      return "medical-outline"; // Represents pediatrician services

    case "Personal":
    case "Youth Fitness Training":
    case "Strength Training":
    case "Senior Fitness Training":
    case "Endurance Training":
    case "Pre/Postnatal Training":
    case "Weight Loss Training":
      return "fitness-outline"; // Represents personal training services

    case "PestControl":
    case "Ant Control":
    case "Mosquito Control":
    case "Rodent Control":
    case "Bed Bug Treatment":
    case "Termite Control":
    case "Wildlife Removal":
      return "bug-outline"; // Represents pest control services

    case "Photography":
    case "Event Photography":
    case "Drone Photography":
    case "Studio Photography":
    case "Photo Booth Rentals":
    case "Action Shots":
    case "Portrait Photography":
    case "Event Videography":
      return "camera-outline"; // Represents photography services

    case "Physical Therapist":
    case "Acute Injury Rehabilitation":
    case "Sports Injury Emergency Care":
    case "Emergency Physical Therapy":
    case "Post-Surgery Physical Therapy":
      return "body-outline"; // Represents physical therapy services

    case "Physician":
    case "Urgent Care Visits":
    case "Emergency Illness Treatment":
    case "Stitches and Sutures":
    case "Minor Injury Treatment":
      return "medkit-outline"; // Represents physician services

    case "Planning":
    case "Bridal Showers":
    case "Holiday Parties":
    case "Anniversaries":
    case "Weddings":
    case "Retirement Parties":
    case "Baby Showers":
    case "Corporate Events":
    case "Graduation Parties":
    case "Birthday Parties":
      return "calendar-outline"; // Represents event planning services

    case "Plumbing":
    case "Drain Cleaning":
    case "Pipe Repair":
    case "Faucet Install":
    case "Water Softener":
    case "Water Heater":
    case "Garbage Disposal":
    case "Leak Repair":
    case "Shower Install":
    case "Gas Line":
    case "Backflow Testing":
    case "Toilet Install":
    case "Sewer Repair":
    case "Sump Pump":
      return "water-outline"; // Represents plumbing services

    case "Pool":
    case "Pool Opening/Closing":
    case "Cover Install/Removal":
    case "Pool Heater Repair":
    case "Pool Cleaning":
    case "Pool Repair":
    case "Chemical Balancing":
    case "Water Testing":
    case "Pool Filter Cleaning":
    case "Pool Tile Cleaning":
    case "Regular Pool Cleaning":
    case "Pool Inspection":
    case "Pool Vacuuming":
    case "Equipment Maintenance":
    case "Green Pool Cleaning":
      return "water-outline"; // Represents pool services

    case "Pressure Washing":
      return "water-outline"; // Represents pressure washing services

    case "Professional":
    case "Negotiation Skills":
    case "Leadership Training":
    case "Entrepreneurship":
    case "Time Management":
    case "Project Management":
    case "Business Writing":
    case "Public Speaking":
      return "briefcase-outline"; // Represents professional development

    case "Real Estate":
    case "Landlord-Tenant Disputes":
    case "Title Search":
    case "Foreclosure Defense":
    case "Zoning Issues":
    case "Property Sales":
    case "Lease Agreements":
      return "home-outline"; // Represents real estate services

    case "Relationship":
    case "Dating Coaching":
    case "Parenting Coaching":
    case "Conflict Resolution Coaching":
    case "Marriage Coaching":
    case "Family Coaching":
    case "Divorce Coaching":
      return "heart-outline"; // Represents relationship coaching services

    case "Relaxation":
    case "Craniosacral Therapy":
    case "Aromatherapy Massage":
    case "Shiatsu Massage":
    case "Couples Massage":
    case "Lymphatic Drainage Massage":
    case "Thai Massage":
      return "spa-outline"; // Represents relaxation services

    case "Relocation":
    case "Moving Services":
    case "Residential Relocation":
    case "Corporate Relocation":
    case "International Relocation":
      return "car-outline"; // Represents relocation services

    case "Removal":
    case "Residential Snow Removal":
    case "Seasonal Decorations Removal":
    case "Holiday Lights Removal":
    case "Commercial Snow Removal":
      return "trash-outline"; // Represents removal services

    case "Rentals":
    case "Commercial Rentals":
    case "Tents and Canopies":
    case "Tables and Chairs":
    case "Residential Rentals":
    case "Short-term Rentals":
    case "Audio-Visual Equipment":
    case "Vacation Rentals":
    case "Bounce Houses":
    case "Linens":
    case "China and Glassware":
    case "Dance Floors":
      return "pricetag-outline"; // Represents rental services

    case "Repairs":
    case "Exhaust System Repair":
    case "Transmission Repair":
    case "Engine Repair":
    case "Brake Repair":
    case "Electrical System Repair":
    case "Cooling System Repair":
    case "AC Repair":
    case "Suspension Repair":
      return "construct-outline"; // Represents repair services

    case "Residential":
    case "Condos":
    case "Townhouses":
    case "Multi-family Homes":
    case "Single-family Homes":
      return "home-outline"; // Represents residential properties

    case "Roadside":
    case "Fuel Delivery":
    case "Towing Services":
    case "Lockout Services":
    case "Jump Starts":
    case "Flat Tire Assistance":
      return "car-outline"; // Represents roadside assistance

    case "Roofing":
    case "Roof Cleaning":
    case "Gutter Install":
    case "Roof Repair":
    case "Roof Inspection":
    case "Gutter Repair":
    case "Roof Replacement":
      return "home-outline"; // Represents roofing services

    case "STEM":
    case "Robotics Classes":
    case "Science Experiments":
    case "Coding Classes":
    case "Technology Workshops":
    case "Math Enrichment":
    case "Engineering Classes":
      return "calculator-outline"; // Represents STEM education

    case "Sales":
    case "Residential Sales":
    case "Luxury Sales":
    case "Commercial Sales":
    case "Land Sales":
      return "cash-outline"; // Represents sales services

    case "Salting":
    case "Commercial Salting":
    case "Residential Salting":
      return "snow-outline"; // Represents salting services

    case "Security":
    case "Access Control":
    case "Camera Install":
    case "Alarm Install":
    case "Intercom":
    case "Smart Home Security":
      return "lock-closed-outline"; // Represents security services

    case "Septic":
    case "Drain Field Repair":
    case "Septic Pumping":
    case "Septic Install":
    case "Septic Repair":
      return "water-outline"; // Represents septic services

    case "Sitting":
    case "In-Home Sitting":
    case "Daily Visits":
    case "Pet Walking":
    case "Extended Sitting":
    case "Pet Feeding":
    case "Medication Administration":
    case "Special Needs Sitting":
    case "Multiple Pets Sitting":
    case "Overnight Sitting":
      return "home-outline"; // Represents sitting services

    case "Skin Care":
    case "Mobile Chemical Peels":
    case "Acne Treatments":
    case "Facial Treatments":
    case "Chemical Peels":
    case "Mobile Facial Treatments":
    case "Mobile Microdermabrasion":
    case "Anti-Aging Treatments":
    case "Mobile Acne Treatments":
    case "Mobile Anti-Aging Treatments":
    case "Microdermabrasion":
      return "rose-outline"; // Represents skin care services

    case "Snow Plowing":
    case "Commercial Snow Plowing":
    case "Residential Snow Plowing":
      return "snow-outline"; // Represents snow plowing services

    case "Special":
    case "Occupational Therapy":
    case "ADHD Support":
    case "Speech Therapy":
    case "Learning Disabilities":
    case "Autism Support":
      return "heart-outline"; // Represents special care services

    case "Specialized":
    case "Diabetic Diet Plans":
    case "Allergy-Specific Diet Plans":
    case "Heart-Healthy Diet Plans":
      return "nutrition-outline"; // Represents specialized diet plans

    case "Specialty":
    case "Keto Cooking":
    case "Diabetic Meal Prep":
    case "Adventure Coaching":
    case "Paleo Baking":
    case "Keto Meal Prep":
    case "Motorcycle Detailing":
    case "Addiction Recovery Coaching":
    case "In-Home Massage":
    case "Paleo Meal Prep":
    case "Diabetic Cooking Classes":
    case "Gluten-Free Cooking Classes":
    case "Infant Massage":
    case "Grief Coaching":
    case "Vegan Cooking Classes":
    case "Corporate Massage":
    case "Low Sugar Meal Prep":
    case "Chair Massage":
    case "Geriatric Massage":
    case "ADHD Coaching":
    case "Diabetic Friendly Baking":
    case "Gluten-Free Meal Prep":
    case "Life Transition Coaching":
    case "Mobile Massage":
    case "Gluten-Free Cooking":
    case "Paleo Cooking Classes":
    case "Classic Car Restoration":
    case "Vegan Meal Prep":
    case "Keto Baking":
    case "Boat Detailing":
    case "Paleo Cooking":
    case "Gluten-Free Baking":
    case "Autism Coaching":
    case "Vegan Baking":
    case "Vegan Cooking":
    case "Keto Cooking Classes":
    case "On-Site Massage":
    case "RV Maintenance":
      return "star-outline"; // Represents specialty services

    case "Sports":
    case "Golf Lessons":
    case "Running Coaching":
    case "Swimming Lessons":
    case "Soccer Training":
    case "Cycling Coaching":
    case "Basketball Coaching":
    case "Tennis Coaching":
      return "trophy-outline"; // Represents sports coaching

    case "Staging":
    case "Furniture Staging":
    case "Decor Staging":
    case "Virtual Staging":
    case "Occupied Staging":
      return "home-outline"; // Represents staging services

    case "Supplies":
    case "Food and Treats":
    case "Toys and Accessories":
    case "Bedding and Cages":
    case "Training Supplies":
    case "Grooming Supplies":
    case "Health and Wellness Products":
      return "cart-outline"; // Represents supplies

    case "Test Prep":
    case "GRE Prep":
    case "SAT Prep":
    case "ACT Prep":
    case "MCAT Prep":
    case "GMAT Prep":
    case "GED Prep":
    case "AP Exam Prep":
    case "LSAT Prep":
      return "book-outline"; // Represents test preparation services

    case "Therapeutic":
    case "Sports Massage":
    case "Trigger Point Therapy":
    case "Hot Stone Massage":
    case "Swedish Massage":
    case "Postnatal Massage":
    case "Myofascial Release":
    case "Prenatal Massage":
    case "Reflexology":
    case "Deep Tissue Massage":
      return "spa-outline"; // Represents therapeutic massage services

    case "Tire":
    case "Tire Installation":
    case "Tire Rotation":
    case "Tire Balancing":
    case "Tire Repair":
      return "car-outline"; // Represents tire services

    case "Training":
    case "Puppy Training":
    case "Therapy Dog Training":
    case "Clicker Training":
    case "Service Dog Training":
    case "Agility Training":
    case "Basic Obedience Training":
    case "Advanced Obedience Training":
    case "Socialization Classes":
    case "Trick Training":
    case "Behavioral Modification Training":
    case "Protection Training":
      return "paw-outline"; // Represents dog training services

    case "Transport":
    case "Valet Services":
    case "Shuttle Services":
    case "Limousine Services":
    case "Party Buses":
      return "bus-outline"; // Represents transport services

    case "Travel":
    case "Travel Documentation":
    case "Pet-friendly Accommodations":
    case "Pet Transport":
      return "airplane-outline"; // Represents travel services

    case "Veterinary":
    case "Vaccinations":
    case "Surgery":
    case "Dental Care":
    case "Pet Diagnostics":
    case "Emergency Care":
    case "Routine Check-ups":
    case "Microchipping":
    case "Spaying/Neutering":
    case "Pet Pharmacy":
      return "medical-outline"; // Represents veterinary services

    case "Walking":
    case "Short Walks":
    case "Puppy Walks":
    case "Individual Walks":
    case "Dog Running":
    case "Dog Hiking":
    case "Evening Walks":
    case "Long Walks":
    case "Group Walks":
    case "Special Needs Walks":
    case "Behavioral Training Walks":
    case "Senior Dog Walks":
      return "walk-outline"; // Represents dog walking services

    case "Water":
    case "Reverse Osmosis":
    case "Purification":
    case "Filtration":
    case "Softening":
      return "water-outline"; // Represents water treatment services

    case "Waxing":
    case "Eyebrow Waxing":
    case "Bikini Waxing":
    case "Mobile Leg Waxing":
    case "Leg Waxing":
    case "Back Waxing":
    case "Mobile Bikini Waxing":
    case "Mobile Arm Waxing":
    case "Mobile Back Waxing":
    case "Arm Waxing":
    case "Mobile Eyebrow Waxing":
      return "cut-outline"; // Represents waxing services

    case "Wellness":
    case "Yoga Coaching":
    case "Mindfulness Coaching":
    case "Life Coaching":
    case "Sleep Coaching":
    case "Spiritual Coaching":
    case "Mindfulness Training":
    case "Holistic Health Coaching":
    case "Meditation":
    case "Stress Management":
    case "Meditation Coaching":
    case "Health Coaching":
      return "heart-outline"; // Represents wellness coaching

    case "Window":
    case "Window Cleaning":
      return "cleaning-outline"; // Represents window cleaning services

    case "Windows":
    case "Skylight Install":
    case "Window Replacement":
    case "Window Install":
    case "Window Repair":
    case "Skylight Repair":
      return "window-outline"; // Represents window services

    case "Yard":
    case "Yard Cleanup":
      return "leaf-outline"; // Represents yard services

    default:
      return "help-outline";
  }
};
