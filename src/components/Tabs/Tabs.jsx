import React from "react";
import "./Tabs.css";

const Tabs = (props) => {

  return <div className="tabs">
    {
      props.data?.map(item => (
        <div key={item.value} className={`tab ${props.value === item.value ? "selected" : ""}`}>
          {item.label}
        </div>
      ))
    }
  </div>

};

export default Tabs;
