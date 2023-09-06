import { React, useState } from "react";
import "../styles/Card.css";

function Card({ name, onSelect, isSelected }) {
    const imageUrl = `/card_images/${name}.png`;

    const handleClick = () => {
        onSelect(); // Trigger the selection in the parent component
    };

    return (
        <div className={`card-container ${isSelected ? 'enabled' : ''}`} onClick={handleClick}>
            <div className="image"><img src={imageUrl} alt={`${name} Image`} /></div>
            <h3 className="card-title">{name}</h3>
        </div>
    );
}

export { Card };
