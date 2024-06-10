import {locations} from "../db/FakeDatabase.js";

// https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
const createUUID = () => {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

export const handleCreateLocation = (req, res) => {
  if (!req.query.appid) {
    return res
      .status(400)
      .json({
        error: 'appid is missing from query!',
      });
  }

  if (!req.body.type) {
    return res
      .status(400)
      .json({
        error: 'type is missing from body!',
      });
  }

  if (!req.body.coordinates) {
    return res
      .status(400)
      .json({
        error: 'coordinates are missing from body!',
      });
  }

  const coordinates = req.body.coordinates;

  if (!coordinates[0].lat) {
    return res
      .status(400)
      .json({
        error: "lat missing from body in coordinates"
      });
  }

  if (!coordinates[0].lon) {
    return res
      .status(400)
      .json({
        error: "lon missing from body in coordinates"
      });
  }

  if (isNaN(parseFloat(coordinates[0].lat)) || !isFinite(coordinates[0].lat)) {
    return res.status(400).json({ error: "Latitude must be a decimal number" });
  }

  if (isNaN(parseFloat(coordinates[0].lon)) || !isFinite(coordinates[0].lon)) {
    return res.status(400).json({ error: "Longitude must be a decimal number" });
  }

  if (parseFloat(coordinates[0].lat) < -90) {
    return res.status(400).json({ error: "Latitude must be greater than -90" });
  }

  if (parseFloat(coordinates[0].lat) > 90) {
    return res.status(400).json({ error: "Latitude must be less than 90" });
  }

  if (parseFloat(coordinates[0].lon) < -180) {
    return res.status(400).json({ error: "Longitude must be greater than -180" });
  }

  if (parseFloat(coordinates[0].lon) > 180) {
    return res.status(400).json({ error: "Longitude must be less than 180" });
  }

  const UUID = createUUID();

  locations[UUID] = {
    lat: coordinates[0].lat,
    lon: coordinates[0].lon,
  };

  res
    .status(201)
    .json({
      location_id: UUID,
      type: "point",
      coordinates: [
        {
          lat: coordinates[0].lat,
          lon: coordinates[0].lon,
        }
      ]
    })
}