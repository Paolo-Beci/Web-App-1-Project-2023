import { React, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PageNotFound } from "./routes/PageNotFound";
import { HomePage } from "./routes/HomePage";
import { LoginPage } from "./routes/LoginPage";
import { GamePage } from "./routes/GamePage";
import { HistoryPage } from "./routes/HistoryPage";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import API from "./API";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // Check if user previously logged in and cookie session is still valid
  useEffect(() => {
    const init = async () => {
      try {
        const user = await API.getUserInfo();
        setUser(user);
        setEmail(user.email);
        setName(user.name);
        setLoggedIn(true);
      } catch (err) {
        setLoggedIn(false);
      }
    };
    init();
  }, []);

  return (
    <BrowserRouter>
      <header>
        <Header 
          loggedIn={loggedIn}  
          name={name}
        />
      </header>
      <main>
        <Routes>
          <Route
            index
            element={
              <HomePage 
                user={user}
              />
            }
          /> 
          <Route
            path="/login"
            element={
              <LoginPage 
                setUser={setUser}
                setLoggedIn={setLoggedIn}
                setEmail={setEmail}
                setName={setName}
                loggedIn={loggedIn}
                name={name}
                email={email}
              />
            }
          /> 
          <Route
            path="/game/:difficulty"
            element={
              <GamePage 
                user={user}
                loggedIn={loggedIn}
              />
            }
          /> 
          <Route
            path="/history"
            element={loggedIn ?
              <HistoryPage /> :
              <Navigate to="/login" />
            }
          /> 
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
      <footer>
        <Footer />
      </footer>
    </BrowserRouter>
  )
}

export default App
