import axios from "axios";
const key = process.env.NEXT_PUBLIC_GOODLE_API_KEY;
import { createApi } from "unsplash-js";

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latLong, radius, type, key) => {
  return `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latLong}&radius=${radius}&type=${type}&keyword=cruise&key=${key}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "restaurant",
    perPage: 30,
  });
  const unsplashResults = photos.response?.results || [];
  return unsplashResults.map((result) => result.urls["small"]);
};

export async function fetchCoffeeStores(latLong = "-33.8670522%2C151.1957362") {
  const photos = await getListOfCoffeeStorePhotos();

  const config = {
    method: "get",
    // url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522%2C151.1957362&radius=310&type=restaurant&keyword=cruise&key=AIzaSyDrkGbo8W8P7XwpJ45ZwRU--uFrckGtxqQ",
    headers: {
      Accept: "application/json, text/plain, */*",
    },
  };
  const response = await axios(
    getUrlForCoffeeStores(latLong, 5000, "restaurant", key),
    config
  )
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      console.log("AXIOS", error.response);
    });

  return response.results.map((result, idx) => {
    return {
      id: result.place_id,
      location: result.plus_code.compound_code.slice(8),
      neighborhood: result.vicinity,
      imgUrl: photos[idx].length > 0 ? photos[idx] : null,
      rating: result.rating,
      name: result.name,
    };
  });
}
