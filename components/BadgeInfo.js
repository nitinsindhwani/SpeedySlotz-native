const badgesInfo = {
  //For Review
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
  //For Review
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
  //For Review
  R1HR: {
    name: "Response Within 1 Hour",
    description: "Respond to customer inquiries consistently within one hour.",
    icon: "time-outline",
  },
  //For Review
  FAIR: {
    name: "Fair Business",
    description:
      "Demonstrate fairness and integrity in your business practices.",
    icon: "thumbs-up-outline",
  },
  //For Review
  PUNC: {
    name: "Punctuality Award",
    description: "Consistently deliver services on time.",
    icon: "alarm-outline",
  },

  CEXR: {
    name: "Certified Expert",
    description:
      "Possesses certifications that demonstrate expertise in a specific field.",
    icon: "certificate",
  },
  //For Review
  COMC: {
    name: "Community Contributor",
    description:
      "Actively contributes to local community events and charities.",
    icon: "hands-helping",
  },

  emergencyService: {
    name: "Emergency Service",
    description: "Available for emergency services.",
    icon: "warning-outline",
  },
};

// Function to get badge details by code
export function getBadgeDetails(code) {
  return badgesInfo[code] || null;
}
