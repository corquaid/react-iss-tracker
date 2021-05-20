import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/header/header.tsx";
import Footer from "./components/footer/footer";
import useInterval from "use-interval";
import L from "leaflet";
import { MapContainer, useMap, TileLayer, Marker, ZoomControl, Popup, Circle, useMapEvent } from "react-leaflet";
// @ts-ignore
import { NightRegion } from "./components/night-region/night-region";
import horizonCircle from "../src/Images/PinClipart.com_pete-the-cat-buttons_1571732.png";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";

// API urls
const orbitalDataUrl = "https://api.wheretheiss.at/v1/satellites/25544";
const spacecraftUrl = "https://corquaid.github.io/international-space-station-APIs/JSON/iss-docked-spacecraft.json";
const peopleUrl = "https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json";

// ISS icon
const issIcon = L.icon({
    iconUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/International_Space_Station_%28Expedition_58_Patch%29.svg/500px-International_Space_Station_%28Expedition_58_Patch%29.svg.png",
    iconSize: [70, 50],
});

// Sun position icon
const sunIcon = L.icon({
    iconUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Sun_wearing_sunglasses.svg/1024px-Sun_wearing_sunglasses.svg.png",
    iconSize: [60, 60],
});

const mapBounds = [
    [-90, -180],
    [90, 180],
];

// Styled components for Popover component
const useStyles = makeStyles(theme => ({
    popover: {
        pointerEvents: "none",
    },
    paper: {
        padding: theme.spacing(1),
    },
    body1: {
        height: "20px",
        fontFamily: "space grotesk, Arial, sans-serif",
        fontSize: "14px",
        lineHeight: "5px",
        padding: "5px",
        marginTop: "0px",
    },
}));

// Child component of MapContainer to centre map on ISS position on first load
const FirstCenter = props => {
    const { issLat, issLong, firstCall } = props;
    const map = useMap();
    if (firstCall) {
        map.flyTo([issLat, issLong]);
    }
    return null;
};

