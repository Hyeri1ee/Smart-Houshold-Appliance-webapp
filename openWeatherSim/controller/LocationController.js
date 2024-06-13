import {locations, locationUUIDMap, solarUUIDMap} from "../db/FakeDatabase.js";

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
  locationUUIDMap.set(UUID, locationUUIDMap.size);

  locations[locationUUIDMap.get(UUID)] = {
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

export const handleSolarPanelCreation = (req, res) => {
  if (!req.query.appid) {
    return res
      .status(400)
      .json({
        error: 'appid is missing from query!',
      });
  }

  if (!req.params.location_id) {
    return res
      .status(400)
      .json({
        error: 'location_id is missing from query!',
      });
  }

  if (!locations[locationUUIDMap.get(req.params.location_id)]) {
    return res
      .status(400)
      .json({
        error: 'location_id does not exist! Please remember everything is reset after a restart of the mock server!',
      });
  }

  if (!req.body.type || !["mono-si", "poly-si", "tf-as", "cdte"].includes(req.body.type)) {
    return res.status(400).json({error: "Invalid PV technology type used in solar panel."});
  }

  if (!req.body.area || req.body.area <= 0) {
    return res.status(400).json({error: "Solar panel area must be specified and must be greater than 0."});
  }

  if (!req.body.tilt || req.body.tilt < 0 || req.body.tilt > 90) {
    return res.status(400).json({error: "Panel installation tilt angle must be specified between 0 and 90 degrees."});
  }

  if (!req.body.azimuth || req.body.azimuth < 0 || req.body.azimuth >= 360) {
    return res.status(400).json({error: "Panel installation azimuth angle must be specified between 0 and 359 degrees."});
  }

  if (!req.body.peak_power || req.body.peak_power <= 0) {
    return res.status(400).json({error: "Solar panel peak power must be specified and must be greater than 0."});
  }

  const solarUUID = createUUID();
  solarUUIDMap.set(solarUUID, solarUUIDMap.size);

  locations[locationUUIDMap.get(req.params.location_id)][solarUUIDMap.get(solarUUID)] = {
    type: req.body.type,
    area: req.body.area,
    tilt: req.body.tilt,
    azimuth: req.body.azimuth,
    peak_power: req.body.peak_power,
  }

  return res
    .status(201)
    .json({
      panel_id: solarUUID,
      location_id: req.params.location_id,
      type: req.body.type,
      area: req.body.area,
      tilt: req.body.tilt,
      azimuth: req.body.azimuth,
      peak_power: req.body.peak_power,
    });
}

export const getOutputPrediction = (req, res) => {
  if (!req.query.appid) {
    return res
      .status(400)
      .json({
        error: 'appid is missing from query!',
      });
  }

  if (!req.params.location_id) {
    return res
      .status(400)
      .json({
        error: 'location_id is missing from query!',
      });
  }

  if (!req.query.date) {
    return res
      .status(400)
      .json({
        error: 'date is missing from query!',
      });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!req.query.date.match(dateRegex)) {
    return res
      .status(400)
      .json({
        error: 'date is not in format YYYY-MM-DD!'
      });
  }

  const date = new Date(`${req.query.date}T00:00:00Z`);

  let minDate = new Date('1979-01-01');
  let maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 15);

  if (date < minDate) {
    return res
      .status(400)
      .json({
        error: "Date " + date + " is not after 1979-01-01"
      });
  }

  if (date > maxDate) {
    return res
      .status(400)
      .json({
        error: "Date " + date + " is more than 15 days away!"
      });
  }

  let panels = [];
  for (let i = 0; i < locations[locationUUIDMap.get(req.params.location_id)].length; i++) {
    let innerArray = locations[locationUUIDMap.get(req.params.location_id)][i];
    if (innerArray.length > 1) {
      panels.push(innerArray[1]);
    }
  }

  res
    .status(200)
    .json({
      "location_id": req.params.location_id,
      "lat": locations[locationUUIDMap.get(req.params.location_id)].lat,
      "lon": locations[locationUUIDMap.get(req.params.location_id)].lon,
      "date": req.query.date,
      "tz": "+01:00",
      "sunrise": req.query.date+"T05:41:22",
      "sunset": req.query.date+"T19:56:06",
      "irradiance": {
        "daily": [
          {
            "clear_sky": {
              "ghi": 7738.01,
              "dni": 10286.11,
              "dhi": 1275.66
            },
            "cloudy_sky": {
              "ghi": 7695.01,
              "dni": 9659.94,
              "dhi": 1363.06
            }
          }
        ],
        "hourly": [
          {
            "hour": 0,
            "clear_sky": {
              "ghi": 0.0,
              "dni": 0.0,
              "dhi": 0.0
            },
            "cloudy_sky": {
              "ghi": 0.0,
              "dni": 0.0,
              "dhi": 0.0
            }
          },
          {
            "hour": 1,
            "clear_sky": {
              "ghi": 0.0,
              "dni": 0.0,
              "dhi": 0.0
            },
            "cloudy_sky": {
              "ghi": 0.0,
              "dni": 0.0,
              "dhi": 0.0
            }
          },
          {
            "hour": 2,
            "clear_sky": {
              "ghi": 0.0,
              "dni": 0.0,
              "dhi": 0.0
            },
            "cloudy_sky": {
              "ghi": 0.0,
              "dni": 0.0,
              "dhi": 0.0
            }
          },
          {
            "hour": 3,
            "clear_sky": {
              "ghi": 0.0,
              "dni": 0.0,
              "dhi": 0.0
            },
            "cloudy_sky": {
              "ghi": 0.0,
              "dni": 0.0,
              "dhi": 0.0
            }
          },
          {
            "hour": 4,
            "clear_sky": {
              "ghi": 0.0,
              "dni": 0.0,
              "dhi": 0.0
            },
            "cloudy_sky": {
              "ghi": 0.0,
              "dni": 0.0,
              "dhi": 0.0
            }
          },
          {
            "hour": 5,
            "clear_sky": {
              "ghi": 0.0,
              "dni": 0.0,
              "dhi": 0.0
            },
            "cloudy_sky": {
              "ghi": 0.0,
              "dni": 0.0,
              "dhi": 0.0
            }
          },
          {
            "hour": 6,
            "clear_sky": {
              "ghi": 86.4,
              "dni": 390.66,
              "dhi": 43.5
            },
            "cloudy_sky": {
              "ghi": 77.43,
              "dni": 226.55,
              "dhi": 47.13
            }
          },
          {
            "hour": 7,
            "clear_sky": {
              "ghi": 266.08,
              "dni": 634.47,
              "dhi": 71.86
            },
            "cloudy_sky": {
              "ghi": 239.15,
              "dni": 506.18,
              "dhi": 78.42
            }
          },
          {
            "hour": 8,
            "clear_sky": {
              "ghi": 457.79,
              "dni": 757.88,
              "dhi": 90.29
            },
            "cloudy_sky": {
              "ghi": 457.77,
              "dni": 750.01,
              "dhi": 87.66
            }
          },
          {
            "hour": 9,
            "clear_sky": {
              "ghi": 635.88,
              "dni": 831.13,
              "dhi": 103.17
            },
            "cloudy_sky": {
              "ghi": 635.84,
              "dni": 822.81,
              "dhi": 101.84
            }
          },
          {
            "hour": 10,
            "clear_sky": {
              "ghi": 782.37,
              "dni": 876.2,
              "dhi": 111.98
            },
            "cloudy_sky": {
              "ghi": 782.34,
              "dni": 869.32,
              "dhi": 110.03
            }
          },
          {
            "hour": 11,
            "clear_sky": {
              "ghi": 883.76,
              "dni": 902.16,
              "dhi": 117.42
            },
            "cloudy_sky": {
              "ghi": 883.74,
              "dni": 873.35,
              "dhi": 134.33
            }
          },
          {
            "hour": 12,
            "clear_sky": {
              "ghi": 931.14,
              "dni": 913.16,
              "dhi": 119.81
            },
            "cloudy_sky": {
              "ghi": 931.12,
              "dni": 873.19,
              "dhi": 147.55
            }
          },
          {
            "hour": 13,
            "clear_sky": {
              "ghi": 920.39,
              "dni": 910.73,
              "dhi": 119.27
            },
            "cloudy_sky": {
              "ghi": 920.34,
              "dni": 873.2,
              "dhi": 144.54
            }
          },
          {
            "hour": 14,
            "clear_sky": {
              "ghi": 852.42,
              "dni": 894.54,
              "dhi": 115.78
            },
            "cloudy_sky": {
              "ghi": 852.37,
              "dni": 872.57,
              "dhi": 126.4
            }
          },
          {
            "hour": 15,
            "clear_sky": {
              "ghi": 733.11,
              "dni": 862.22,
              "dhi": 109.15
            },
            "cloudy_sky": {
              "ghi": 731.35,
              "dni": 830.9,
              "dhi": 123.29
            }
          },
          {
            "hour": 16,
            "clear_sky": {
              "ghi": 573.05,
              "dni": 808.17,
              "dhi": 98.94
            },
            "cloudy_sky": {
              "ghi": 571.38,
              "dni": 804.41,
              "dhi": 92.96
            }
          },
          {
            "hour": 17,
            "clear_sky": {
              "ghi": 387.35,
              "dni": 720.06,
              "dhi": 84.24
            },
            "cloudy_sky": {
              "ghi": 385.39,
              "dni": 710.72,
              "dhi": 79.66
            }
          },
          {
            "hour": 18,
            "clear_sky": {
              "ghi": 196.09,
              "dni": 565.48,
              "dhi": 62.93
            },
            "cloudy_sky": {
              "ghi": 194.76,
              "dni": 516.5,
              "dhi": 65.89
            }
          },
          {
            "hour": 19,
            "clear_sky": {
              "ghi": 32.18,
              "dni": 219.25,
              "dhi": 27.32
            },
            "cloudy_sky": {
              "ghi": 32.03,
              "dni": 130.23,
              "dhi": 23.36
            }
          },
          {
            "hour": 20,
            "clear_sky": {
              "ghi": 0.0,
              "dni": 0.0,
              "dhi": 0.0
            },
            "cloudy_sky": {
              "ghi": 0.0,
              "dni": 0.0,
              "dhi": 0.0
            }
          },
          {
            "hour": 21,
            "clear_sky": {
              "ghi": 0.0,
              "dni": 0.0,
              "dhi": 0.0
            },
            "cloudy_sky": {
              "ghi": 0.0,
              "dni": 0.0,
              "dhi": 0.0
            }
          },
          {
            "hour": 22,
            "clear_sky": {
              "ghi": 0.0,
              "dni": 0.0,
              "dhi": 0.0
            },
            "cloudy_sky": {
              "ghi": 0.0,
              "dni": 0.0,
              "dhi": 0.0
            }
          },
          {
            "hour": 23,
            "clear_sky": {
              "ghi": 0.0,
              "dni": 0.0,
              "dhi": 0.0
            },
            "cloudy_sky": {
              "ghi": 0.0,
              "dni": 0.0,
              "dhi": 0.0
            }
          }
        ]
      },
      "panels": [
        {
          "panel_id": locations[locationUUIDMap.get(req.params.location_id)][solarUUIDMap.get(panels[0])],
          "output": {
            "daily": {
              "clear_sky": {
                "power": 13.4922
              },
              "cloudy_sky": {
                "power": 13.1875
              }
            },
            "hourly": {
              "clear_sky": [
                {
                  "hour": 0,
                  "power": 0.0
                },
                {
                  "hour": 1,
                  "power": 0.0
                },
                {
                  "hour": 2,
                  "power": 0.0
                },
                {
                  "hour": 3,
                  "power": 0.0
                },
                {
                  "hour": 4,
                  "power": 0.0
                },
                {
                  "hour": 5,
                  "power": 0.0
                },
                {
                  "hour": 6,
                  "power": 0.2537
                },
                {
                  "hour": 7,
                  "power": 0.6937
                },
                {
                  "hour": 8,
                  "power": 1.1348
                },
                {
                  "hour": 9,
                  "power": 1.507
                },
                {
                  "hour": 10,
                  "power": 1.7635
                },
                {
                  "hour": 11,
                  "power": 1.8755
                },
                {
                  "hour": 12,
                  "power": 1.8316
                },
                {
                  "hour": 13,
                  "power": 1.6378
                },
                {
                  "hour": 14,
                  "power": 1.3167
                },
                {
                  "hour": 15,
                  "power": 0.9065
                },
                {
                  "hour": 16,
                  "power": 0.4601
                },
                {
                  "hour": 17,
                  "power": 0.0926
                },
                {
                  "hour": 18,
                  "power": 0.0162
                },
                {
                  "hour": 19,
                  "power": 0.0027
                },
                {
                  "hour": 20,
                  "power": 0.0
                },
                {
                  "hour": 21,
                  "power": 0.0
                },
                {
                  "hour": 22,
                  "power": 0.0
                },
                {
                  "hour": 23,
                  "power": 0.0
                }
              ],
              "cloudy_sky": [
                {
                  "hour": 0,
                  "power": 0.0
                },
                {
                  "hour": 1,
                  "power": 0.0
                },
                {
                  "hour": 2,
                  "power": 0.0
                },
                {
                  "hour": 3,
                  "power": 0.0
                },
                {
                  "hour": 4,
                  "power": 0.0
                },
                {
                  "hour": 5,
                  "power": 0.0
                },
                {
                  "hour": 6,
                  "power": 0.1854
                },
                {
                  "hour": 7,
                  "power": 0.5894
                },
                {
                  "hour": 8,
                  "power": 1.1211
                },
                {
                  "hour": 9,
                  "power": 1.492
                },
                {
                  "hour": 10,
                  "power": 1.7483
                },
                {
                  "hour": 11,
                  "power": 1.8536
                },
                {
                  "hour": 12,
                  "power": 1.8105
                },
                {
                  "hour": 13,
                  "power": 1.6212
                },
                {
                  "hour": 14,
                  "power": 1.3054
                },
                {
                  "hour": 15,
                  "power": 0.8984
                },
                {
                  "hour": 16,
                  "power": 0.4534
                },
                {
                  "hour": 17,
                  "power": 0.0901
                },
                {
                  "hour": 18,
                  "power": 0.016
                },
                {
                  "hour": 19,
                  "power": 0.0026
                },
                {
                  "hour": 20,
                  "power": 0.0
                },
                {
                  "hour": 21,
                  "power": 0.0
                },
                {
                  "hour": 22,
                  "power": 0.0
                },
                {
                  "hour": 23,
                  "power": 0.0
                }
              ]
            }
          }
        }
      ]
    });
}