export const decodeLatLng = async (lat: number, long: number) => {
  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}}`
  );
  const res_1 = await res.json();
  return res_1.features[0]?.place_name as string;
};
