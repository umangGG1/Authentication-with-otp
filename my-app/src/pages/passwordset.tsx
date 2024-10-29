import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Banner from "../component/loginbanner";

const Pass: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { error, success, completeSignUp, user } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.email) {
      setLocalError("Email information is missing. Please start the signup process again.");
      return;
    }

    const userDetails = {
      userId,
      password,
      email: user.email, 
    };

    try {
      await completeSignUp(userDetails);

      if (success) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Error completing signup:", err);
      setLocalError("An error occurred while completing signup. Please try again.");
    }
  };

  return (
    <>
      <main className="main-login">
        <Banner />
        <div className="main-login-right">
          <div className="main-login-right-container">
            <div className="main-login-right-heading">
              <div className="main-heading-text" style={{ fontSize: "2.5rem", fontWeight: "bolder" }}>
                Enter Your Details
              </div>
            </div>

            <form className="main-login-right-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Set User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Set a Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="main-login-submit-btn">
                <button type="submit">Submit</button>
              </div>
            </form>
            {localError && <div className="error-message">{localError}</div>}
            {success && <div className="success-message">{success}</div>}
          </div>
        </div>
      </main>
    </>
  );
};

export default Pass;