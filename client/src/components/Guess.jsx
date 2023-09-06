import { React, useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import "../styles/Guess.css";
import API from "../API";

function Guess({ type, onGuess, isCorrect }) {
    const [values, setValues] = useState([]);
    const [title, setTitle] = useState("");
    const [activeButton, setActiveButton] = useState("");

    useEffect(() => {
        async function fetchData() {
          const values = await API.getValues(type);
          setValues(values);
        }
      
        fetchData();

        // Update the title based on the type
        switch (type) {
            case "hair":
                setTitle("The color of the hair is ....?");
                break;
            case "eyes":
                setTitle("The color of the eyes is ....?");
                break;
            case "mustache":
                setTitle("Has a mustache?");
                break;
            case "nose":
                setTitle("The type of nose is ....?");
                break;
            case "eyebrows":
                setTitle("The eyebrows style is ....?");
                break;
            case "hair_style":
                setTitle("The hair style is ....?");
                break;
            case "glasses":
                setTitle("Does he/she wear glasses?");
                break;
            case "hat":
                setTitle("Does he/she wear a hat?");
                break;
            case "gender":
                setTitle("The gender is ....?");
                break;
            case "beard":
                setTitle("Has a beard?");
                break;
            case "age":
                setTitle("The age is ....?");
                break;
            case "skin_color":
                setTitle("The color of the skin is ....?");
                break;
            default:
                setTitle("Unknown");
        }
    }, []);

    const handleButtonClick = (choice) => {
        setActiveButton(choice);
        onGuess(type, choice); // Call onGuess with type and selected value
    };

    return (
        <Container className={`guess-container ${isCorrect !== null ? (isCorrect ? "correct" : "incorrect") : ""}`}>
            <Row className="m-3">
                <h3 className="subtitle">{title}</h3>
            </Row>
            <Row>
                {values.map((value, id) => (
                <Col key={id} className="choice-table-column">
                    <button
                    className={`choice-button ${activeButton === value ? "active" : ""}`}
                    onClick={() => handleButtonClick(value)}
                    >
                    {value}
                    </button>
                </Col>
                ))}
            </Row>
        </Container>
    );
}

export { Guess };
