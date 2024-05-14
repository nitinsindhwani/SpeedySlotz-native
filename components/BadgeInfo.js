const badgesInfo = {
  TOPR: {
    name: "Top Rated",
    description:
      "Consistently receive top ratings from customers for outstanding service.",
    icon: "star-outline",
  },
  VERI: {
    name: "Verified",
    description:
      "Successfully pass a verification process for identity and credentials.",
    icon: "checkmark-circle-outline",
  },
  LOWP: {
    name: "Low Price",
    description:
      "Offer competitive pricing and excellent value for your services.",
    icon: "pricetags-outline",
  },
  INSU: {
    name: "Insurance",
    description: "Maintain proper insurance for liability and damages.",
    icon: "shield-outline",
  },
  O5YB: {
    name: "Over 5 Years In Business",
    description:
      "Operate a business with a proven track record of over five years.",
    icon: "calendar-outline",
  },
  LICE: {
    name: "Licensed",
    description: "Hold and maintain proper professional licensing.",
    icon: "ribbon-outline",
  },
  R1HR: {
    name: "Response Within 1 Hour",
    description: "Respond to customer inquiries consistently within one hour.",
    icon: "time-outline",
  },
  TPOY: {
    name: "Top Professional of the Year",
    description:
      "Be recognized for exceptional professional achievements within the year.",
    icon: "trophy-outline",
  },
  FAIR: {
    name: "Fair Business",
    description:
      "Demonstrate fairness and integrity in your business practices.",
    icon: "thumbs-up-outline",
  },
  MBUS: {
    name: "Most Busy In The Category",
    description:
      "Achieve the highest number of bookings in your service category.",
    icon: "people-outline",
  },
  PUNC: {
    name: "Punctuality Award",
    description: "Consistently deliver services on time.",
    icon: "alarm-outline",
  },
  HIIM: {
    name: "Highlight on Image",
    description:
      "Earn a special feature that highlights your business in search results.",
    icon: "flash-outline",
  },
  BLOP: {
    name: "Black Owned & Operated",
    description:
      "Proudly own and operate a business as a member of the Black community.",
    icon: "heart-outline",
  },
  MINO: {
    name: "Minority Owned & Operated",
    description: "Own and operate a business as a member of a minority group.",
    icon: "users",
  },
  WOMN: {
    name: "Women Owned & Operated",
    description: "Business is owned and operated by women.",
    icon: "user-female",
  },
  VETR: {
    name: "Veteran Owned & Operated",
    description: "Run a business owned and operated by military veterans.",
    icon: "medal",
  },
  LGBT: {
    name: "LGBTQ+ Friendly",
    description:
      "Create a welcoming and supportive environment for the LGBTQ+ community.",
    icon: "rainbow",
  },
  ESPA: {
    name: "Se Habla Español",
    description: "Provide services to Spanish-speaking customers.",
    icon: "comments",
  },
  FAMO: {
    name: "Family Owned & Operated",
    description: "Operate a business that is owned and run by a family.",
    icon: "home-heart",
  },
  CEXR: {
    name: "Certified Expert",
    description:
      "Possesses certifications that demonstrate expertise in a specific field.",
    icon: "certificate",
  },
  ECOF: {
    name: "Eco-Friendly",
    description: "Commits to sustainable practices and eco-friendly services.",
    icon: "leaf",
  },
  SERV: {
    name: "24/7 Service",
    description: "Offers services around the clock, any day of the week.",
    icon: "clock",
  },
  LOYA: {
    name: "Customer Loyalty",
    description:
      "Recognized for building a loyal customer base with repeat clients.",
    icon: "heart",
  },
  COMC: {
    name: "Community Contributor",
    description:
      "Actively contributes to local community events and charities.",
    icon: "hands-helping",
  },
  INNO: {
    name: "Innovative Solutions",
    description:
      "Known for providing innovative and creative solutions to problems.",
    icon: "lightbulb",
  },
  SAFE: {
    name: "Safety Champion",
    description:
      "Prioritizes safety with outstanding records in workplace and service safety.",
    icon: "shield-alt",
  },
  TECH: {
    name: "Tech-Savvy",
    description: "Utilizes the latest technology to enhance service delivery.",
    icon: "laptop-code",
  },
  TRNR: {
    name: "Excellent Trainer",
    description:
      "Provides exceptional training and mentorship within their industry.",
    icon: "chalkboard-teacher",
  },
  DIVL: {
    name: "Diversity Leader",
    description: "Fosters an inclusive environment and promotes diversity.",
    icon: "hands",
  },
  AWNW: {
    name: "Award Winner",
    description: "Recipient of industry or consumer awards.",
    icon: "trophy",
  },
  HEAW: {
    name: "Health & Wellness Advocate",
    description:
      "Promotes health and wellness within their services and company culture.",
    icon: "heartbeat",
  },
  ACCS: {
    name: "Accessibility Champion",
    description: "Ensures services are accessible to people with disabilities.",
    icon: "universal-access",
  },
};

// Function to get badge details by code
export function getBadgeDetails(code) {
  return badgesInfo[code] || null;
}