const App = () => {
    // Declare state variables
    const [issLat, setIssLat] = useState(0);
    const [issLong, setIssLong] = useState(0);
    const [issVel, setIssVel] = useState(0);
    const [issAlt, setIssAlt] = useState(0);
    const [solarLat, setSolarLat] = useState(0);
    const [solarLong, setSolarLong] = useState(0);
    const [visibility, setVisibility] = useState(null);
    const [firstCall, setFirstCall] = useState(true);
    const [crew, setCrew] = useState([]);
    const [spacecraft, setSpacecraft] = useState([]);
    const [expedition, setExpedition] = useState("");
    const [patchURL, setPatchURL] = useState("");
    const [expeditionURL, setExpeditionURL] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [openedSpacecraftPopoverId, setOpenedSpacecraftPopoverId] = useState(null);
    const [openedCrewPopoverId, setOpenedCrewPopoverId] = useState(null);
    const [currentEpoch, setCurrentEpoch] = useState(0);

    // const { classes } = props;

    // Main setInterval API call function for ISS position data
    useInterval(async () => {
        const response = await fetch(orbitalDataUrl);
        const data = await response.json();
        const { latitude, longitude, velocity, altitude, solar_lat, solar_lon, visibility } = data;
        // console.log(altitude);

        // Set new state values
        setTimeout(() => {
            setFirstCall(false);
        }, 1);
        setIssLat(latitude);
        setIssLong(longitude);
        setIssVel(velocity);
        setIssAlt(altitude);
        setVisibility(visibility);
        setSolarLat(solar_lat);
        // Conditional statement to account for different scales on ISS and solar longitude values
        if (solar_lon > 180) {
            setSolarLong(solar_lon - 360);
        } else {
            setSolarLong(solar_lon);
        }
    }, 3000);

    // API call for static spacecraft and crew data
    useEffect(() => {
        const spacecraftDataCall = async () => {
            const response = await fetch(spacecraftUrl);
            const data = await response.json();
            setSpacecraft(data.spacecraft);
            // console.log(data.spacecraft);

            // Get time since epoch on page load or "Days In Space" calculations
            const timeNowSecs = Math.floor(new Date().getTime() / 1000);
            setCurrentEpoch(timeNowSecs);
            // console.log(timeNowSecs)
        };

        const crewDataCall = async () => {
            const response = await fetch(peopleUrl);
            const data = await response.json();

            setCrew(data.people);
            setExpedition(data.iss_expedition);
            setPatchURL(data.expedition_patch);
            setExpeditionURL(data.expedition_url);
            // console.log(data.people)
        };

        spacecraftDataCall();
        crewDataCall();
    }, []);

    // Handler functions and variables for Crew Popovers
    const handleCrewPopoverOpen = (e, popoverId) => {
        setAnchorEl(e.target);
        setOpenedCrewPopoverId(popoverId);
    };

    const handleCrewPopoverClose = () => {
        setAnchorEl(null);
        setOpenedCrewPopoverId(null);
    };

    // Handler functions and variables for Spacecraft Popovers
    const handleSpacecraftPopoverOpen = (e, popoverId) => {
        setAnchorEl(e.target);
        setOpenedSpacecraftPopoverId(popoverId);
    };

    const handleSpacecraftPopoverClose = () => {
        setAnchorEl(null);
        setOpenedSpacecraftPopoverId(null);
    };
    const open = Boolean(anchorEl);
    const classes = useStyles(); // calls

    // Function to recentre map on click
    const FindIss = () => {
        const map = useMapEvent("click", () => {
            map.flyTo([issLat, issLong], 3);
        });
        return null;
    };

    const seoTestData = {
        title: "ISS Tracker | @corquaid",
        description:
            "Track the International Space Station and see the spacecraft and astronaut crew with this App created in React.",
    };

    return (
        <div className="app-body">
            <Helmet
                title={seoTestData.title}
                meta={[
                    {
                        name: "description",
                        content: seoTestData.description,
                    },
                ]}
            />
            <Header />
            <div className="main-content">
                <div className="side-column">
                    <div className="data-panel">
                        <h4>Orbital Data</h4>
                        {issLat > 0 ? (
                            <p>Latitude: {issLat.toFixed(2)} ° N</p>
                        ) : (
                            <p>Latitude: {(issLat * -1).toFixed(2)} ° S</p>
                        )}
                        {issLong > 0 ? (
                            <p>Longitude: {issLong.toFixed(2)} ° E</p>
                        ) : (
                            <p>Longitude: {(issLong * -1).toFixed(2)} ° W</p>
                        )}
                        <p>Velocity: {issVel.toFixed(2)} km/h</p>
                        <p>Altitude: {issAlt.toFixed(2)} km</p>
                        <p className="visibility">ISS Visibility: {visibility}</p>
                        <div className="horizon-container">
                            <img src={horizonCircle} alt="horizon indicator"></img>
                            <p>ISS Horizon</p>
                        </div>
                    </div>
                    <p className="find-ISS">Click anywhere on the map to find the ISS</p>
                    <div className="data-panel">
                        <h4>Spacecraft @ ISS</h4>
                        <ul>
                            {spacecraft.map(ship => (
                                <li key={ship.id}>
                                    <Typography
                                        classes={{ body1: classes.body1 }}
                                        aria-owns={open ? "mouse-over-popover" : undefined}
                                        aria-haspopup="true"
                                        onMouseEnter={e => handleSpacecraftPopoverOpen(e, ship.id)}
                                        onMouseLeave={handleSpacecraftPopoverClose}
                                    >
                                        <div className="ship-container">
                                            <a href={ship.url} key={ship.id} target="blank">
                                                {ship.name}
                                            </a>
                                            <img
                                                className="small-flag"
                                                src={`https://flagcdn.com/w20/${ship.flag_code}.png`}
                                                alt="spacecraft flag"
                                            ></img>
                                        </div>
                                    </Typography>
                                    <Popover
                                        id="mouse-over-popover"
                                        className={classes.popover}
                                        classes={{
                                            paper: classes.paper,
                                        }}
                                        open={openedSpacecraftPopoverId === ship.id}
                                        anchorEl={anchorEl}
                                        // anchorPosition={{ top: 500, left: 200 }}
                                        anchorOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        transformOrigin={{
                                            vertical: "bottom",
                                            horizontal: "left",
                                        }}
                                        onClose={handleSpacecraftPopoverClose}
                                        disableRestoreFocus
                                    >
                                        <Typography>
                                            <div className="popover-body">
                                                {ship.mission_patch ? (
                                                    <img
                                                        className="popover-img"
                                                        src={ship.mission_patch}
                                                        alt="mission patch"
                                                    ></img>
                                                ) : (
                                                    <img
                                                        className="popover-img"
                                                        src={ship.image}
                                                        alt="spacecraft"
                                                    ></img>
                                                )}
                                                <div className="popover-info">
                                                    <p className="popover-p">
                                                        <strong>Name: </strong>
                                                        {ship.name}
                                                    </p>
                                                    <p className="popover-p">
                                                        <strong>Mission: </strong>
                                                        {ship.mission_type}
                                                    </p>
                                                    <p className="popover-p">
                                                        <strong>Operator: </strong>
                                                        {ship.operator}
                                                    </p>
                                                    <p className="popover-p">
                                                        <strong>Launch Vehicle: </strong>
                                                        {ship.launch_vehicle}
                                                    </p>
                                                    <p className="popover-p">
                                                        <strong>Time In Space: </strong>
                                                        {((currentEpoch - ship.launched) / 86400).toFixed(0)} days
                                                    </p>
                                                </div>
                                            </div>
                                        </Typography>
                                    </Popover>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <MapContainer
                    bounds={mapBounds}
                    className="map-container"
                    center={[issLat, issLong]}
                    zoom={2}
                    scrollWheelZoom={true}
                    worldCopyJump={true}
                    maxBoundsViscosity={1}
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                        url="https://api.maptiler.com/maps/outdoor/{z}/{x}/{y}.png?key=I5jJIO0gVFZgkPhGgi1t"
                    />
                    <FirstCenter issLat={issLat} issLong={issLong} firstCall={firstCall} />
                    <ZoomControl position="bottomleft" />
                    <FindIss />
                    <NightRegion fillColor="#00" fillOpacity="0.6" color="#00" worldCopyJump={true} />
                    <Marker position={[issLat, issLong]} icon={issIcon}>
                        <Popup>
                            <p>ISS location</p>
                        </Popup>
                    </Marker>
                    <Marker position={[solarLat, solarLong]} icon={sunIcon}>
                        <Popup>
                            <p>Sun location</p>
                        </Popup>
                    </Marker>
                    <Circle
                        center={[issLat, issLong]}
                        radius={2300000}
                        color={"#00DD00"}
                        fillColor={"#00DD00"}
                        opacity={0.2}
                        title={"ISS visible horizon"}
                    />
                </MapContainer>
                <div className="side-column">
                    <div className="crew-panel">
                        <h4>ISS Crew</h4>
                        <a className="expedition-p" href={expeditionURL} target="blank">
                            Expedition {expedition}
                        </a>
                        <ul>
                            {crew.map(person => (
                                <li key={person.id}>
                                    <Typography
                                        classes={{ body1: classes.body1 }}
                                        aria-owns={open ? "mouse-over-popover" : undefined}
                                        aria-haspopup="true"
                                        onMouseEnter={e => handleCrewPopoverOpen(e, person.id)}
                                        onMouseLeave={handleCrewPopoverClose}
                                    >
                                        <div className="ship-container">
                                            <a href={person.url} target="blank">
                                                {person.name}
                                            </a>

                                            {person.position === "Commander" && <p className="commander-p">*</p>}
                                            <img
                                                className="small-flag-crew"
                                                src={`https://flagcdn.com/w20/${person.flag_code}.png`}
                                                alt="spacecraft flag"
                                            ></img>
                                        </div>
                                    </Typography>
                                    <Popover
                                        id="mouse-over-popover"
                                        className={classes.popover}
                                        classes={{
                                            paper: classes.paper,
                                        }}
                                        open={openedCrewPopoverId === person.id}
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                            vertical: "top",
                                            horizontal: "left",
                                        }}
                                        transformOrigin={{
                                            vertical: "bottom",
                                            horizontal: "right",
                                        }}
                                        onClose={handleCrewPopoverClose}
                                        disableRestoreFocus
                                    >
                                        <Typography>
                                            <div className="popover-body">
                                                <img
                                                    className="popover-img"
                                                    src={person.image}
                                                    alt="astronaut portrait"
                                                ></img>
                                                <div className="popover-info">
                                                    <p className="popover-p">
                                                        <strong>Name: </strong>
                                                        {person.name}
                                                    </p>
                                                    <p className="popover-p">
                                                        <strong>Nationality: </strong>
                                                        {person.country}
                                                    </p>
                                                    <p className="popover-p">
                                                        <strong>Agency: </strong>
                                                        {person.agency}
                                                    </p>
                                                    <p className="popover-p">
                                                        <strong>Position: </strong>
                                                        {person.position}
                                                    </p>
                                                    <p className="popover-p">
                                                        <strong>Spacecraft: </strong>
                                                        {person.spacecraft}
                                                    </p>
                                                    <p className="popover-p">
                                                        <strong>Career in Space: </strong>
                                                        {(
                                                            (currentEpoch - person.launched) / 86400 +
                                                            person.days_in_space
                                                        ).toFixed(0)}{" "}
                                                        days
                                                    </p>
                                                </div>
                                            </div>
                                        </Typography>
                                    </Popover>
                                </li>
                            ))}
                        </ul>
                        <p className="commander-p">* commander</p>
                        {/* <a className="expedition-p" href={expeditionURL} target="blank">
                            Expedition {expedition}
                        </a> */}
                        <img
                            className="expedition-patch"
                            src={patchURL}
                            alt="current ISS expedition mission patch"
                        ></img>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default App;
