import { getStoredToken } from "../../api/ApiCall";
import { baseApiUrl } from "../../api/Config";
import axios from "axios";
const addToFav = async (itemId,changeTepFav) => {

    try {
      const secureToken = await getStoredToken();

      const headers = {
        Authorization: `Bearer ${secureToken}`,
      };

      await axios.delete(baseApiUrl + "/api/v1/favorites", {
        data: { businessId: itemId },
        headers,
      });

      // setFavorites((prevFavorites) => ({
      //   ...prevFavorites,
      //   [itemId]: false,
      // }));
      changeTepFav(false)
      console.log("function remove")

    } catch (error) {
      changeTepFav(true)

      console.error("Failed to remove favorite:", error);
    }
  };
  export default addToFav