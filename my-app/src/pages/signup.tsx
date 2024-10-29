import React, { useState, useEffect } from "react";
import "./style.css";
import Banner from "../component/loginbanner";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useToast } from "../component/ToastProvider"; 

const SignUp = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { error, success, signUpStep1 } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const userData = {
      name,
      phone,
      email,
    };

    try {
      await signUpStep1(userData);
      showToast(
        'success',
        'Verification code sent to your email.',
        'Success!'
      );
    } catch (err) {
      showToast(
        'error',
        error || 'Something went wrong',
        'Error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      navigate("/otp-verify");
    }
  }, [success, navigate]);

  return (
    <main className="main-login">
      <Banner />
      <div className="main-login-right">
        <div className="main-login-right-container">
          <div className="main-login-right-heading">
            <div className="heading-text">Sign Up to </div>
            <div className="heading-image">
              <img src="/image.png" alt="brand-logo" />
            </div>
          </div>
          <div className="main-login-right-welcome">
            <div className="welcome-text">Please enter your details to Sign Up.</div>
          </div>
          <form className="main-login-right-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <div className="main-login-exit-text">
              By signing up, you are agreeing to our <span id="TnC-text">Terms And Conditions.</span>
            </div>
            <div className="main-login-submit-btn">
  <button
    type="submit"
    disabled={isLoading}
    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isLoading ? (
      <>
        <Loader2 className="w-4 h-4 spin" />
        
      </>
    ) : (
      "Next"
    )}
  </button>
</div>
          </form>
          <div className="main-login-already">
            Already have an account?<a href="/login" className="text-blue-600 hover:underline"> Login</a>
          </div>
          <div className="main-login-goback">
            Go back to <a href="/" className="text-blue-600 hover:underline"> Home</a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignUp;