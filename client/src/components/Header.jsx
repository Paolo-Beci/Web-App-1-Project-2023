import { React, useState, useEffect } from "react";
import { Container, Navbar } from 'react-bootstrap';
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserSecret } from "react-icons/fa";
import "../styles/Header.css";

function Header(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [userName, setUserName] = useState("Login");

    const isRoot = location.pathname === "/";

    useEffect(() => {
        if(props.loggedIn == true) {
            if(props.name != null)
                setUserName(props.name);
        } else {
            setUserName("Login");
        }
    }, [props.loggedIn]);

    return (
        <Container className="header-container">
            <title>Guess Who</title>
            <Navbar variant="dark" >
                {/* Conditionally render based on if we are in home or not */}
                {isRoot ? (
                    <Container>
                        <Navbar.Brand></Navbar.Brand>
                        <Navbar.Text>
                            <button className="login-button" onClick={() => navigate("/login")}>
                                <FaUserSecret className="login-icon" /> {userName}
                            </button>
                        </Navbar.Text>
                    </Container>
                ) : (
                    <Container>
                        <Navbar.Brand onClick={() => navigate("/")}>
                            <img
                                src="../../public/logo-no-icon.png"
                                alt="Logo"
                                className="logo-navbar"
                            />
                        </Navbar.Brand>
                        <Navbar.Text></Navbar.Text>
                    </Container>
                )}
            </Navbar>
        </Container>
    );
}

export { Header };
