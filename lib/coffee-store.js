import axios from "axios";
const key = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
import { createApi } from "unsplash-js";

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latLong) => {
  return `https://api.geoapify.com/v2/places?categories=catering.restaurant&filter=circle:${latLong},5000&bias=proximity:${latLong}&limit=6&apiKey=${key}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "restaurant",
    perPage: 30,
  });
  const unsplashResults = photos.response?.results || [];
  return unsplashResults.map((result) => result.urls["small"]);
};

export async function fetchCoffeeStores(latLong = "32.9012564,24.1000146") {
  const photos = await getListOfCoffeeStorePhotos();

  const config = {
    method: "get",
    headers: {},
  };
  const response = await axios(getUrlForCoffeeStores(latLong), config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  return response.features.map((result, idx) => {
    return {
      id: result.properties.place_id.slice(10, 20),
      address: result.properties.street,
      neighborhood: result.properties.formatted,
      imgUrl: photos[idx].length > 0 ? photos[idx] : null,
      name: result?.properties?.name || "Untitled",
    };
  });
}
