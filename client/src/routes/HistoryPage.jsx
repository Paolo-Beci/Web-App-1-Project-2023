import { React, useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { HistoryTable } from "../components/HistoryTable";
import "../styles/HistoryPage.css";
import API from "../API";

function HistoryPage() {
  const navigate = useNavigate();
  const limit = null;
  const [history, setHistory] = useState([]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    document.title = 'Guess Who - History';
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Function to calculate total score
  const calculateTotalScore = (historyArray) => {
    return historyArray.reduce((total, historyEntry) => total + historyEntry.score, 0);
  };

  // Fetch history from the server
  useEffect(() => {
    API.getHistory()
      .then((fetchedHistory) => {
        setHistory(fetchedHistory);
        const totalScore = calculateTotalScore(fetchedHistory);   // Calculate the total score
        setPoints(totalScore);                                    
      })
      .catch(e => {
        console.log("Error fetching history", e);
      })
  }, []);

  return (
    <Container className="main-container">
      <Row className="m-3">
        <h1 className="title">Total Score</h1>
      </Row>
      <Row>
        <h3 className="title">{points}</h3>
      </Row>
      <Row className="m-3">
        <h1 className="title">Personal History</h1>
      </Row>
      <Row className="m-3">
        <HistoryTable  history={history} limit={limit} />
      </Row>
      <Row>
        <button className="guess-button" onClick={() => navigate("/")}>
          Back Home!
        </button>
      </Row>
    </Container>
  );
}

export { HistoryPage };