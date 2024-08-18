const badgesInfo = {
  // For Review
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
  // For Review
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
  // For Review
  R1HR: {
    name: "Response Within 1 Hour",
    description: "Respond to customer inquiries consistently within one hour.",
    icon: "time-outline",
  },
  // For Review
  FAIR: {
    name: "Fair Business",
    description:
      "Demonstrate fairness and integrity in your business practices.",
    icon: "thumbs-up-outline",
  },
  // For Review
  PUNC: {
    name: "Punctuality Award",
    description: "Consistently deliver services on time.",
    icon: "alarm-outline",
  },
  TPRO: {
    name: "Top Professional of the Year",
    description:
      "Recognized as the top professional in your field for outstanding service.",
    icon: "trophy-outline",
  },
  MBUS: {
    name: "Most Busy in the Category",
    description:
      "Achieve the highest level of activity in your service category.",
    icon: "briefcase-outline",
  },
  NEWB: {
    name: "New Business",
    description: "Recently established and ready to serve.",
    icon: "business-outline",
  },
  CLTY: {
    name: "Customer Loyalty",
    description:
      "Recognized for building a loyal customer base with repeat clients.",
    icon: "heart-outline",
  },
  CSTF: {
    name: "Customer Satisfaction",
    description: "Delivering exceptional service that leaves customers happy.",
    icon: "happy-outline",
  },
  SPDS: {
    name: "Speedy Service",
    description:
      "Awarded for consistently delivering services quickly without compromising quality.",
    icon: "flash-outline",
  },
  COMM: {
    name: "Communication Pro",
    description:
      "Recognized for excellent communication with customers, keeping them informed and at ease throughout the service.",
    icon: "chatbox-ellipses-outline",
  },
  CMKP: {
    name: "Commitment Keeper",
    description:
      "Recognized for consistently honoring commitments by not canceling confirmed jobs.",
    icon: "checkmark-done-outline",
  },
  EMRG: {
    name: "Emergency Service",
    description: "Available for emergency services.",
    icon: "warning-outline",
  },
};

// Function to get badge details by code
export function getBadgeDetails(code) {
  return badgesInfo[code] || null;
}
