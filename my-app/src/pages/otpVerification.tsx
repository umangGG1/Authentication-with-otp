import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Banner from "../component/loginbanner";

const Otp: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const { user } = useAuth(); 
  const navigate = useNavigate();

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Current user in Otp component:", user);
    if (!user?.email) {
      setError("User email not found. Please try again.");
      return;
    }

    try {
      console.log("Sending OTP for:", { email: user.email, code }); 
      const response = await fetch("https://opgauru-auth.onrender.com/user/signup-step2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user?.email, code }), 
      });

      const data = await response.json();
      console.log("Received response:", data); 

      if (data.status === "Success") {
        setSuccess("OTP verified successfully!");
        setError("");
        navigate("/set-pass"); 
      } else {
        setError("Invalid OTP. Please try again.");
        setSuccess("");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("An error occurred while verifying OTP. Please try again.");
      setSuccess("");
    }
  };

  return (
    <>
      <main className="main-login">
        <Banner />
        <div className="main-login-right">
          <div className="main-login-right-container">
            <div className="main-image">
              <img src="/otp.png" alt="OTP Verification" />
            </div>
            <div className="main-login-right-heading">
              <div className="main-heading-text" style={{ fontSize: "2.5rem", fontWeight: "bolder" }}>
                OTP Verification
              </div>
            </div>
            <div className="main-login-right-welcome">
              <div className="welcome-text">We have sent you a 6-digit OTP verification code to your email.</div>
            </div>
            <form className="main-login-right-form" onSubmit={handleOtpSubmit}>
              <input
                type="number"
                placeholder="Enter Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <div className="main-login-submit-btn">
                <button type="submit">Verify</button>
              </div>
            </form>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
          </div>
        </div>
      </main>
    </>
  );
};

export default Otp;
