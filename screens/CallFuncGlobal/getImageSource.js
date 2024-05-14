const getImageSource = (businessName, image_url) => {
  const defaultImageUrl = "../assets/images/defaultImage.png";
  // Check if image_url is an object
  if (image_url && typeof image_url === "object") {
    // Prioritize "Main" image if available
    if (image_url.Main) {
      return { uri: image_url.Main };
    } else {
      // Fallback to any first image available in the object
      const firstImageKey = Object.keys(image_url)[0];
      const firstImageUri = image_url[firstImageKey];
      return { uri: firstImageUri };
    }
  }
  // Check if image_url is a valid string
  else if (typeof image_url === "string" && image_url.trim() !== "") {
    return { uri: image_url };
  }
  // Default image if none of the above conditions are met
  return defaultImageUrl;
};

export default getImageSource;
