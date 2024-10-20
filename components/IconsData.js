export const getIconName = (name) => {
  switch (name) {
    case "Handyman":
      return "hammer-outline";

    // Martial Arts Coaching Icons
    case "Martial Arts Coaching":
      return "body-outline"; // Represents martial arts in general
    case "Karate Coaching":
    case "Judo Coaching":
    case "Taekwondo Coaching":
    case "Brazilian Jiu-Jitsu Coaching":
    case "Kickboxing Coaching":
    case "Muay Thai Coaching":
    case "Wrestling Coaching":
      return "hand-left-outline"; // Represents individual martial arts coaching

    // Sports Coaching Icons
    case "Sports Coaching":
      return "trophy-outline"; // Represents sports coaching
    case "Soccer Coaching":
    case "Basketball Coaching":
    case "Tennis Coaching":
    case "Golf Coaching":
    case "Swimming Coaching":
    case "Rugby Coaching":
    case "Volleyball Coaching":
    case "Baseball Coaching":
    case "Football Coaching":
    case "Ice Hockey Coaching":
      return "football-outline"; // Represents different sports coaching services

    // Fitness Coaching Icons
    case "Fitness Coaching":
      return "barbell-outline"; // Represents general fitness coaching
    case "Boxing Coaching":
    case "CrossFit Coaching":
    case "Personal Training":
      return "fitness-outline"; // Represents boxing, CrossFit, and personal fitness coaching

    // Specialty Coaching Icons
    case "Specialty Coaching":
      return "star-outline"; // Represents specialty coaching
    case "ADHD Coaching":
    case "Autism Coaching":
    case "Addiction Recovery Coaching":
    case "Grief Coaching":
    case "Life Transition Coaching":
    case "Adventure Coaching":
    case "Career Coaching":
    case "Life Coaching":
      return "person-outline"; // Represents different specialty coaching services

    // Decor Category Icons
    case "Decor":
      return "color-palette-outline"; // Represents general decor services

    // Interior Design Icons
    case "Interior":
      return "home-outline"; // Represents interior design-related services
    case "Interior Design Service":
      return "brush-outline"; // Symbolizes creative interior design services

    // Furniture Selection Icons
    case "Furniture":
      return "bed-outline"; // Represents furniture-related services
    case "Furniture Selection Service":
      return "sofa-outline"; // Symbolizes furniture selection and placement

    // Art Installation Icons
    case "Art":
      return "image-outline"; // Represents wall art and artistic decor
    case "Wall Art Installation":
      return "easel-outline"; // Symbolizes the installation of wall art

    // Lighting Design Icons
    case "Lighting":
      return "bulb-outline"; // Represents lighting-related decor services
    case "Lighting Design Service":
      return "flash-outline"; // Symbolizes creative lighting design

    // Curtain Installation Icons
    case "Curtains":
      return "cloudy-outline"; // Represents curtain and window treatments
    case "Curtain Installation Service":
      return "cut-outline"; // Symbolizes curtain installation services

    // Shelving Installation Icons
    case "Shelving":
      return "albums-outline"; // Represents shelving and storage solutions
    case "Custom Shelving Installation":
      return "build-outline"; // Symbolizes custom shelving design and installation

    // Home Office Setup Icons
    case "Office":
      return "desktop-outline"; // Represents home office and workspace setup
    case "Home Office Setup Service":
      return "laptop-outline"; // Symbolizes home office setup services

    // Holiday Decoration Icons
    case "Holiday":
      return "gift-outline"; // Represents holiday-related decoration services
    case "Holiday Decoration Service":
      return "sparkles-outline"; // Symbolizes festive and holiday decoration

    // Dentist Category and Subcategory Icons

    // Emergency Care Subcategory
    case "Emergency Care":
      return "alert-circle-outline"; // Represents emergency situations in dental care

    // Emergency Care Services
    case "Emergency Dental Care":
    case "Toothache Relief":
    case "Broken Tooth Repair":
    case "Emergency Root Canal":
    case "Chipped Tooth Fix":
    case "Dental Abscess Treatment":
    case "Emergency Tooth Extraction":
    case "Lost Filling Replacement":
    case "Emergency Crown Repair":
    case "Bleeding Gums Treatment":
    case "Dental Trauma Care":
      return "medkit-outline"; // Represents individual emergency dental services

    // Pediatric Emergency Care Subcategory
    case "Pediatric Emergency Care": //
      return "happy-outline"; // Represents children's emergency dental care

    // Pediatric Emergency Services
    case "Pediatric Toothache Relief":
    case "Pediatric Broken Tooth Repair":
    case "Emergency Pediatric Tooth Extraction":
    case "Pediatric Lost Filling Replacement":
    case "Pediatric Dental Trauma Care":
      return "medkit-outline"; // Represents pediatric emergency dental services

    // Urgent Care Subcategory
    case "Urgent Care":
      return "speedometer-outline"; // Represents urgent but non-emergency dental care

    // Urgent Care Services
    case "Dental Checkup":
    case "Teeth Cleaning":
    case "Cavity Filling":
    case "Gum Disease Treatment":
    case "Wisdom Tooth Removal":
      return "pulse-outline"; // Represents individual urgent care dental services

    // Cosmetic Procedures Subcategory
    case "Cosmetic Procedures":
      return "diamond-outline"; // Represents cosmetic dentistry

    // Cosmetic Procedure Services
    case "Teeth Whitening":
    case "Veneers":
    case "Dental Implants":
    case "Bonding":
    case "Clear Aligners":
      return "star-outline"; // Represents individual cosmetic dental procedures

    // Orthodontics Subcategory
    case "Orthodontics":
      return "build-outline"; // Represents orthodontic services like braces

    // Orthodontics Services
    case "Braces":
    case "Retainers":
    case "Clear Braces":
      return "construct-outline"; // Represents individual orthodontic services

    // Pediatric Dentistry Subcategory
    case "Pediatric Dentistry":
      return "happy-outline"; // Represents general pediatric dental care

    // Pediatric Dentistry Services
    case "Pediatric Checkup":
    case "Pediatric Fillings":
    case "Fluoride Treatment":
      return "thermometer-outline"; // Represents individual pediatric dental services

    // Restorative Dentistry Subcategory
    case "Restorative Dentistry":
      return "hammer-outline"; // Represents restorative dental procedures

    // Restorative Dentistry Services
    case "Dental Bridges":
    case "Dental Crowns":
    case "Dentures":
      return "construct-outline"; // Represents individual restorative dental services

    // Preventive Dentistry Subcategory
    case "Preventive Dentistry":
      return "shield-outline"; // Represents preventive dental procedures

    // Preventive Dentistry Services
    case "Sealants":
    case "Oral Cancer Screening":
    case "Dental X-Rays":
      return "shield-checkmark-outline"; // Represents individual preventive dental services

    // Education Category and Subcategory Icons

    // Academic Tutoring Subcategory
    case "Academic Tutoring":
      return "school-outline"; // Represents academic tutoring

    // Academic Tutoring Services
    case "Math Tutoring":
    case "Science Tutoring":
    case "English Tutoring":
    case "History Tutoring":
    case "Geography Tutoring":
    case "Language Tutoring":
      return "book-outline"; // Represents subject-specific tutoring

    // Test Prep Services
    case "SAT Prep":
    case "ACT Prep":
    case "College Prep":
    case "Test Prep":
      return "pencil-outline"; // Represents test preparation services

    // Music Lessons Subcategory
    case "Music Lessons":
      return "musical-notes-outline"; // Represents music lessons

    // Music Lessons Services
    case "Piano Lessons":
    case "Guitar Lessons":
    case "Violin Lessons":
    case "Voice Lessons":
    case "Drum Lessons":
    case "Saxophone Lessons":
    case "Flute Lessons":
    case "Cello Lessons":
    case "Clarinet Lessons":
    case "Music Theory":
    case "Composition Lessons":
    case "Electronic Music":
      return "musical-note-outline"; // Represents individual music lessons

    // Art Classes Subcategory
    case "Art Classes":
      return "color-palette-outline"; // Represents art-related classes

    // Art Classes Services
    case "Drawing Classes":
    case "Painting Classes":
    case "Sculpture Classes":
    case "Ceramics Classes":
    case "Photography Classes":
    case "Digital Art Classes":
    case "Calligraphy Classes":
    case "Printmaking Classes":
    case "Mixed Media Classes":
      return "brush-outline"; // Represents individual art classes

    // Language Classes Subcategory
    case "Language Classes":
      return "language-outline"; // Represents language education

    // Language Classes Services
    case "English Classes":
    case "Spanish Classes":
    case "French Classes":
    case "German Classes":
    case "Chinese Classes":
    case "Japanese Classes":
    case "Italian Classes":
    case "Russian Classes":
    case "Arabic Classes":
      return "chatbubbles-outline"; // Represents individual language classes

    // STEM Classes Subcategory
    case "STEM Classes":
      return "calculator-outline"; // Represents STEM classes

    // STEM Classes Services
    case "Coding Classes":
    case "Robotics Classes":
    case "Engineering Classes":
    case "Science Experiments":
    case "Math Enrichment":
    case "Technology Workshops":
      return "flask-outline"; // Represents individual STEM-related classes

    // Professional Development Subcategory
    case "Professional Development":
      return "briefcase-outline"; // Represents professional development

    // Professional Development Services
    case "Public Speaking":
    case "Leadership Training":
    case "Business Writing":
    case "Project Management":
    case "Time Management":
    case "Negotiation Skills":
    case "Entrepreneurship":
      return "document-text-outline"; // Represents individual professional skills training

    case "Early Learning":
      return "school-outline"; // Represents early learning education

    // Early Learning Services
    case "Preschool Prep":
    case "Kindergarten Readiness":
    case "Early Literacy":
    case "Early Math Skills":
    case "Play-Based Learning":
      return "book-outline";

    // Special Education Subcategory
    case "Special Education":
      return "hand-left-outline"; // Represents special education services

    // Special Education Services
    case "Learning Disabilities":
    case "ADHD Support":
    case "Autism Support":
    case "Speech Therapy":
    case "Occupational Therapy":
      return "accessibility-outline"; // Represents individual special education services

    // Life Skills Subcategory
    case "Life Skills":
      return "bulb-outline"; // Represents life skills education

    // Life Skills Services
    case "Financial Literacy":
    case "Cooking Classes":
    case "Home Economics":
    case "Driver Education":
    case "Personal Safety":
      return "people-outline"; // Represents individual life skills services

    // Test Prep Subcategory
    case "Test Prep":
      return "document-text-outline"; // Represents test preparation services

    // Test Prep Services
    case "SAT Prep":
    case "ACT Prep":
    case "GRE Prep":
    case "GMAT Prep":
    case "LSAT Prep":
    case "MCAT Prep":
    case "AP Exam Prep":
    case "GED Prep":
      return "pencil-outline"; // Represents individual test preparation services

    // Hobby Classes Subcategory
    case "Hobby Classes":
      return "happy-outline"; // Represents hobby-related classes

    // Hobby Classes Services
    case "Cooking Classes":
    case "Gardening Classes":
    case "Photography Workshops":
    case "Creative Writing":
    case "Craft Workshops":
    case "Sewing Classes":
      return "flower-outline"; // Represents individual hobby and creative classes

    // Fashion & Styling Subcategories
    case "Tailoring & Alterations":
      return "create-outline"; // Represents the action of making or altering clothing
    case "Wardrobe Styling":
      return "shirt-outline"; // Represents clothing and fashion styling

    // Fashion & Styling Services
    case "Tailoring Service":
    case "Clothing Alteration Service":
      return "cut-outline"; // Alternative for scissors, representing tailoring and cutting
    case "Wardrobe Stylist Consultation":
      return "people-outline"; // Represents consultation services with a stylist
    case "Closet Organization Service":
      return "cube-outline"; // Symbolizes organization, suitable for closet services
    case "Personal Shopper Service":
      return "cart-outline"; // Represents shopping services
    case "Virtual Styling Service":
      return "videocam-outline"; // Symbolizes virtual styling services
    case "Group Training":
      return "people-outline";

    // Handyman Services Icons
    case "General Repairs":
      return "hammer-outline"; // Symbolizes general repair work

    case "Furniture Assembly":
      return "construct-outline"; // Represents assembling furniture

    case "Electrical Work":
      return "flash-outline"; // Represents electrical-related tasks

    case "Plumbing":
      return "water-outline"; // Symbolizes plumbing work

    case "Interior Painting":
      return "brush-outline"; // Symbolizes interior painting services

    case "Exterior Painting":
      return "color-fill-outline"; // Symbolizes exterior painting services

    case "Drywall Repair":
      return "build-outline"; // Represents construction and repair work like drywall

    case "Custom Carpentry":
      return "cut-outline"; // Represents woodwork and carpentry

    case "Appliance Installation":
      return "cube-outline"; // Represents installing home appliances

    case "Window Repairs":
      return "window-outline"; // Represents window-related repairs

    case "Door Repairs":
      return "door-outline"; // Represents door-related repairs

    case "Floor Installation":
      return "layers-outline"; // Symbolizes flooring installation

    case "Floor Repairs":
      return "hammer-outline"; // Represents repairs related to flooring

    case "Deck Repair":
      return "layers-outline"; // Represents deck-related repair

    case "Fence Repair":
      return "hammer-outline"; // Symbolizes fence-related repair

    case "Seasonal Maintenance":
      return "calendar-outline"; // Represents home maintenance and seasonal tasks

    case "Gutter Cleaning":
      return "water-outline"; // Represents cleaning gutters

    case "Power Washing":
      return "water-outline"; // Represents pressure washing services

    case "TV Mounting":
      return "tv-outline"; // Represents TV mounting or installation services
    case "Window & Door Repairs":
      return "key-outline";
    case "Cleaning":
      return "sparkles-outline"; // General icon for cleaning services

    // Holiday Category Icons
    case "Light Installation":
    case "Holiday Light Installation":
      return "bulb-outline"; // Represents holiday lights installation

    case "Light Removal":
    case "Holiday Light Removal":
      return "bulb-outline"; // Represents holiday lights removal

    case "Custom Lighting Design":
    case "Custom Holiday Lighting Design":
      return "color-palette-outline"; // Represents custom lighting design

    case "Light Maintenance":
    case "Holiday Light Maintenance":
      return "construct-outline"; // Represents maintenance work for holiday lights

    case "Decoration Installation":
    case "Holiday Decoration Installation":
      return "ribbon-outline"; // Symbolizes the installation of holiday decorations

    case "Decoration Removal":
    case "Holiday Decoration Removal":
      return "ribbon-outline"; // Symbolizes the removal of holiday decorations

    case "Custom Decoration Design":
    case "Custom Holiday Decoration Design":
      return "color-fill-outline"; // Represents custom decoration design

    case "Gift Wrapping":
    case "Gift Wrapping Service":
      return "gift-outline"; // Represents gift wrapping services

    case "Custom Wrapping Design":
    case "Custom Gift Wrapping Design":
      return "gift-outline"; // Represents custom wrapping design

    case "Event Planning":
    case "Holiday Event Planning":
      return "calendar-outline"; // Represents event planning services

    case "Venue Decoration":
    case "Holiday Venue Decoration":
      return "balloon-outline"; // Represents venue decoration services

    case "Catering":
    case "Holiday Catering":
      return "restaurant-outline"; // Represents catering services

    case "Personal Shopper":
    case "Holiday Personal Shopper":
      return "cart-outline"; // Represents personal shopping services

    case "Gift Selection":
    case "Gift Selection Service":
      return "gift-outline"; // Represents gift selection services

    // Home Category Icons
    case "Water":
    case "Water Purification System":
    case "Water Softening Service":
    case "Water Filtration System":
    case "Reverse Osmosis System":
      return "water-outline"; // Represents water-related services

    case "Automation":
    case "Smart Lighting Installation":
    case "Smart Thermostat Installation":
    case "Smart Lock Installation":
    case "Home Theater Setup":
    case "Whole-Home Audio Installation":
      return "settings-outline"; // Represents home automation services

    case "Inspections":
    case "Home Inspection Pre-Purchase":
    case "Home Inspection Pre-Sale":
    case "Energy Efficiency Audit":
    case "Radon Testing Service":
    case "Mold Inspection Service":
      return "clipboard-outline"; // Represents inspection services

    case "Septic":
    case "Septic Tank Pumping Service":
    case "Septic Tank Installation":
    case "Drain Field Repair Service":
      return "construct-outline"; // Represents septic system services

    case "Junk":
    case "Furniture Removal Service":
    case "Appliance Removal Service":
    case "Yard Waste Removal Service":
    case "Construction Debris Removal":
    case "Estate Cleanout Service":
    case "Hoarding Cleanup Service":
      return "trash-outline"; // Represents junk removal services

    // For Kitchen Remodel services
    case "Kitchen Remodel":
    case "Full Kitchen Remodel":
    case "Cabinet Installation":
    case "Countertop Installation":
    case "Backsplash Installation":
    case "Appliance Installation":
    case "Plumbing for Kitchen Remodel":
      return "restaurant-outline"; // Represents kitchen-related services

    // For Bathroom Remodel services
    case "Bathroom Remodel":
    case "Full Bathroom Remodel":
    case "Tile Installation":
    case "Shower Installation":
    case "Bathtub Installation":
    case "Vanity Installation":
    case "Plumbing for Bathroom Remodel":
      return "water"; // Represents bathroom-related services

    case "Flooring":
    case "Tile Floor Installation":
    case "Hardwood Floor Installation":
    case "Laminate Floor Installation":
    case "Carpet Installation":
      return "layers-outline"; // Represents flooring services

    case "Roofing":
    case "Roof Repair Service":
    case "New Roof Installation":
    case "Gutter Installation":
      return "home-outline"; // Represents roofing services

    case "Painting":
    case "Interior Painting Service":
    case "Exterior Painting Service":
    case "Cabinet Painting Service":
      return "brush-outline"; // Represents painting services

    case "HVAC":
    case "Air Conditioner Installation":
    case "Furnace Installation":
    case "Air Duct Cleaning":
    case "Heat Pump Installation":
      return "thermometer-outline"; // Represents HVAC services

    case "Plumbing":
    case "Pipe Repair Service":
    case "Drain Cleaning Service":
    case "Water Heater Installation":
    case "Toilet Installation":
      return "water-outline"; // Represents plumbing services

    case "Fencing":
    case "Fence Installation":
    case "Fence Repair":
      return "construct-outline"; // Represents fencing services

    case "Windows & Doors":
    case "Window Installation":
    case "Door Installation":
    case "Door Repair Service":
      return "home-outline"; // Represents window and door services

    case "Pool Maintenance":
    case "Pool Cleaning Service":
    case "Pool Repair Service":
    case "Pool Equipment Installation":
      return "water-outline"; // Represents pool maintenance services

    case "Carpentry":
    case "Custom Cabinet Installation":
    case "Deck Installation":
    case "Framing Service":
      return "hammer-outline"; // Represents carpentry services

    // For Garage Door Services
    case "Garage Door Services":
    case "Garage Door Installation":
    case "Garage Door Repair":
      return "car-outline"; // Represents garage-related services

    case "Outdoor Living":
    case "Deck Installation":
    case "Patio Installation":
    case "Outdoor Kitchen Installation":
      return "leaf-outline"; // Represents outdoor living services

    case "Solar Panel Installation":
    case "Solar Panel Installation Service":
    case "Solar Panel Repair Service":
      return "sunny-outline"; // Represents solar panel services

    case "Tile & Stonework":
    case "Tile Installation Service":
    case "Stone Paving Installation Service":
    case "Stone Wall Installation Service":
      return "build-outline"; // Represents tile and stonework services

    case "Home Theater Installation":
    case "Home Theater Setup":
    case "Surround Sound Installation":
    case "Projector Installation Service":
      return "videocam-outline"; // Represents home theater installation services

    case "Foundation Repair":
    case "Foundation Inspection Service":
    case "Crack Repair Service":
    case "Foundation Waterproofing Service":
      return "layers-outline"; // Represents foundation repair services

    // For Hair services
    case "Hair":
    case "Haircut":
    case "Hair Coloring":
    case "Hair Styling":
    case "Hair Extensions":
    case "Hair Treatments":
    case "Hair Perming":
    case "Special Needs Haircut":
    case "Adult Haircut":
      return "cut-outline"; // Represents hair-related services

    // For Nail services
    case "Nails":
    case "Manicure":
    case "Pedicure":
    case "Nail Art":
    case "Acrylic Nails":
    case "Gel Nails":
    case "Special Needs Manicure":
    case "Adult Manicure":
      return "hand-left-outline"; // Represents nail-related services

    // For Skin Care services
    case "Skin Care":
    case "Facial Treatments":
    case "Microdermabrasion":
    case "Chemical Peels":
    case "Acne Treatments":
    case "Anti-Aging Treatments":
    case "Special Needs Facial Treatments":
    case "Adult Facial Treatments":
      return "happy-outline"; // Represents facial or skin care services

    // For Waxing services
    case "Waxing":
    case "Eyebrow Waxing":
    case "Bikini Waxing":
    case "Leg Waxing":
    case "Arm Waxing":
    case "Back Waxing":
    case "Special Needs Eyebrow Waxing":
    case "Adult Eyebrow Waxing":
      return "body-outline"; // Represents body waxing services
    // For Lawn Care services
    case "Lawn Care":
    case "Lawn Mowing Service":
    case "Lawn Fertilization Service":
    case "Sod Installation Service":
      return "leaf-outline"; // Represents lawn-related services

    // For Garden services
    case "Garden":
    case "Garden Design Service":
    case "Garden Maintenance Service":
    case "Mulching Service":
      return "flower-outline"; // Represents garden-related services

    // For Tree Care services
    case "Tree Care":
    case "Tree Trimming Service":
    case "Tree Removal Service":
      return "leaf-outline"; // Represents tree care services

    // For Hardscaping services
    case "Hardscaping":
    case "Hardscaping Installation":
      return "construct-outline"; // Represents hardscaping services

    // For Landscape Design services
    case "Design":
    case "Landscape Design Service":
    case "Hardscaping Installation":
    case "Landscape Lighting Installation":
      return "construct-outline"; // Represents landscape design, hardscaping, and lighting services

    // For Irrigation services
    case "Irrigation":
    case "Irrigation System Installation":
    case "Irrigation System Repair":
      return "water-outline"; // Represents irrigation services

    // For Yard Care services
    case "Yard Care":
    case "Yard Cleanup Service":
      return "trash-outline"; // Represents yard cleanup services

    // For Immigration services
    case "Immigration":
    case "Visa Assistance":
    case "Citizenship Applications":
    case "Green Card Processing":
    case "Work Permits":
    case "Asylum Applications":
    case "Deportation Defense":
    case "Family-Based Petitions":
    case "Marriage Visas":
    case "Investor Visas":
    case "Student Visas":
    case "Naturalization Services":
      return "globe-outline"; // Represents immigration-related services

    // For Family Law services
    case "Family Law":
    case "Divorce Services":
    case "Child Custody":
    case "Child Support":
    case "Adoption Services":
    case "Domestic Violence":
    case "Prenuptial Agreements":
    case "Guardianship":
      return "people-outline"; // Represents family-related services

    // For Criminal Law services
    case "Criminal Law":
    case "Defense Services":
    case "Expungement":
    case "Juvenile Defense":
    case "DUI Defense":
    case "White Collar Crimes":
    case "Drug Crimes":
    case "Assault Defense":
      return "shield-outline"; // Represents criminal defense services

    // For Injury Law services
    case "Injury Law":
    case "Car Accidents":
    case "Slip and Fall":
    case "Medical Malpractice":
    case "Workplace Injuries":
    case "Product Liability":
    case "Wrongful Death":
      return "medkit-outline"; // Represents injury-related services

    // For Business Law services
    case "Business Law":
    case "Incorporation Services":
    case "Contract Drafting":
    case "Employment Law":
    case "Intellectual Property":
    case "Commercial Litigation":
    case "Mergers and Acquisitions":
      return "briefcase-outline"; // Represents business-related services

    // For Real Estate services
    case "Real Estate":
    case "Property Sales":
    case "Lease Agreements":
    case "Title Search":
    case "Zoning Issues":
    case "Foreclosure Defense":
    case "Landlord-Tenant Disputes":
      return "home-outline"; // Represents real estate-related services

    // For Estate services
    case "Estate":
    case "Wills":
    case "Trusts":
    case "Probate":
    case "Estate Administration":
    case "Power of Attorney":
    case "Living Wills":
      return "document-text-outline"; // Represents estate planning services

    // For Financial Law services
    case "Financial":
    case "Bankruptcy Services":
    case "Tax Law":
    case "Financial Fraud Defense":
    case "Debt Settlement":
    case "Foreclosure Assistance":
      return "cash-outline"; // Represents financial-related services

    // For Employment Law services
    case "Employment":
    case "Discrimination Cases":
    case "Workplace Harassment":
    case "Wrongful Termination":
    case "Wage and Hour Disputes":
    case "Employment Contracts":
      return "business-outline"; // Represents employment-related services

    // For Mediation services
    case "Mediation":
    case "Conflict Resolution":
    case "Divorce Mediation":
    case "Business Disputes":
    case "Labor Disputes":
    case "Contractual Disputes":
      return "hand-left-outline"; // Represents mediation services

    // For Environmental Law services
    case "Environmental":
    case "Regulatory Compliance":
    case "Land Use":
    case "Pollution Control":
    case "Wildlife Protection":
    case "Environmental Impact":
      return "leaf-outline"; // Represents environmental-related services

    // For Elder Law services
    case "Elder":
    case "Medicaid Planning":
    case "Long-Term Care Planning":
    case "Elder Abuse":
    case "Guardianship":
    case "Retirement Benefits":
      return "heart-outline"; // Represents elder-related services

    // For IP Law services
    case "IP":
    case "Trademark Registration":
    case "Patent Filing":
    case "Copyright Protection":
    case "IP Litigation":
    case "Trade Secrets":
      return "bulb-outline"; // Represents intellectual property services

    // For Notary services
    case "Notary":
    case "Document Notarization":
    case "Mobile Notary":
    case "Real Estate Closings":
    case "Loan Signing Agent":
    case "Document Preparation":
    case "Witness Services":
    case "Apostille Service":
    case "Power of Attorney Preparation":
      return "create-outline"; // Represents notary services

    case "House Cleaning":
    case "House Cleaning Service":
      return "home-outline"; // Represents house cleaning services

    case "Deep Cleaning":
    case "Deep Cleaning Service":
      return "water-outline"; // Represents deep cleaning

    case "Carpet Cleaning":
    case "Carpet Cleaning Service":
      return "layers-outline"; // Represents carpet or floor cleaning

    case "Window Cleaning":
    case "Window Cleaning Service":
      return "eye-outline"; // Represents window cleaning (closest available option)

    case "Office Cleaning":
    case "Office Cleaning Service":
      return "business-outline"; // Represents office cleaning

    case "Post-Construction Cleaning":
    case "Post-Construction Cleaning Service":
      return "construct-outline"; // Represents post-construction cleanup

    case "Move-In/Move-Out Cleaning":
    case "Move-In/Move-Out Cleaning Service":
      return "swap-horizontal-outline"; // Represents move-in/move-out cleaning

    case "Upholstery Cleaning":
    case "Upholstery Cleaning Service":
      return "bed-outline"; // Represents upholstery cleaning (closest available option)

    case "Tile and Grout Cleaning":
    case "Tile and Grout Cleaning Service":
      return "grid-outline"; // Represents tile and grout cleaning

    case "Pressure Washing":
    case "Pressure Washing Service":
      return "water-outline"; // Represents pressure washing

    case "Garage Cleaning":
    case "Garage Cleaning Service":
      return "car-outline"; // Represents garage cleaning

    case "Roof Cleaning":
    case "Roof Cleaning Service":
      return "home-outline"; // Represents roof cleaning

    case "Gutter Cleaning":
    case "Gutter Cleaning Service":
      return "water-outline"; // Represents gutter cleaning

    case "Citywide Delivery":
      return "paper-plane-outline"; // General icon for citywide delivery services

    case "Parcel Delivery":
    case "Within City Parcel Delivery":
      return "cube-outline"; // Represents package/parcel delivery

    case "Document Delivery":
    case "Document Delivery Service":
      return "document-outline"; // Represents document-related delivery

    case "Food Delivery":
    case "Within City Food Delivery":
      return "restaurant-outline"; // Represents food-related delivery

    // Chiropractor services
    case "Chiropractor":
    case "Chiropractic Care":
    case "Emergency Chiropractic Care":
    case "Acute Back Pain Relief":
    case "Spinal Adjustment Emergency":
    case "Emergency Neck Pain Treatment":
      return "hand-left-outline";

    case "Car Pooling":
    case "Ride Sharing":
    case "Car Pooling Service":
      return "car-outline"; // Car icon for ride-sharing services

    // Car Pooling - Daily Commuting
    case "Daily Commuting":
    case "Daily Carpooling":
      return "people-outline"; // People icon for daily carpooling services

    case "Mobile Car Detailing":
    case "Mobile Car Detailing Service":
    case "Mobile Interior Cleaning Service":
    case "Mobile Exterior Waxing Service":
    case "Mobile Headlight Restoration Service":
    case "Mobile Engine Detailing Service":
      return "car-sport-outline"; // Car icon for detailing services

    // Automotive - Mobile Automotive Repair
    case "Mobile Automotive Repair":
    case "Mobile Oil Change Service":
    case "Mobile Brake Repair Service":
    case "Mobile Tire Replacement Service":
    case "Mobile Battery Replacement Service":
    case "Mobile Transmission Fluid Change":
    case "Mobile Windshield Replacement Service":
      return "settings-outline"; // Settings icon for repair services

    // Automotive - Mobile Automotive Diagnostics
    case "Mobile Automotive Diagnostics":
    case "Mobile Car Diagnostics Service":
      return "speedometer-outline"; // Speedometer icon for diagnostics

    // Automotive - Roadside Assistance
    case "Roadside Assistance":
    case "Mobile Roadside Assistance Service":
    case "Mobile Jump Start Service":
    case "Mobile Lockout Service":
    case "Mobile Fuel Delivery Service":
      return "car-outline"; // Car icon for roadside services

    case "Refrigerator":
    case "Refrigerator Repair Service":
      return "snow-outline"; // Refrigerator icon

    case "Washing Machine":
    case "Washing Machine Repair":
      return "water-outline"; // Washing Machine icon

    case "Dryer":
    case "Dryer Repair Service":
      return "sunny-outline"; // Dryer icon

    case "Dishwasher":
    case "Dishwasher Repair Service":
      return "cafe-outline"; // Dishwasher icon

    case "Oven":
    case "Oven Repair Service":
      return "flame-outline"; // Oven icon

    case "Microwave":
    case "Microwave Repair Service":
      return "radio-outline"; // Microwave icon

    case "Small Appliance":
    case "Small Appliance Repair":
      return "construct-outline"; // Small Appliance icon

    case "HVAC":
    case "HVAC System Service":
      return "thermometer-outline"; // HVAC icon

    case "Air Conditioner":
    case "Air Conditioner Repair":
      return "snow-outline"; // Air Conditioner icon

    case "Heater":
    case "Heater Repair Service":
      return "flame-outline"; // Heater icon

    // For OB-GYN Services
    case "OB-GYN":
    case "Emergency OB-GYN Care":
    case "Emergency Pregnancy Care":
    case "Emergency Menstrual Pain Treatment":
    case "Emergency Gynecological Services":
      return "medkit-outline"; // Represents OB-GYN emergency services

    // Party Planning Subcategory and Services
    case "Planning":
    case "Birthday Party Planning":
    case "Corporate Event Planning":
    case "Wedding Planning":
    case "Anniversary Party Planning":
    case "Baby Shower Planning":
    case "Bridal Shower Planning":
    case "Retirement Party Planning":
    case "Graduation Party Planning":
    case "Holiday Party Planning":
      return "calendar-outline"; // Represents party planning services

    // Party Catering Subcategory and Services
    case "Catering":
    case "Full-Service Catering":
    case "Buffet Catering":
    case "BBQ Catering":
    case "Cocktail Catering":
    case "Dessert Catering":
    case "Beverage Service":
      return "fast-food-outline"; // Represents catering services

    // Party Decorations Subcategory and Services
    case "Decorations":
    case "Balloon Decorations":
    case "Floral Decorations":
    case "Themed Decorations":
    case "Party Lighting":
    case "Table Settings":
    case "Party Backdrops":
    case "Centerpieces":
      return "color-palette-outline"; // Represents decorations services

    // Party Entertainment Subcategory and Services
    case "Entertainment":
    case "Live Bands for Parties":
    case "Party DJs":
    case "Magicians for Parties":
    case "Party Clowns":
    case "Face Painting for Parties":
    case "Party Photobooths":
    case "Fireworks for Parties":
      return "musical-notes-outline"; // Represents entertainment services

    // Party Characters Subcategory and Services
    case "Characters":
    case "Superhero Party Characters":
    case "Princess Party Characters":
    case "Cartoon Party Characters":
    case "Movie Party Characters":
    case "Toy Party Characters":
    case "Classic Party Characters":
      return "happy-outline"; // Represents party characters services

    // Party Rentals Subcategory and Services
    case "Rentals":
    case "Party Table and Chair Rentals":
    case "Party Tent and Canopy Rentals":
    case "Party Bounce House Rentals":
    case "Party Dance Floor Rentals":
    case "Audio-Visual Equipment Rentals":
    case "Party Linen Rentals":
    case "China and Glassware Rentals":
      return "pricetag-outline"; // Represents party rentals services

    // Party Photography Subcategory and Services
    case "Photography":
    case "Event Photography Services":
    case "Event Videography Services":
    case "Photo Booth Rentals":
    case "Drone Photography Services":
      return "camera-outline"; // Represents photography services

    // Party Interactive Subcategory and Services
    case "Interactive":
    case "Escape Room Rentals":
    case "Virtual Reality (VR) Rentals":
    case "Interactive Theater Rentals":
    case "Game Bus Rentals":
    case "Mobile Laser Tag Rentals":
    case "Augmented Reality (AR) Rentals":
      return "game-controller-outline"; // Represents interactive services

    // Party DJs Subcategory and Services
    case "DJs":
    case "Bollywood DJ Services":
    case "Punjabi DJ Services":
    case "Hip Hop DJ Services":
    case "EDM DJ Services":
    case "House DJ Services":
    case "Rock DJ Services":
    case "Jazz DJ Services":
    case "Classical DJ Services":
    case "Pop DJ Services":
    case "Reggae DJ Services":
    case "Latin DJ Services":
    case "R&B DJ Services":
    case "Funk DJ Services":
      return "headset-outline"; // Represents DJ services

    // Party Favors Subcategory and Services
    case "Favors":
    case "Customized Party Favors":
    case "Themed Party Favors":
    case "Eco-friendly Party Favors":
    case "Edible Party Favors":
      return "gift-outline"; // Represents party favors services

    // Party Invitations Subcategory and Services
    case "Invitations":
    case "Digital Party Invitations":
    case "Printed Party Invitations":
    case "Customized Party Invitations":
    case "RSVP Management":
      return "mail-outline"; // Represents invitations services

    // Party Transport Subcategory and Services
    case "Transport":
    case "Limousine Rental Services":
    case "Party Bus Rental Services":
    case "Valet Parking Services":
    case "Shuttle Bus Services":
      return "car-outline"; // Represents transport services

    // Party Cleanup Subcategory and Services
    case "Cleanup":
    case "Post-Event Cleaning Services":
    case "Trash Removal Services":
    case "Equipment Breakdown Services":
      return "trash-outline"; // Represents cleanup services

    // Pediatrician Subcategory and Services
    case "Pediatrician":
    case "Emergency Pediatric Care":
    case "Childhood Illness Emergency":
    case "Emergency Vaccinations":
    case "Injury Emergency Care for Children":
      return "medkit-outline"; // Represents pediatric emergency services

    // Personal Assistance - Concierge Subcategory and Services
    case "Concierge":
    case "Personal Concierge":
      return "people-outline"; // Represents personal concierge services

    // Personal Assistance - Errands Subcategory and Services
    case "Errands":
    case "Errand Running":
      return "bicycle-outline"; // Represents errand running services

    // Personal Assistance - Shopping Subcategory and Services
    case "Shopping Assistance":
    case "Personal Shopping":
      return "cart-outline"; // Represents personal shopping services

    // For General Pest Control
    case "General Pest Control":
    case "General Pest Control Service":
      return "bug-outline"; // Represents pest control services

    // For Termite Control
    case "Termite":
    case "Termite Treatment Service":
      return "shield-checkmark-outline"; // Represents termite control

    // For Bed Bugs
    case "Bed Bugs":
    case "Bed Bug Treatment Service":
      return "bed-outline"; // Represents bed bug treatment

    // For Rodent Control
    case "Rodents":
    case "Rodent Control Service":
      return "alert-circle-outline"; // Represents rodent control

    // For Ant Control
    case "Ants":
    case "Ant Control Service":
      return "bug-outline"; // Since there is no specific ant icon, we'll use this to represent bug control

    // For Cockroach Control
    case "Cockroaches":
    case "Cockroach Control Service":
      return "close-circle-outline"; // Represents cockroach control

    // For Mosquito Control
    case "Mosquitoes":
    case "Mosquito Control Service":
      return "cloud-outline"; // Represents mosquito control

    // For Flea and Tick Control
    case "Fleas and Ticks":
    case "Flea and Tick Control Service":
      return "bug-outline"; // Represents flea and tick control

    // For Wasp and Hornet Removal
    case "Wasps and Hornets":
    case "Wasp and Hornet Removal":
      return "flash-outline"; // Represents wasp and hornet removal

    // For Wildlife Removal
    case "Wildlife":
    case "Wildlife Removal Service":
      return "paw-outline"; // Represents wildlife removal

    // For Bird Control
    case "Birds":
    case "Bird Control Service":
      return "leaf-outline"; // As there's no bird icon, leaf-outline can represent bird control

    // Boarding Services
    case "Boarding":
      return "home-outline"; // Unique icon for Boarding subcategory

    // Services under Boarding
    case "Dog Boarding Services":
    case "Cat Boarding Services":
    case "Exotic Pet Boarding Services":
    case "Long-term Pet Boarding":
    case "Short-term Pet Boarding":
    case "Pet Daycare Services":
    case "Luxury Pet Boarding Services":
    case "Special Needs Pet Boarding":
    case "In-Home Pet Boarding":
    case "Pet Boarding with Grooming":
    case "24-Hour Pet Supervision":
      return "home-outline"; // Same icon for all services under Boarding

    // Walking Services
    case "Walking":
      return "walk-outline"; // Unique icon for Walking subcategory

    // Services under Walking
    case "Individual Dog Walks":
    case "Group Dog Walks":
    case "Short Dog Walks":
    case "Long Dog Walks":
    case "Dog Running Services":
    case "Dog Hiking Services":
    case "Senior Dog Walks":
    case "Puppy Walks":
    case "Special Needs Dog Walks":
    case "Evening Dog Walks":
    case "Behavioral Training Walks":
      return "walk-outline"; // Same icon for all services under Walking

    // Sitting Services
    case "Sitting":
      return "person-outline"; // Unique icon for Sitting subcategory

    // Services under Sitting
    case "In-Home Pet Sitting":
    case "Overnight Pet Sitting":
    case "Daily Pet Visits":
    case "Special Needs Pet Sitting":
    case "Extended Pet Sitting":
    case "Multiple Pets Sitting":
    case "Pet Medication Administration":
    case "Pet Feeding Services":
    case "Pet Walking Services":
      return "person-outline"; // Same icon for all services under Sitting

    // Training Services
    case "Training":
      return "school-outline"; // Unique icon for Training subcategory

    // Services under Training
    case "Basic Dog Obedience Training":
    case "Puppy Obedience Training":
    case "Advanced Dog Obedience Training":
    case "Behavioral Modification for Dogs":
    case "Dog Agility Training":
    case "Service Dog Training":
    case "Therapy Dog Training":
    case "Dog Socialization Classes":
    case "Clicker Training for Dogs":
    case "Dog Protection Training":
    case "Dog Trick Training":
      return "school-outline"; // Same icon for all services under Training

    // Grooming Services
    case "Grooming":
      return "cut-outline"; // Unique icon for Grooming subcategory

    // Services under Grooming
    case "Luxury Pet Spa":
    case "Eco-Friendly Pet Grooming":
    case "Pet Bath & Haircut":
    case "Complete Pet Grooming Service":
    case "Pet Nail Trimming":
    case "Pet Ear Cleaning":
    case "Teeth Cleaning for Pets":
    case "Pet Fur Dyeing":
    case "De-shedding Treatment for Pets":
    case "Aromatherapy Pet Grooming":
      return "cut-outline"; // Same icon for all services under Grooming

    // Veterinary Services
    case "Veterinary":
      return "medkit-outline"; // Unique icon for Veterinary subcategory

    // Services under Veterinary
    case "Routine Pet Health Checkups":
    case "Pet Vaccinations":
    case "Spaying and Neutering":
    case "Emergency Pet Care":
    case "Pet Dental Care":
    case "Microchipping for Pets":
    case "Pet Surgery":
    case "Pet Health Diagnostics":
    case "Pet Pharmacy Services":
      return "medkit-outline"; // Same icon for all services under Veterinary

    // Supplies
    case "Supplies":
      return "cart-outline"; // Unique icon for Supplies subcategory

    // Services under Supplies
    case "Pet Food and Treats":
    case "Pet Toys and Accessories":
    case "Pet Bedding and Cages":
    case "Grooming Supplies for Pets":
    case "Health and Wellness Products for Pets":
    case "Training Supplies for Pets":
      return "cart-outline"; // Same icon for all services under Supplies

    // Real Estate Sales
    case "Sales":
      return "cash-outline"; // Unique icon for Sales subcategory

    // Services under Sales
    case "Residential Property Sales":
    case "Commercial Property Sales":
    case "Land Property Sales":
    case "Luxury Property Sales":
      return "cash-outline"; // Same icon for all services under Sales

    // Real Estate Rentals
    case "Rentals":
      return "home-outline"; // Unique icon for Rentals subcategory

    // Services under Rentals
    case "Residential Property Rentals":
    case "Commercial Property Rentals":
    case "Vacation Property Rentals":
    case "Short-term Property Rentals":
      return "home-outline"; // Same icon for all services under Rentals

    // Real Estate Commercial
    case "Commercial":
      return "business-outline"; // Unique icon for Commercial subcategory

    // Services under Commercial
    case "Office Space Rentals":
    case "Retail Space Rentals":
    case "Industrial Space Rentals":
    case "Mixed-use Space Rentals":
      return "business-outline"; // Same icon for all services under Commercial

    // Real Estate Residential
    case "Residential":
      return "home-outline"; // Unique icon for Residential subcategory

    // Services under Residential
    case "Single-family Home Rentals":
    case "Multi-family Home Rentals":
    case "Condominium Rentals":
    case "Townhouse Rentals":
      return "home-outline"; // Same icon for all services under Residential

    // Real Estate Appraisal
    case "Appraisal":
      return "analytics-outline"; // Unique icon for Appraisal subcategory

    // Services under Appraisal
    case "Residential Property Appraisal":
    case "Commercial Property Appraisal":
    case "Land Property Appraisal":
    case "Luxury Property Appraisal":
      return "analytics-outline"; // Same icon for all services under Appraisal

    // Real Estate Consulting
    case "Consulting":
      return "bulb-outline"; // Unique icon for Consulting subcategory

    // Services under Consulting
    case "Real Estate Market Analysis":
    case "Real Estate Investment Consulting":
    case "Property Management Consulting":
    case "Real Estate Development Consulting":
      return "bulb-outline"; // Same icon for all services under Consulting

    // Real Estate Management
    case "Management":
      return "settings-outline"; // Unique icon for Management subcategory

    // Services under Management
    case "Residential Property Management":
    case "Commercial Property Management":
    case "Vacation Property Management":
    case "HOA Property Management":
      return "settings-outline"; // Same icon for all services under Management

    // Real Estate Development
    case "Development":
      return "construct-outline"; // Unique icon for Development subcategory

    // Services under Development
    case "Residential Property Development":
    case "Commercial Property Development":
    case "Land Property Development":
    case "Mixed-use Property Development":
      return "construct-outline"; // Same icon for all services under Development

    // Real Estate Investment
    case "Investment":
      return "trending-up-outline"; // Unique icon for Investment subcategory

    // Services under Investment
    case "Residential Real Estate Investment":
    case "Commercial Real Estate Investment":
    case "Real Estate Investment Trusts (REITs)":
    case "Real Estate Crowdfunding":
      return "trending-up-outline"; // Same icon for all services under Investment

    // Real Estate Foreclosure
    case "Foreclosure":
      return "alert-circle-outline"; // Unique icon for Foreclosure subcategory

    // Services under Foreclosure
    case "Foreclosure Prevention Services":
    case "Short Sale Services":
    case "Real Estate Owned (REO) Property Services":
    case "Auction Property Services":
      return "alert-circle-outline"; // Same icon for all services under Foreclosure

    // Real Estate Staging
    case "Staging":
      return "brush-outline"; // Unique icon for Staging subcategory

    // Services under Staging
    case "Furniture Staging Services":
    case "Decor Staging Services":
    case "Virtual Staging Services":
    case "Occupied Home Staging Services":
      return "brush-outline"; // Same icon for all services under Staging

    // Real Estate Relocation
    case "Relocation":
      return "car-outline"; // Unique icon for Relocation subcategory

    // Services under Relocation
    case "Residential Relocation Services":
    case "Corporate Relocation Services":
    case "International Relocation Services":
    case "Professional Moving Services":
      return "car-outline"; // Same icon for all services under Relocation

    // Seniors & Special Needs: Home Help
    case "Home Help":
      return "hand-left-outline"; // Valid icon for Home Help

    // Services under Home Help
    case "Home Help Service":
      return "hand-left-outline"; // Same icon for Home Help Service

    // Seniors & Special Needs: Cleaning
    case "Cleaning":
      return "broom-outline"; // Valid icon for Cleaning

    // Services under Cleaning
    case "Cleaning Service":
      return "broom-outline"; // Same icon for Cleaning Service

    // Seniors & Special Needs: Meal Prep
    case "Meal Prep":
      return "restaurant-outline"; // Valid icon for Meal Prep

    // Services under Meal Prep
    case "Meal Service":
      return "restaurant-outline"; // Same icon for Meal Service

    // Seniors & Special Needs: Shopping
    case "Shopping":
      return "cart-outline"; // Valid icon for Shopping

    // Services under Shopping
    case "Shopping Service":
      return "cart-outline"; // Same icon for Shopping Service

    // Seniors & Special Needs: Transport
    case "Transport":
      return "car-outline"; // Valid icon for Transport

    // Services under Transport
    case "Transport Service":
      return "car-outline"; // Same icon for Transport Service

    // Seniors & Special Needs: Care
    case "Care":
      return "heart-outline"; // Valid icon for Care

    // Services under Care
    case "Care Service":
      return "heart-outline"; // Same icon for Care Service

    // Seniors & Special Needs: Medication
    case "Medication":
      return "medkit-outline"; // Valid icon for Medication

    // Services under Medication
    case "Medication Reminder":
      return "medkit-outline"; // Same icon for Medication Reminder

    // Seniors & Special Needs: Home Mods
    case "Home Mods":
      return "construct-outline"; // Valid icon for Home Modifications

    // Services under Home Mods
    case "Home Modifications":
      return "construct-outline"; // Same icon for Home Modifications

    // Seniors & Special Needs: Personal Care
    case "Personal Care":
      return "body-outline"; // Valid icon for Personal Care

    // Services under Personal Care
    case "Personal Care":
      return "body-outline"; // Same icon for Personal Care

    // Seniors & Special Needs: Errands
    case "Errands":
      return "walk-outline"; // Valid icon for Errands

    // Services under Errands
    case "Errands Service":
      return "walk-outline"; // Same icon for Errands Service

    // Seniors & Special Needs: Safety Checks
    case "Safety Checks":
      return "shield-outline"; // Valid icon for Safety Checks

    // Services under Safety Checks
    case "Safety Checks":
      return "shield-outline"; // Same icon for Safety Checks

    // Seniors & Special Needs: Pet Care
    case "Pet Care":
      return "paw-outline"; // Valid icon for Pet Care

    // Services under Pet Care
    case "Pet Care":
      return "paw-outline"; // Same icon for Pet Care

    // Seniors & Special Needs: Tech Help
    case "Tech Help":
      return "laptop-outline"; // Valid icon for Tech Help

    // Services under Tech Help
    case "Tech Help":
      return "laptop-outline"; // Same icon for Tech Help

    // Seniors & Special Needs: Medical Transport
    case "Medical Transport":
      return "bus-outline"; // Valid alternative icon for Medical Transport

    // Services under Medical Transport
    case "Medical Transport":
      return "bus-outline"; // Same icon for Medical Transport

    // Physician: Care
    case "Care":
      return "medkit-outline"; // Valid icon for general care

    // Services under Care
    case "Urgent Care Visits":
      return "medkit-outline"; // Same icon for Urgent Care Visits

    // Physician: Emergency Treatment
    case "Emergency Treatment":
      return "pulse-outline"; // Valid icon for emergency illness treatment

    // Services under Emergency Treatment
    case "Emergency Illness Treatment":
      return "pulse-outline"; // Same icon for Emergency Illness Treatment

    // Physician: Injury Treatment
    case "Injury Treatment":
      return "bandage-outline"; // Valid icon for injury treatment

    // Services under Injury Treatment
    case "Minor Injury Treatment":
      return "bandage-outline"; // Same icon for Minor Injury Treatment

    // Physician: Wound Care
    case "Wound Care":
      return "thermometer-outline"; // Valid icon for wound care

    // Services under Wound Care
    case "Stitches and Sutures":
      return "thermometer-outline"; // Same icon for Stitches and Sutures

    // Physical Therapist: Physical Therapy
    case "Physical Therapy":
      return "fitness-outline"; // Valid icon for physical therapy

    // Services under Physical Therapy
    case "Emergency Physical Therapy":
      return "fitness-outline"; // Same icon for Emergency Physical Therapy

    // Physical Therapist: Rehabilitation
    case "Rehabilitation":
      return "walk-outline"; // Valid icon for rehabilitation

    // Services under Rehabilitation
    case "Acute Injury Rehabilitation":
      return "walk-outline"; // Same icon for Acute Injury Rehabilitation

    // Physical Therapist: Post-Surgery Therapy
    case "Post-Surgery Therapy":
      return "heart-outline"; // Valid icon for post-surgery therapy

    // Services under Post-Surgery Therapy
    case "Post-Surgery Physical Therapy":
      return "heart-outline"; // Same icon for Post-Surgery Physical Therapy

    // Physical Therapist: Sports Injury Care
    case "Sports Injury Care":
      return "football-outline"; // Valid icon for sports injury care

    // Services under Sports Injury Care
    case "Sports Injury Emergency Care":
      return "football-outline"; // Same icon for Sports Injury Emergency Care

    // General Practitioner: General Practice
    case "General Practice":
      return "people-outline"; // Valid icon for general practice

    // Services under General Practice
    case "Emergency General Practice":
      return "people-outline"; // Same icon for Emergency General Practice

    // General Practitioner: Prescriptions
    case "Prescriptions":
      return "clipboard-outline"; // Valid icon for prescription refills

    // Services under Prescriptions
    case "Emergency Prescription Refills":
      return "clipboard-outline"; // Same icon for Emergency Prescription Refills

    // General Practitioner: Allergy Care
    case "Allergy Care":
      return "leaf-outline"; // Valid icon for allergy care

    // Services under Allergy Care
    case "Emergency Allergy Treatment":
      return "leaf-outline"; // Same icon for Emergency Allergy Treatment

    // General Practitioner: Acute Illness Care
    case "Acute Illness Care":
      return "thermometer-outline"; // Valid icon for acute illness care

    // Services under Acute Illness Care
    case "Acute Illness Emergency Care":
      return "thermometer-outline"; // Same icon for Acute Illness Emergency Care

    case "Window Cleaning":
    case "Pool Cleaning":
      return "water-outline";
    case "Interior Design":
    case "Art Teaching":
      return "color-palette-outline";
    case "Auto Detailing":
    case "Automotive":
      return "car-sport-outline";
    case "Citywide Delivery":
      return "paper-plane-outline";
    case "Fashion & Styling":
      return "glasses-outline";
    case "Personal Assistance":
      return "person-outline";
    case "Air Conditioner":
      return "snow-outline";
    case "Dishwasher":
      return "cafe-outline";
    case "Boarding":
      return "bed-outline";
    case "Holiday":
      return "gift-outline";
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
    case "Car Pooling":
      return "people-outline";
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
    case "Pest Control":
      return "bug-outline"; // Represents pest control services
    case "Mobile Salon":
      return "bus-outline";
    case "Seniors & Special Needs":
      return "accessibility-outline";
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
    case "Hair Perming":
    case "Mobile Adult Haircut":
    case "Mobile Special Needs Haircut":
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
