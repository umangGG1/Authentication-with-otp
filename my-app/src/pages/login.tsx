import { useState } from "react";
import Banner from "../component/loginbanner";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useToast } from "../component/ToastProvider"; 

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast(); 

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://opgauru-auth.onrender.com/user/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === "Success") {
        localStorage.setItem("token", data.token);
        showToast('success', 'Login Successful!', 'Success!'); 
        navigate("/dashboard");
      } else {
        showToast('error', data.message, 'Error');
      }
    } catch (error) {
      console.error("Error during login:", error);
      showToast('error', "An error occurred. Please try again.", 'Error'); 
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <main className="main-login">
      <Banner />
      <div className="main-login-right">
        <div className="main-login-right-container">
          <div className="main-login-right-heading">
            <div className="heading-text">Login to </div>
            <div className="heading-image">
              <img src="/image.png" alt="brand-logo" />
            </div>
          </div>
          <div className="main-login-right-welcome">
            <div className="welcome-text">Welcome back! Please enter your details.</div>
          </div>
          <div className="main-login-right-form">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
              
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
          <div className="main-login-submit-btn">
            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
          <div className="main-login-already">
            Don’t have an account?<a href="/signup"> Sign up for free</a>
          </div>
          <div className="main-login-goback">
            Go back to <a href="/"> Home</a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
