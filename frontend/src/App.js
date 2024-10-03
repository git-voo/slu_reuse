import "./App.css"
// ////import ScrollToTop from "./utils/ScrollToTop";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/landingPage"
import Register from "./pages/auth/register";
import Login from './pages/auth/login';
import Forgot_Password from './pages/auth/forgot_password';
import AboutUs from "./pages/aboutUs/AboutUs"
 


function App() {
    return ( <>
        <BrowserRouter>
        <Routes >
        <Route path = "/register" element = { < Register/ > }/> 
        <Route path = "/login" element = { < Login/ > }/> 
        <Route path = "/forgot-password" element = { < Forgot_Password/ > }/> 
        <Route path = "/" element = { < LandingPage/ > }/> 
        <Route path="/about" element={<AboutUs />} /> 
       
        </Routes> 
        </BrowserRouter> 
        </>
    )
}

export default App