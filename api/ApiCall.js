import axios from "axios";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import qs from "qs";
import { baseApiUrl, baseKeyCloakUrl } from "./Config";

const apiKey = "AIzaSyA0lolNAdaUEWUslsIPxKajib9p0kToU1U";
const yelpApiKey =
  "Bearer NW0Q2WfEet1G5zAYoyAqjxMz2RY9RR3RKjsCgC6z9aFZRcAaPwJ-DgjvU9xU0WrYc4D1-84B42vldUc5feryCzn2Hp6oo8yVQjCW7xQKb4seMW6fJiZnqf4VjQvDZHYx"; // Replace 'YOUR_YELP_API_KEY' with your actual key
const loginApiUrl = baseApiUrl + "/api/v1/users/login"; // Replace this with your actual login API URL
// Replace this with your actual login API URL

export const getLocationAndCityState = async (query) => {
  let location, data;

  if (query) {
    // Use Google Places API to convert query to coordinates (latitude and longitude)
    // This is a placeholder URL, you'll need to use the actual Google Places API endpoint
    const placesResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
        query
      )}&inputtype=textquery&fields=geometry&key=${apiKey}`
    );
    if (!placesResponse.data.candidates.length) {
      throw new Error("Location not found.");
    }
    const { lat, lng } = placesResponse.data.candidates[0].geometry.location;
    location = { coords: { latitude: lat, longitude: lng } };
  } else {
    // Get the device's current location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permission to access location was denied.");
    }
    location = await Location.getCurrentPositionAsync({});
  }

  // Use coordinates to fetch city, state, and zipcode
  const geocodeResponse = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=${apiKey}`
  );
  data = geocodeResponse.data;

  let cityState = "";
  let zipcode = "";

  if (data.results && data.results.length > 0) {
    const addressComponents = data.results[0].address_components;
    for (const component of addressComponents) {
      if (component.types.includes("locality")) {
        cityState += component.long_name;
      } else if (component.types.includes("administrative_area_level_1")) {
        cityState += `, ${component.long_name}`;
      } else if (component.types.includes("postal_code")) {
        zipcode = component.long_name;
      }
    }
  }

  return { location, cityState, zipcode };
};

export const fetchHints = async (text) => {
  if (text.length > 0) {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=(cities)&key=${apiKey}`
    );
    return response.data.predictions
      ? response.data.predictions.map((item) => item.description)
      : [];
  }
  return [];
};

export const fetchBusinessesByCategory = async (
  category,
  location,
  latitude,
  longitude,
  zipcode,
  date,
  radius
) => {
  const intRadius = parseInt(radius, 10);

  const params = {
    term: category,
    location: location,
    latitude: latitude,
    longitude: longitude,
    zipcode: zipcode,
    date: date,
    radius: intRadius,
  };

  // Constructing URL with params for logging
  const baseURL = baseApiUrl + "/api/v1/businesses";
  const queryString = Object.keys(params)
    .map((key) => key + "=" + params[key])
    .join("&");

  const fullURL = `${baseURL}?${queryString}`;
  // Fetch token from SecureStore
  console.log("SearchURL:", fullURL);
  const userToken = await SecureStore.getItemAsync("userToken");
  if (!userToken) {
    throw new Error("Token not found in SecureStore!");
  }

  const headers = {
    Authorization: `Bearer ${userToken}`,
  };

  const response = await axios.get(baseURL, {
    params,
    headers,
  });

  return response.data.businesses;
};

export const fetchBusinessDetails = async (businessId) => {
  if (!businessId) {
    return Promise.reject(new Error("No businessId provided"));
  }

  return fetch(`https://api.yelp.com/v3/businesses/${businessId}`, {
    headers: {
      Authorization:
        "Bearer NW0Q2WfEet1G5zAYoyAqjxMz2RY9RR3RKjsCgC6z9aFZRcAaPwJ-DgjvU9xU0WrYc4D1-84B42vldUc5feryCzn2Hp6oo8yVQjCW7xQKb4seMW6fJiZnqf4VjQvDZHYx",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Process the data and return the relevant details
      const businessDetails = {
        name: data.name || "Business Name Not Available",
        display_phone: data.display_phone || "Phone Not Available",
        location: {
          address1: data.location?.address1 || "Address Not Available",
          city: data.location?.city || "City Not Available",
          zip_code: data.location?.zip_code || "Zip Code Not Available",
          display_address: data.location?.display_address || [
            "Address Not Available",
          ],
        },
        rating: data.rating || 0,
        review_count: data.review_count || 0,
        image_url: data.image_url || null,
      };

      return businessDetails;
    });
};

