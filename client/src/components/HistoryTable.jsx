import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import dayjs from "dayjs";
import "../styles/HistoryTable.css";

function HistoryTable({ history, limit }) {
  // If there is no history data, display a message
  if (!history || history.length === 0) {
    return <p>No history data available...😔 Log in and start playing!</p>;
  }

  const entriesToDisplay = limit !== null ? history.slice(0, limit) : history;

  return (
    <Container className="history-container">
      <Row className="history-row">
        <Col className="col-purple history-col">
          <h2 className="title">Date</h2>
        </Col>
        <Col className="col-blue history-col">
          <h2 className="title">Difficulty</h2>
        </Col>
        <Col className="col-red history-col">
          <h2 className="title">Secret Item</h2>
        </Col>
        <Col className="col-fucsia history-col">
          <h2 className="title">Score</h2>
        </Col>
      </Row>
      {entriesToDisplay.map((entry, index) => (
        <Row key={index} className="history-row">
          <Col className="col-purple history-col">
            <p className="subtitle">{dayjs(entry.date).format("YYYY-MM-DD")}</p>
          </Col>
          <Col className="col-blue history-col">
            <p className="subtitle">{entry.difficulty}</p>
          </Col>
          <Col className="col-red history-col">
            <p className="subtitle">{entry.secretItem}</p>
          </Col>
          <Col className="col-fucsia history-col">
            <p className="subtitle">{entry.score}</p>
          </Col>
        </Row>
      ))}
    </Container>
  );
}

export { HistoryTable };