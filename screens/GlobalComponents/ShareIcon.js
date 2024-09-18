import React from "react";
import { TouchableOpacity, Share, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { theme3 } from "../../assets/branding/themes";

const ShareIcon = ({
  business,
  size = 25,
  color = theme3.secondaryColor,
  style,
}) => {
  const shareContact = () => {
    const { yelpBusiness } = business;

    const yearFoundText = yelpBusiness.yearFound
      ? `In business since ${yelpBusiness.yearFound}.`
      : "";
    const googleRating =
      yelpBusiness.googleRating != null
        ? yelpBusiness.googleRating.toFixed(1)
        : "N/A";
    const speedySlotzRating =
      yelpBusiness.rating != null ? yelpBusiness.rating.toFixed(1) : "N/A";

    const message = `
📣 Check out ${yelpBusiness.name}!

📞 Phone: ${yelpBusiness.phone || "Not available"}
📍 Address: ${business.yelpBusinessLocation?.city || "N/A"}, ${
      business.yelpBusinessLocation?.state || "N/A"
    }

⭐ Google Rating: ${googleRating} (${
      yelpBusiness.googleReviewCount || 0
    } reviews)
⭐ SpeedySlotz Rating: ${speedySlotzRating} (${
      yelpBusiness.reviewCount || 0
    } reviews)

${yearFoundText}
${yelpBusiness.details || ""}

🏆 Achievements: ${
      yelpBusiness.badges ? yelpBusiness.badges.join(", ") : "None yet"
    }

To view more details and book services, download the SpeedySlotz app now!

📱 Android: 🤖
📱 iOS: 🍎

Looking forward to helping you!
`;

    console.log("Share Content:", message);

    Share.share({ message })
      .then((result) => console.log("Share result:", result))
      .catch((error) => console.log("Error sharing:", error));
  };
  return (
    <TouchableOpacity onPress={shareContact} style={[styles.container, style]}>
      <FontAwesome name="share-alt" size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 10,
    right: 10,
    zIndex: 2,
    padding: 5,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});

export default ShareIcon;
