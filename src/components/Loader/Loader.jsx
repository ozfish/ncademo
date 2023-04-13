import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="bpui-preloader">
      <div className="bpui-preloader-overlay"></div>
      <div className="bpui-preloader-spinner">
        <span>Loading</span>
        <span>...</span>
      </div>
    </div>
  );
};

export default Loader;
