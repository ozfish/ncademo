import React from "react";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <nav>
      <a href="#burger">
        <img src="./burger-icon.png" alt="burger" />
      </a>
      <a href="#cloud">
        <img src="./cloud-icon.png" alt="cloud" />
      </a>
      <a href="#settings">
        <img src="./settings-icon.png" alt="settings" />
      </a>
      <a href="#chart">
        <img src="./chart-icon.png" alt="chart" />
      </a>
    </nav>
  );
};

export default Sidebar;
