import { getStoredToken } from "../../api/ApiCall";
import { baseApiUrl } from "../../api/Config";
import axios from "axios";
const AddFavorite = async (itemId,changeTepFav) => {

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
  

    } catch (error) {
      changeTepFav(true)

      console.error("Failed to remove favorite:", error);
    }
  };
  export default AddFavorite