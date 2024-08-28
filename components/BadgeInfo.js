import { useContext } from "react";
import { LanguageContext } from "../api/LanguageContext"; // Ensure this is imported correctly

const badgesInfo = {
  TOPR: {
    nameKey: "topRated",
    descriptionKey: "topRatedDescription",
    icon: "star-outline",
  },
  VERI: {
    nameKey: "verified",
    descriptionKey: "verifiedDescription",
    icon: "checkmark-circle-outline",
  },
  LOWP: {
    nameKey: "lowPrice",
    descriptionKey: "lowPriceDescription",
    icon: "pricetags-outline",
  },
  INSU: {
    nameKey: "insurance",
    descriptionKey: "insuranceDescription",
    icon: "shield-outline",
  },
  O5YB: {
    nameKey: "over5Years",
    descriptionKey: "over5YearsDescription",
    icon: "calendar-outline",
  },
  LICE: {
    nameKey: "licensed",
    descriptionKey: "licensedDescription",
    icon: "ribbon-outline",
  },
  R1HR: {
    nameKey: "responseWithin1Hour",
    descriptionKey: "responseWithin1HourDescription",
    icon: "time-outline",
  },
  FAIR: {
    nameKey: "fairBusiness",
    descriptionKey: "fairBusinessDescription",
    icon: "thumbs-up-outline",
  },
  PUNC: {
    nameKey: "punctualityAward",
    descriptionKey: "punctualityAwardDescription",
    icon: "alarm-outline",
  },
  TPRO: {
    nameKey: "topProfessionalOfTheYear",
    descriptionKey: "topProfessionalOfTheYearDescription",
    icon: "trophy-outline",
  },
  MBUS: {
    nameKey: "mostBusyInCategory",
    descriptionKey: "mostBusyInCategoryDescription",
    icon: "briefcase-outline",
  },
  NEWB: {
    nameKey: "newBusiness",
    descriptionKey: "newBusinessDescription",
    icon: "business-outline",
  },
  CLTY: {
    nameKey: "customerLoyalty",
    descriptionKey: "customerLoyaltyDescription",
    icon: "heart-outline",
  },
  CSTF: {
    nameKey: "customerSatisfaction",
    descriptionKey: "customerSatisfactionDescription",
    icon: "happy-outline",
  },
  SPDS: {
    nameKey: "speedyService",
    descriptionKey: "speedyServiceDescription",
    icon: "flash-outline",
  },
  COMM: {
    nameKey: "communicationPro",
    descriptionKey: "communicationProDescription",
    icon: "chatbox-ellipses-outline",
  },
  CMKP: {
    nameKey: "commitmentKeeper",
    descriptionKey: "commitmentKeeperDescription",
    icon: "checkmark-done-outline",
  },
  EMRG: {
    nameKey: "emergencyService",
    descriptionKey: "emergencyServiceDescription",
    icon: "warning-outline",
  },
};

// Function to get badge details by code with translations
export function getBadgeDetails(code, translations) {
  const badge = badgesInfo[code] || null;
  if (!badge) return null;

  return {
    ...badge,
    name: translations[badge.nameKey],
    description: translations[badge.descriptionKey],
  };
}
