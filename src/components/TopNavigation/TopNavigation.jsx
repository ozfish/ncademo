import React from "react";
import "./TopNavigation.css";

const TopNavigation = (props) => {
  return <div className="top-navigation">
    <div className="flex justify-between wrap-mobile">
      <div className="flex">
        <span>Hi, {props.username}! You have {props.daysLeft} Days Left In Your Trial. </span>
        <button className="btn green">Manage Subscription</button>
      </div>
      <div className="flex">
        <img src="./user-icon.png" alt="user icon" />
        <span>{props.username}</span>
        <img src="./polygon-icon.png" alt="img" className="my-auto"/>
        <span className="pipe">|</span>
        <span>Help</span>
      </div>
    </div>
  </div>
}

export default TopNavigation;
