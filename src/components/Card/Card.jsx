import React from "react";
import "./Card.css";

const Card = ({ children, disabled }) => {
  return <div className={`card-container ${disabled ? "disaled-card" : ""}`}>{children}</div>;
};

export default Card;
