import React from "react";
import "./header.scss";
import iss_stencil from "../../Images/International_Space_Station_white.svg.png";

const Header = () => (
    <div className="header">
        <h1>International Space Station Tracker</h1>
        <img src={iss_stencil} alt="white iss stencil"></img>
    </div>
);

export default Header;
