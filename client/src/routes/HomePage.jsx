import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";
import { HistoryTable } from "../components/HistoryTable";
import cardsHome from "/cards-home.svg";
import "../styles/HomePage.css";
import API from "../API";

function HomePage(props) {
    const navigate = useNavigate();
    const [diff, setDiff] = useState("medium");
    const [activeButton, setActiveButton] = useState(null);
    const [history, setHistory] = useState([]);
    const [botImage, setBotImage] = useState("/bot_images/bot-1.png"); 
    const user = props.user;

    useEffect(() => {
        document.title = 'Guess Who - Home';
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const handleButtonClick = (difficulty) => {
        setDiff(difficulty);
        setActiveButton(difficulty);
    };

    // Fetch history from the server
    useEffect(() => {
        if(user !== null && user !== undefined) {
            API.getHistory(user.id)
            .then((fetchedHistory) => {
                setHistory(fetchedHistory);                                 
            })
            .catch(e => {
                console.log("Error fetching history", e);
            })
        }
    }, [user]);

    // Bot image update
    useEffect(() => {
        const rand_num = Math.floor(Math.random() * 12) + 1;
        setBotImage(`/bot_images/bot-${rand_num}.png`);
    }, []);

    return (
    <Container className="main-container background">
        <Row className="logo-container">
            <img src={cardsHome} alt="Cards home" />
        </Row>
        <Row className="m-3">
            <h1 className="title">New Match</h1>
        </Row>
        <Row className="m-3">
            <h3 className="subtitle">Start a new match and challenge your skills!</h3>
        </Row>
        <Row className="m-3">
            <h2 className="subtitle">Difficulty</h2>
        </Row>
        <Row className="m-3">
            <Col className="mx-4">
                <button
                    className={`easy-button ${activeButton === "easy" ? "active" : ""}`}
                    onClick={() => handleButtonClick("easy")}
                >
                    Easy
                </button>
            </Col> 
            <Col className="mx-4">
                <button
                    className={`medium-button ${
                    activeButton === "medium" ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick("medium")}
                >
                    Medium
                </button>
            </Col>
            <Col className="mx-4">
                <button
                    className={`hard-button ${activeButton === "hard" ? "active" : ""}`}
                    onClick={() => handleButtonClick("hard")}
                >
                    Hard
                </button>
            </Col>
        </Row>
        <Row className="m-3">
            <button className="start-button" onClick={() => navigate(`/game/${diff}`)}>Start Game</button>
        </Row>
        <Row className="m-3">
            <img src="/divider.svg" alt="Divider" className="divider" />
        </Row>
        <Row className="m-3">
            <h1 className="title"> Personal History </h1>
        </Row>
        <Row>
            <img src={botImage} className="bot-image" style={{maxWidth:"200px", maxHeight:"200px"}} />
        </Row>
        <Row className="m-3">
            <HistoryTable history={history} limit="5" />
        </Row>
        <Row>
            <h3 className="subtitle">To see more click on the button below!</h3>
        </Row>
        <Row className="m-3">
            <button className="history-button" onClick={() => navigate("/history")}>History</button>
        </Row>
        <Row className="m-5">
        </Row>
    </Container>
    );
}

export { HomePage };
