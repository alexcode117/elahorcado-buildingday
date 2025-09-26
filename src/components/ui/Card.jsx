import React from "react";
import "./Card.css";

const Card = ({ children, className = "", variant = "default" }) => {
  return (
    <div className={`card ${variant} ${className}`.trim()}>{children}</div>
  );
};

export default Card;
