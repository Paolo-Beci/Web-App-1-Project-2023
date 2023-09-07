import { React, useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../components/Card";
import { Guess } from "../components/Guess";
import { FinalPopup } from "../components/FinalPopup";
import "../styles/GamePage.css";
import API from "../API";

function GamePage(props) {
  const navigate = useNavigate();
  const { difficulty } = useParams();
  const [botImage, setBotImage] = useState("/bot_images/bot-1.png");
  const [cards, setCards] = useState([]);
  const [showFinalPopup, setShowFinalPopup] = useState(false);
  const [n_guesses, setGuesses] = useState(0);
  const [n_items, setItems] = useState(0);
  const [points, setPoints] = useState(0);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [correctGuesses, setCorrectGuesses] = useState({
    hair: null,
    eyes: null,
    mustache: null,
    nose: null,
    hair_style: null,
    eyebrows: null,
    glasses: null,
    hat: null,
    gender: null,
    beard: null,
    age: null,
    skin_color: null,
  });

  useEffect(() => {
    document.title = 'Guess Who - Game';
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Initial points configuration
    if (difficulty === "easy") {
      setItems(12);
      setPoints(12);
    } else if (difficulty === "medium") {
      setItems(24);
      setPoints(24);
    } else if (difficulty === "hard") {
      setItems(36);
      setPoints(36);
    } else {
      navigate("/");
    }
  }, []);

  // Fetch cards from the server
  useEffect(() => {
    async function fetchData() {
      const fetchedCards = await API.getCards(difficulty);
      setCards(fetchedCards);
      console.log("Game started!");
    }

    fetchData();
  }, []);

  // Selected card id update on console
  useEffect(() => {
    console.log("Selected card id: " + selectedCardId);
  }, [selectedCardId]);

  // Live update of the points
  useEffect(() => {
    if (points > 0)
      setPoints(n_items - n_guesses); // Deduct one point for a guess
  }, [n_guesses]);

  // Bot image update
  useEffect(() => {
    const rand_num = Math.floor(Math.random() * 12) + 1;
    setBotImage(`/bot_images/bot-${rand_num}.png`);
  }, [n_guesses]);

  // Handle of the guess button of each property, returns true if the guess is correct and updates the ui
  const handleGuessClick = async (property, value) => {
    try {
      console.log("Guess button clicked: " + property + ":" + value);
      const response = await API.getCheckProperty(property, value);
      const isCorrectGuess = response.result;
      setGuesses(n_guesses + 1); // Increment the number of guesses used

      if (isCorrectGuess) {
        console.log("Correct guess!");
        const updatedCards = cards.filter((card) => card[property] === value);
        setCards(updatedCards);

        setCorrectGuesses((prevState) => ({
          ...prevState,
          [property]: true,
        }));
      } else {
        console.log("Wrong guess!");
        const updatedCards = cards.filter((card) => card[property] !== value);
        setCards(updatedCards);

        setCorrectGuesses((prevState) => ({
          ...prevState,
          [property]: false,
        }));
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error while checking card:", error);
    }
  };

  // Handle card selection
  const handleCardSelect = (cardId) => {
    setSelectedCardId(cardId);
  };

  // Handle card deselection
  const handleCardDeselect = () => {
    setSelectedCardId(null);
  };

  // Handle of the final guess button, after this, the game is over
  const handleFinalGuessClick = async () => {
    if (selectedCardId) {
      try {
        const response = await API.getCheckCard(selectedCardId);
        setShowFinalPopup(true);

        if (props.loggedIn == true) {
          if (response.result === false) {
            setPoints(0);
            API.postHistory(difficulty, 0);
            console.log("Game Over! - Guess: " + response.result + " - Points: 0");
          } else {
            API.postHistory(difficulty, points);
            console.log("Game Over! - Guess: " + response.result + " - Points: " + points);
          }
        } else {
          if (response.result === false) {
            setPoints(0);
            console.log("Game Over! - Guess: " + response.result + " - Points: 0");
          } else {
            console.log("Game Over! - Guess: " + response.result + " - Points: " + points);
          }
        }
      } catch (error) {
        console.error("Error during final guess:", error);
      }
    }
  };

  // Final popup
  const handleCloseFinalPopup = () => {
    setShowFinalPopup(false);
    navigate("/");
  };

  return (
    <Container className="main-container">
      <Row className="m-3">
        <h1 className="title">Points</h1>
      </Row>
      <Row>
        <h3 className="title">{points}</h3>
      </Row>
      <Row className="card-table-container background">
        {cards.map((card, id) => (
          <Col key={id} className="card-table-column">
            <Card
              name={card.name}
              onSelect={() => handleCardSelect(card.id)}
              isSelected={card.id === selectedCardId}
              onDeselect={handleCardDeselect}
            />
          </Col>
        ))}
      </Row>
      <Row className="m-3">
        <button
          onClick={handleFinalGuessClick}
          className="guess-button"
          disabled={!selectedCardId}
        >
          Guess!
        </button>
      </Row>
      <Row className="m-3">
            <img src="/divider.svg" alt="Divider" className="divider" />
        </Row>
      <Row className="m-3">
        <h1 className="title">Guesses</h1>
      </Row>
      <Row>
        <h1 className="subtitle">Choose one property and the value you want to ask me!</h1>
      </Row>
      <Row>
        <img src={botImage} className="bot-image" alt="Bot" />
      </Row>
      <Row>
        <Guess type="gender" onGuess={handleGuessClick} isCorrect={correctGuesses.gender} />
        <Guess type="skin_color" onGuess={handleGuessClick} isCorrect={correctGuesses.skin_color} />
        <Guess type="hair" onGuess={handleGuessClick} isCorrect={correctGuesses.hair} />
        <Guess type="eyes" onGuess={handleGuessClick} isCorrect={correctGuesses.eyes} />
        <Guess type="beard" onGuess={handleGuessClick} isCorrect={correctGuesses.beard} />
        <Guess type="nose" onGuess={handleGuessClick} isCorrect={correctGuesses.nose} />
        <Guess type="hair_style" onGuess={handleGuessClick} isCorrect={correctGuesses.hair_style} />
        <Guess type="eyebrows" onGuess={handleGuessClick} isCorrect={correctGuesses.eyebrows} />
        <Guess type="glasses" onGuess={handleGuessClick} isCorrect={correctGuesses.glasses} />
        <Guess type="hat" onGuess={handleGuessClick} isCorrect={correctGuesses.hat} />
        <Guess type="mustache" onGuess={handleGuessClick} isCorrect={correctGuesses.mustache} />
        <Guess type="age" onGuess={handleGuessClick} isCorrect={correctGuesses.age} />
      </Row>
      <FinalPopup show={showFinalPopup} handleClose={handleCloseFinalPopup} score={points} />
    </Container>
  );
}

export { GamePage };
