import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProfileRoutes from './routes/profileRoutes';
import "./App.css"
// ////import Navigation from "./components/navigation";
import Contactus from "./pages/contactus";

// import ScrollToTop from "./utils/ScrollToTop";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/landingPage"
import Register from "./pages/auth/register";
import Login from './pages/auth/login';
import Forgot_Password from './pages/auth/forgot_password';
import AboutUs from "./pages/aboutUs/AboutUs"
 


function App() {
  return (
    <BrowserRouter>
      {/* <ScrollToTop /> */}
        <Routes >
        <Route path = "/register" element = { < Register/ > }/> 
        <Route path = "/login" element = { < Login/ > }/> 
        <Route path = "/forgot-password" element = { < Forgot_Password/ > }/> 
        <Route path = "/" element = { < LandingPage/ > }/> 
        <Route path="/about" element={<AboutUs />} /> 
      <Route path="/contact" element={<Contactus/>} />
       
        </Routes> 
        </BrowserRouter> 
        
    )
}

export default App