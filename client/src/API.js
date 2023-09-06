'use strict';
const APIURL = 'http://localhost:3000/api';

// LOGIN -> performs the login
async function logIn(email, password) {
    try {
        const credentials = {
            username: email,
            password: password
        };

        const response = await fetch(APIURL + "/sessions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(credentials),
        });
      
        if (response.ok) {
            const user = await response.json();
            console.log("LOGIN SUCCESSFUL -> " + user.name);
            return user;
        } else {
            throw new Error();
        }
    } catch(e) {
        throw new Error(e) ;
    }
}

// GET USER INFO -> fetches user information if authenticated
async function getUserInfo() {
    try {
        const response = await fetch(APIURL + "/sessions/current", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
        });
    
        if (response.ok) {
            const user = await response.json();
            return user;
        }
    } catch(e) {
        throw new Error(e) ;
    }
}

// LOGOUT -> performs the logout
async function logOut() {
    try {
        const response = await fetch(APIURL + "/sessions/current", {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            },
            credentials: "include",
        });
    
        if (response.ok) {
            console.log("LOGOUT SUCCESSFUL code -> " + response.status);
            return response.status;
        } else {
            throw new Error("Logout failed");
        }
    } catch (e) {
      throw new Error(e);
    }
  }

// GET VALUES OF PROPERTY -> fetches all the values of one property from the DB
async function getValues(property) {
    try {
        const response = await fetch(APIURL + "/values/?property=" + property, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const values = await response.json();
            return values;
        } else {
            throw new Error("Failed to fetch values: " + response.statusText);
        }
    } catch(e) {
        throw new Error(e) ;
    }
}

// GET CARDS -> fetches all the cards data form the DB depending on the difficulty
async function getCards(diff) {
    try {
        const response = await fetch(APIURL + "/cards/?difficulty=" + diff, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const cards = await response.json();
            return cards;
        } else {
            throw new Error("Failed to fetch cards: " + response.statusText);
        }
    } catch(e) {
        throw new Error(e) ;
    }
}

// GET CHECK CARD -> checks if the card chosen by the user is the secret item
async function getCheckCard(cardId) {
    try {
        const response = await fetch(APIURL + "/checkCard/?cardId=" + cardId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const flag = await response.json();
            return flag;
        } else {
            throw new Error("Failed to fetch cards: " + response.statusText);
        } 
    } catch(e) {
        throw new Error(e) ;
    }
}

// GET CHECK PROPERTY -> checks if the property and value chosen by the user is corresponding to the secret item
async function getCheckProperty(property, value) {
    try {
        const response = await fetch(APIURL + "/checkProperty/?property=" + property + "&value=" + value, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const flag = await response.json();
            return flag;
        } else {
            throw new Error("Failed to fetch cards: " + response.statusText);
        } 
    } catch(e) {
        throw new Error(e) ;
    }
}

// GET HISTORY -> fetches all the matches played by the logged user
async function getHistory() {
    try {
        const response = await fetch(APIURL + "/history" , {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        if (response.ok) {
            const history = await response.json();
            return history;
        } else {
            throw new Error("Failed to fetch history: " + response.statusText);
        }
    } catch(e) {
        throw new Error(e) ;
    }
}

// POST HISTORY -> Add a match played to the history of the logged user
async function postHistory(difficulty, score) {
    try {
        const response = await fetch(APIURL + "/history/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ "difficulty":difficulty, "score":score }),
        });
      
        if (response.ok) {
            const historyEntry = await response.json();
            return historyEntry;
        } else {
            throw new Error("Error creating page");
        }
    } catch(e) {
        throw new Error(e) ;
    }
}

const API = { logIn, logOut, getUserInfo, getValues, getCards, getCheckCard, getCheckProperty, getHistory, postHistory };
export default API;