export const loginUser = async (username, password) => {
  const clientId = "speedyslotsapp";
  const scope = "openid email profile address";
  const grantType = "password";
  try {
    const data = qs.stringify({
      client_id: clientId,
      grant_type: grantType,
      scope: scope,
      username: username,
      password: password,
    });
    const keycloakUrl =
      baseKeyCloakUrl + "/realms/speedyslotz-dev/protocol/openid-connect/token";

    const tokenResponse = await axios.post(keycloakUrl, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (tokenResponse.data && tokenResponse.data.access_token) {
      await SecureStore.setItemAsync(
        "userToken",
        tokenResponse.data.access_token
      );

      // Now make an API call to your loginApiUrl with the token.
      const apiResponse = await axios.post(
        loginApiUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.data.access_token}`,
          },
          params: {
            username,
            password,
          },
        }
      );

      const userData =
        typeof apiResponse.data === "object"
          ? JSON.stringify(apiResponse.data)
          : apiResponse.data;
      await SecureStore.setItemAsync("userData", userData);

      return apiResponse.data;
    }

    return response.data;
  } catch (error) {
    console.error("Detailed Error:", error);
    console.error("Login failed:", error.message);
    if (error.response) {
      // Server responded with a status other than 200 range
      console.error("Error Data:", error.response.data);
      console.error("Error Status:", error.response.status);
      console.error("Error Headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Error Request:", error.request);
    } else {
      // Some other error
      console.error("General Error:", error.message);
    }
    throw new Error(
      "Login failed. Please check your credentials and try again."
    );
  }
};

// Function to sign up a new user
export const signupUser = async (userData) => {
  const signUpApiUrl = baseApiUrl + "/api/v1/users/signup";
  try {
    const response = await axios.post(signUpApiUrl, userData);

    if (response.data) {
      const accessToken = response.headers["access_token"];
      await SecureStore.setItemAsync("userToken", accessToken);
    }
    return response.data;
  } catch (error) {
    console.error("Signup failed:", error.message);
    throw new Error("Signup failed. Please check your data and try again.");
  }
};

export const resendVerifyEmail = async (userData) => {
  const resendEmailUrl = baseApiUrl + "/api/v1/users/resendEmail";
  const response = await axios.post(resendEmailUrl, userData);
  return response;
};

export const forgotPassword = async (email) => {
  const resendEmailUrl = baseApiUrl + "/api/v1/users/forgotPassword";

  const response = await axios.post(
    resendEmailUrl,
    {},
    {
      params: {
        email,
      },
    }
  );

  return response;
};

export const resetPassword = async (userId, newPassword) => {
  const resendEmailUrl = baseApiUrl + "/api/v1/users/resetPassword";

  const response = await axios.post(
    resendEmailUrl,
    {},
    {
      params: {
        userId,
        newPassword,
      },
    }
  );

  return response;
};

export const getStoredToken = async () => {
  try {
    return await SecureStore.getItemAsync("userToken");
  } catch (error) {
    console.error("Error retrieving token:", error.message);
    throw error;
  }
};

export const getStoredUser = async () => {
  try {
    const userDataString = await SecureStore.getItemAsync("userData");
    return JSON.parse(userDataString);
  } catch (error) {
    console.error("Error retrieving user data:", error.message);
    throw error;
  }
};

export const fetchFavorites = async () => {
  const secureToken = await getStoredToken();
  const response = await fetch(baseApiUrl + "/api/v1/favorites", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${secureToken}`,
      "Content-Type": "application/json",
    },
  });

  // Parse the response as JSON
  const parsedResponse = await response.json();

  // Here, I'm assuming that the structure is {data: {businesses: [...]}}
  // If the structure is different, you might need to adjust the code accordingly
  const businesses = parsedResponse.businesses;

  return businesses;
};

export const fetchNotifications = async () => {
  const secureToken = await getStoredToken();

  const response = await fetch(
    baseApiUrl + "/api/v1/notifications/getNotifications",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secureToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    console.error("API Response:", await response.text());
    throw new Error("Failed to fetch favorites");
  }

  // Parse the response as JSON
  const notifications = await response.json();

  // For debugging purposes, it's good to log the parsedResponse to understand its structure

  // Check if businesses is available
  if (!notifications) {
    console.error("notifications not found in response");
    throw new Error("Notifications data missing");
  }

  return notifications;
};

export const deleteNotifications = async (notificationId) => {
  const secureToken = await getStoredToken();

  const response = await fetch(
    `http://localhost:8080/api/v1/notifications/deleteNotifications?notificationId=${notificationId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${secureToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    console.error("API Response:", await response.text());
    throw new Error("Failed to delete notification");
  }

  const successMessage = await response.text();

  return successMessage; // Returning the success message or handle as needed
};

export const fetchBookings = async (bookingType) => {
  const secureToken = await getStoredToken();

  const response = await fetch(
    baseApiUrl + `/api/v1/userBookings/getBookings?bookingType=${bookingType}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secureToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    console.error("API Response:", await response.text());
    throw new Error("Failed to fetch favorites");
  }

  // Parse the response as JSON
  const parsedResponse = await response.json();

  // Here, I'm assuming that the structure is {data: {businesses: [...]}}
  // If the structure is different, you might need to adjust the code accordingly
  const businesses = parsedResponse.businesses;

  // Check if businesses is available
  if (!businesses) {
    console.error("Businesses not found in response");
    throw new Error("Businesses data missing");
  }

  return businesses;
};

export const saveProfiles = async (profileData) => {
  console.log("profileData", profileData);
  const saveProfileInfoUrl = baseApiUrl + "/api/user-profile/save";
  try {
    const secureToken = await getStoredToken();

    const headers = {
      Authorization: `Bearer ${secureToken}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(saveProfileInfoUrl, profileData, {
      headers: headers,
    });

    return response;
  } catch (error) {
    console.error("Signup failed:", error.message);
    throw new Error("Signup failed. Please check your data and try again.");
  }
};

export const fetchProfiles = async () => {
  try {
    const secureToken = await getStoredToken(); // Retrieve the stored token
    const userData = await getStoredUser(); // Retrieve stored user data

    // Ensure you have a valid userId before making the request
    if (!userData || !userData.user_id) {
      throw new Error("User ID is missing");
    }

    const userId = userData.user_id;

    const response = await fetch(
      `${baseApiUrl}/api/user-profile/fetch/${userId}`, // Using template literals for URL
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secureToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      // Extract error message from response body if possible
      const errorText = await response.text();
      console.error("API Response Error:", errorText);
      throw new Error("Failed to fetch user profiles");
    }

    // Assuming the API directly returns the profile data in the desired structure
    const profileData = await response.json();

    return profileData; // Return the fetched profile data
  } catch (error) {
    console.error("Error fetching user profiles:", error);
    throw error; // Re-throw the error for handling by the caller
  }
};

export const fetchChatHistory = async (chatInfo, token) => {
  const fetchChatHistoryUrl = baseApiUrl + "/api/v1/chat/history/by-user";

  const response = await axios.post(fetchChatHistoryUrl, chatInfo, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response;
};

export const fetchCategories = async () => {
  const secureToken = await getStoredToken();
  const response = await fetch(
    baseApiUrl + "/api/v1/categories/getAllCategories",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secureToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    console.error("API Response:", await response.text());
    throw new Error("Failed to fetch favorites");
  }

  // Parse the response as JSON
  const categories = await response.json();

  // For debugging purposes, it's good to log the parsedResponse to understand its structure

  // Check if businesses is available
  if (!categories) {
    console.error("categories not found in response");
    throw new Error("categories data missing");
  }

  return categories;
};

export const fetchUserCategories = async () => {
  try {
    const secureToken = await getStoredToken(); // Retrieve the stored token
    const userData = await getStoredUser(); // Retrieve stored user data

    // Ensure you have a valid userId before making the request
    if (!userData || !userData.user_id) {
      throw new Error("User ID is missing");
    }

    const userId = userData.user_id;

    const response = await fetch(
      `${baseApiUrl}/api/v1/userCategories/getUserCategories/${userId}`, // Using template literals for URL
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secureToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      // Extract error message from response body if possible
      const errorText = await response.text();
      console.error("API Response Error:", errorText);
      throw new Error("Failed to fetch user categories");
    }

    // Assuming the API directly returns the profile data in the desired structure
    const userCategoriesData = await response.json();

    return userCategoriesData; // Return the fetched profile data
  } catch (error) {
    console.error("Failed to fetch user categories:", error);
    throw error; // Re-throw the error for handling by the caller
  }
};

export const updateUserPreference = async (preferenceData) => {
  const updatePreferenceUrl = baseApiUrl + "/api/v1/userCategories/save";
  try {
    const secureToken = await getStoredToken();

    const headers = {
      Authorization: `Bearer ${secureToken}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(updatePreferenceUrl, preferenceData, {
      headers: headers,
    });

    return response.data; // You might adjust this depending on the expected response structure
  } catch (error) {
    console.error("Updating user preference failed:", error.message);
    throw new Error(
      "Updating preference failed. Please check your data and try again."
    );
  }
};

export const deleteUserCategory = async (categoryDto) => {
  const deleteUrl = baseApiUrl + "/api/v1/userCategories/delete"; // Adjust if necessary
  try {
    const secureToken = await getStoredToken();

    const headers = {
      Authorization: `Bearer ${secureToken}`,
      "Content-Type": "application/json",
    };

    const response = await axios.delete(deleteUrl, {
      headers: headers,
      data: categoryDto, // Sending the DTO in the request body
    });

    return response.data; // Assuming the response structure fits your needs
  } catch (error) {
    console.error("Deleting user category failed:", error.message);
    throw new Error(
      "Deleting user category failed. Please check your data and try again."
    );
  }
};

export const deleteUserCategoriesBatch = async (categoryDTOs) => {
  const deleteBatchUrl = baseApiUrl + "/api/v1/userCategories/deleteBatch"; // Adjust if necessary
  try {
    const secureToken = await getStoredToken();

    const headers = {
      Authorization: `Bearer ${secureToken}`,
      "Content-Type": "application/json",
    };

    const response = await axios.delete(deleteBatchUrl, {
      headers: headers,
      data: categoryDTOs, // Sending the list of DTOs in the request body
    });

    return response.data; // Assuming the response structure fits your needs
  } catch (error) {
    console.error("Batch deleting user categories failed:", error.message);
    throw new Error(
      "Batch deleting user categories failed. Please check your data and try again."
    );
  }
};
