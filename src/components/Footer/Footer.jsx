import React from "react";
import "./Footer.css";

const Footer = ({ position }) => {

  return <div className="footer-container" style={position ? { position } : {}}>
    <div className="flex column">
      <span>Privacy | Terms</span>
      {/* <span>{new Date().getFullYear()} Cloud data. All Rights Reserved.</span> */}
    </div>
  </div>

};

export default Footer;
