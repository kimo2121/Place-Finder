import axios from "axios";
const key = process.env.GOODLE_API_KEY;
import { createApi } from "unsplash-js";

const unsplashApi = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latLong, radius, type, key) => {
  return `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latLong}&radius=${radius}&type=${type}&keyword=cruise&key=${key}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: 30,
  });
  const unsplashResults = photos.response.results;
  return unsplashResults.map((result) => result.urls["small"]);
};

export async function fetchCoffeeStores() {
  const photos = await getListOfCoffeeStorePhotos();

  const config = {
    method: "get",
    // url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522%2C151.1957362&radius=310&type=restaurant&keyword=cruise&key=AIzaSyDrkGbo8W8P7XwpJ45ZwRU--uFrckGtxqQ",
    headers: {},
  };
  const response = await axios(
    getUrlForCoffeeStores("-33.8670522%2C151.1957362", 310, "restaurant", key),
    config
  )
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  return response.results.map((result, idx) => {
    return {
      ...result,
      imgUrl: photos[idx],
    };
  });
}
