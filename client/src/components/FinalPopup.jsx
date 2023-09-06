import React from "react";
import { Modal } from "react-bootstrap";
import "../styles/FinalPopup.css";

function FinalPopup({ show, handleClose, score }) {
  const resultText = score === 0 ? "You Lose" : "You Won";

  return (
    <Modal show={show} onHide={handleClose}>
      <div className="final-popup">
        <Modal.Header closeButton>
          <Modal.Title className="title">Game Over - {resultText}  </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="subtitle">Your final score: {score}</p>
        </Modal.Body>
        <Modal.Footer>
          <button variant="secondary" onClick={handleClose} className="guess-button">
            Return Home
          </button>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export { FinalPopup };
