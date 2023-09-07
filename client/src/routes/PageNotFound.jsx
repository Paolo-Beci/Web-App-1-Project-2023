import { React } from "react";
import { Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <Container>
      <Row>
        <h1>Not found!</h1>
        <p>
          ops, the page you requested, does not exist...
        </p>
        <button className="guess-button" onClick={() => navigate("/")}>
          Back Home!
        </button>
      </Row>
    </Container>
  );
}

export { PageNotFound };