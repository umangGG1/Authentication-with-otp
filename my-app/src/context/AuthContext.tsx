import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  user: any;
  error: string;
  success: string;
  signUpStep1: (userData: { name: string; phone: string; email: string }) => Promise<void>;
  verifyOtp: (email: string | undefined, code: string) => Promise<void>;
  completeSignUp: (userDetails: { userId: string; password: string; email: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const signUpStep1 = async (userData: { name: string; phone: string; email: string }) => {
    try {
      const response = await fetch("https://opgauru-auth.onrender.com/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.status === "Success") {
        setUser({ ...userData }); // Store all user data, not just email
        setSuccess("OTP sent to your email. Please verify.");
        setError("");
      } else {
        setError(data.message);
        setSuccess("");
      }
    } catch (err) {
      console.error("Error during signup step 1:", err);
      setError("An error occurred during signup. Please try again.");
      setSuccess("");
    }
  };

  const verifyOtp = async (email: string | undefined, code: string) => {
    try {
      const response = await fetch("https://opgauru-auth.onrender.com/user/signup-step2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (data.status === "Success") {
        setSuccess("OTP verified successfully!");
        setError("");
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

  const completeSignUp = async (userDetails: { userId: string; password: string; email: string }) => {
    try {
      
      const completeUserDetails = {
        ...userDetails,
        ...user,
      };

      const response = await fetch("https://opgauru-auth.onrender.com/user/signup-step3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeUserDetails),
      });

      const data = await response.json();

      if (data.status === "Success") {
        setSuccess("Signup complete! You can now log in.");
        setUser(data.user);
        setError("");
      } else {
        setError(data.message);
        setSuccess("");
      }
    } catch (err) {
      console.error("Error completing signup:", err);
      setError("An error occurred while completing signup. Please try again.");
      setSuccess("");
    }
  };

  return (
    <AuthContext.Provider value={{ user, error, success, signUpStep1, verifyOtp, completeSignUp }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };