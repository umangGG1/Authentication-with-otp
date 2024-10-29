import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./pages/signup";
import Login from "./pages/login";
import Otp from "./pages/otpVerification";
import "./App.css";
import Pass from "./pages/passwordset";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./component/ProtectedRoute";


const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/otp-verify" element={<Otp />} />
      <Route path="/set-pass" element={<Pass />} />
      <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> } />
    </Routes>
  </Router>
);
export default App;
