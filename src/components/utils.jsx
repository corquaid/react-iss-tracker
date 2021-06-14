import L from "leaflet";

// NightRegion util functions
export const getJulianDate = date => (date / 86400000) + 2440587.5;
export const daysSinceJ2000 = date => date - 2451545.0;

export const getGMST = julianDate => {
  const days = daysSinceJ2000(julianDate);

  return (18.697374558 + 24.06570982441908 * days) % 24;
}

export const getSunEclipticPosition = julianDate => {
  const days = daysSinceJ2000(julianDate);
  let solarLongitude = 280.460 + 0.9856474 * days;
  let anomalyOfTheSun = 357.528 + 0.9856003 * days;

  solarLongitude %= 360;
  anomalyOfTheSun %= 360;

  // ecliptic longitude of Sun
  const lambda = solarLongitude + 1.915 * Math.sin(anomalyOfTheSun * Math.PI / 180) + 0.02 * Math.sin(2 * anomalyOfTheSun * Math.PI / 180);
  // distance from Sun in AU
  const distanceFromSun = 1.00014 - 0.01671 * Math.cos(anomalyOfTheSun * Math.PI / 180) - 0.0014 * Math.cos(2 * anomalyOfTheSun * Math.PI / 180);

  return { lambda, distanceFromSun };
}

export const getEclipticObliquity = julianDate => {
  const days = daysSinceJ2000(julianDate);

  // Julian centuries since J2000.0
  const T = days / 36525;
  const epsilon = 23.43929111 -
    T * (46.836769 / 3600
      - T * (0.0001831 / 3600
        + T * (0.00200340 / 3600
          - T * (0.576e-6 / 3600
            - T * 4.34e-8 / 3600))));
  return epsilon;
}

export const getSunEquatorialPosition = (sunEclLng, eclObliq) => {
  let alpha = Math.atan(Math.cos(eclObliq * Math.PI / 180)
    * Math.tan(sunEclLng * Math.PI / 180)) * 180 / Math.PI;;
  const delta = Math.asin(Math.sin(eclObliq * Math.PI / 180)
    * Math.sin(sunEclLng * Math.PI / 180)) * 180 / Math.PI;;

  const lQuadrant = Math.floor(sunEclLng / 90) * 90;
  const raQuadrant = Math.floor(alpha / 90) * 90;
  alpha = alpha + (lQuadrant - raQuadrant);

  return { alpha, delta };
}

export const getHourAngle = (lng, sunPos, gst) => {
  const lst = gst + lng / 15;
  return lst * 15 - sunPos.alpha;
}

export const computeLatitude = (ha, sunPos) => {
  const lat = Math.atan(-Math.cos(ha * Math.PI / 180) /
    Math.tan(sunPos.delta * Math.PI / 180)) * 180 / Math.PI;;
  return lat;
}

export const seoTestData = {
  title: "ISS Tracker | @corquaid",
  description:
      "Track the International Space Station and see the spacecraft and astronaut crew with this App created in React.",
};

export const issIcon = L.icon({
  iconUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/International_Space_Station_%28Expedition_58_Patch%29.svg/500px-International_Space_Station_%28Expedition_58_Patch%29.svg.png",
  iconSize: [70, 50],
});

export const sunIcon = L.icon({
  iconUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Sun_wearing_sunglasses.svg/1024px-Sun_wearing_sunglasses.svg.png",
  iconSize: [60, 60],
});

export const apiUrls = {
  orbitalDataUrl: "https://api.wheretheiss.at/v1/satellites/25544",
  spacecraftUrl: "https://corquaid.github.io/international-space-station-APIs/JSON/iss-docked-spacecraft.json",
  peopleUrl: "https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json"
}

export const timeNowSecs = Math.floor(new Date().getTime() / 1000);