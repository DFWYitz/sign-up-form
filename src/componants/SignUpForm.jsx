import React, { useState } from "react";

const API_URL = "https://fsa-jwt-practice.herokuapp.com/"; // Base API URL

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [token, setToken] = useState(null); // State to store JWT token
  const [loggedInUser, setLoggedInUser] = useState(null); // Store authenticated user info

  // Handle input changes
  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  // Sign up and retrieve JWT token
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_URL}signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log(data)
      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      setSuccess("Signup successful! Now authenticating...");
      console.log("Signup successful:", data);

      // Call authenticate function to log in the user
      authenticateUser(data.token);
    } catch (err) {
      setError(err.message);
      console.error("Signup error:", err.message);
    }
  };

  // Authenticate user and retrieve JWT token
  const authenticateUser = async (token) => {
    try {
      const response = await fetch(`${API_URL}authenticate`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },

      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Store JWT token in local storage and state
      localStorage.setItem("jwtToken", data.token);
      setToken(data.token);

      // Display authenticated user data
      setLoggedInUser(data.data.username); // Extract username from response

      setSuccess(`Welcome, ${data.data.username}! 🎉`);
      console.log("Authentication successful:", data);
    } catch (err) {
      setError(err.message);
      console.error("Authentication error:", err.message);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>

      {/* Display error or success messages */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* Show authenticated user info */}
      {loggedInUser && <h3>Welcome, {loggedInUser}!</h3>}

      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={handleUsernameChange} required />
        </label>

        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} required />
        </label>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;

