import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/header/header.tsx";
import { Button } from "@material-ui/core";

import useInterval from "use-interval";
import { map } from "leaflet";
import { MapContainer, useMap } from "react-leaflet";

// API urls
const orbitalDataUrl = "https://api.wheretheiss.at/v1/satellites/25544";
const spacecraftUrl = "https://corquaid.github.io/international-space-station-APIs/JSON/iss-docked-spacecraft.json";
const peopleUrl = "https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json";

const SetView = (props, e) => {
    // e.preventDefault();
    const map = useMap();
    map.setView([props.issLat, props.issLong]);
    // console.log("setView Clicked!");
};

const App = () => {
    // Declare state variables
    const [issLat, setIssLat] = useState(0);
    const [issLong, setIssLong] = useState(0);
    const [issVel, setIssVel] = useState(null);
    const [issAlt, setIssAlt] = useState(null);
    const [solarLat, setSolarLat] = useState(null);
    const [solarLong, setSolarLong] = useState(null);
    const [visibility, setVisibility] = useState(null);

    // useInterval(async () => {
    //     const response = await fetch(orbitalDataUrl);
    //     const data = await response.json();
    //     const { latitude, longitude, velocity, altitude, solar_lat, solar_lon, visibility } = data;
    //     console.log(velocity);

    //     // Set new state values
    //     setIssLat(latitude);
    //     setIssLong(longitude);
    //     setIssVel(velocity);
    //     setIssAlt(altitude);
    //     setVisibility(visibility);
    //     setSolarLat(solar_lat);
    //     setSolarLong(solar_lon);
    // }, 2000);

    // Initial marker position
    //  const position: [any, any] = [issLat, issLong];

    return (
        <div className="app-body">
            <Header />
            <div className="main-content">
                <div className="side-column">
                    <div className="data-panel">
                        <h4>Orbital Data</h4>
                            
                    </div>
                    <Button className="button" variant="contained" color="primary">
                        FIND THE ISS
                    </Button>
                    <div className="data-panel"></div>
                </div>
                <MapContainer
                    className="map-container"
                    // center={issPosition}
                    zoom={1.5}
                    scrollWheelZoom={true}
                    worldCopyJump={true}
                    maxBoundsViscosity={1}
                    zoomControl={false}
                >

                </MapContainer>

                <div className="side-column">
                <div className="astro-panel"></div>
                </div>
            </div>
        </div>
    );
};

export default App;
