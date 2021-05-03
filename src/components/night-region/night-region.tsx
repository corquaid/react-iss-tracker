import { useState } from "react";
import {
    computeLatitude,
    getEclipticObliquity,
    getGMST,
    getHourAngle,
    getJulianDate,
    getSunEclipticPosition,
    getSunEquatorialPosition,
} from "../utils";
import { Polygon } from "react-leaflet";
import useInterval from "use-interval";

export const NightRegion = (props: any) => {
    const [positions, setPositions] = useState([]);

    const getNightRegionPositions: any = (specificDate: any) => {
        const date = specificDate || new Date();
        const julianDate = getJulianDate(date);
        const gst = getGMST(julianDate);
        const latLng = [];
        const sunEclPos = getSunEclipticPosition(julianDate);
        const eclObliq = getEclipticObliquity(julianDate);
        const sunEqPos = getSunEquatorialPosition(sunEclPos.lambda, eclObliq);
        const sunEqPosValue = sunEqPos.delta < 0 ? 90 : -90;
        for (let i = 0; i <= 1440; i++) {
            const lng = -360 + i / 2;
            const ha = getHourAngle(lng, sunEqPos, gst);
            latLng[i + 1] = [computeLatitude(ha, sunEqPos), lng];
        }

        latLng[0] = [sunEqPosValue, -360];
        latLng[latLng.length] = [sunEqPosValue, 360];

        return latLng;
    };

    useInterval(async () => {
        const nightRegionPositions = getNightRegionPositions();
        setPositions(nightRegionPositions);
    }, 1000);

    return <Polygon positions={positions} {...props} />;
};
