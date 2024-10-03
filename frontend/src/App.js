import "./App.css";
//import ScrollToTop from "./utils/ScrollToTop";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutUs from "./pages/aboutUs/AboutUs"
 


function App() {
  return (
    <BrowserRouter>
      {/* <ScrollToTop /> */}
      <Routes>
        <Route path="/" element={<>you're here</>} />
        <Route path="/about" element={<AboutUs />} /> 
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
