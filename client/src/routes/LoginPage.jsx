import { React, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import userImage from "/user-image.png";
import API from "../API";

function LoginPage(props) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState(null);

  useEffect(() => {
    document.title = "Guess Who - Login";
  }, []);

  // Function to handle login, check input fields and, ultimately, navigate to the home page
  async function handleLoginAndNavigate() {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!props.email || !password || !emailRegex.test(props.email) || password.length < 4 || password.length > 20) {
      setErrorMessage("Please insert valid email and password.");
    } else if (props.email.length < 3 || props.email.length > 20) {
      setErrorMessage("Username must be between 3 and 20 characters.");
    } else {
      const response = await handleLogin();
      if (response) {
        setErrorMessage("");
        navigate("/");
      } 
    }
  }

  // Function to handle login and refresh the user data on App.js
  const handleLogin = async () => {
    try {
      const user = await API.logIn(props.email, password);
      props.setUser(user);
      props.setEmail(user.email);
      props.setName(user.name);
      props.setLoggedIn(true);
      return true; // Return true when the login is successful
    } catch (err) {
      setErrorMessage("Login failed. Please check your credentials."); 
      return false; // Return false when the login fails
    }
  };
  
  // Function to handle logout and refresh the user data on App.js
  const handleLogout = async () => {
    try {
      await API.logOut();
      props.setLoggedIn(false);
      props.setUser(null);
      props.setEmail(null);
    } catch (err) {
      throw err;
    }
  };

  return (
    <Container>
      <Row>
        <Col>
            {!props.loggedIn && (
            <div className="login-container">
              <h2 className="title">Login</h2>
              <div>
                <h3 className="subtitle">Insert your Email and Password:</h3>
              </div>
              <div className="m-3">
                <input
                  type="email"
                  placeholder="email"
                  onChange={(e) => props.setEmail(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                />
              </div>
              {errorMessage !== "" && (<div className="error-message m-2">{errorMessage}</div>)}
            </div>
            )}
            {props.loggedIn && (
              <div className="login-container">
                <h2 className="title">{props.name}</h2>
                <div>
                  <h3 className="subtitle">You are logged in!</h3>
                </div>
                <div>
                  <img src={userImage} alt="User image" style={{maxWidth:"200px", maxHeight:"200px"}}/>
                </div>
                <div className="m-2">
                  <h3 className="subtitle">email: {props.email}</h3>
                </div>
                <div className="m-3">
                  <button className="history-button" onClick={() => navigate("/history")}>History</button>
                </div>
              </div>
            )}
            <div className="login-container">
              {!props.loggedIn && (
                <button onClick={handleLoginAndNavigate} className="guess-button m-3">
                  Login
                </button>
              )}
              {props.loggedIn && (
                <button onClick={handleLogout} className="guess-button m-3">
                  Logout
                </button>
              )}
            </div>
        </Col>
      </Row>
    </Container>
  );
}

export { LoginPage };