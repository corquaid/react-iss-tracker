import React from "react";
import "./map-window.scss";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
// @ts-ignore
import { NightRegion } from "react-leaflet-night-region";
// @ts-ignore
import "react-leaflet-fullscreen-control";

const mapBounds = [-90, -180];

const issIcon = L.icon({
    iconUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/International_Space_Station_%28Expedition_58_Patch%29.svg/500px-International_Space_Station_%28Expedition_58_Patch%29.svg.png",
    iconSize: [70, 50],
});

const sunIcon = L.icon({
    iconUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Sun_wearing_sunglasses.svg/1024px-Sun_wearing_sunglasses.svg.png",
    iconSize: [60, 60],
});

const MapWindow = (props: any) => {
    const { issLat, issLong, solarLat, solarLong } = props;
    const issPosition: any = [issLat, issLong];
    const sunPosition: any = [solarLat, solarLong];

    return (
        <MapContainer
            className="map-container"
            center={issPosition}
            zoom={1.5}
            scrollWheelZoom={true}
            worldCopyJump={true}
            maxBoundsViscosity={1}
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://api.maptiler.com/maps/outdoor/{z}/{x}/{y}.png?key=I5jJIO0gVFZgkPhGgi1t"
            />
            <ZoomControl position="bottomleft" />
            <NightRegion fillColor="#00" fillOpacity="0.5" color="#00" />
            <Marker position={issPosition} icon={issIcon}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            {/* <Marker position={sunPosition} icon={sunIcon}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker> */}
        </MapContainer>
    );
};

export default MapWindow;
