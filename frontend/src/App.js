import "./App.css";
import Navigation from "./components/navigation";
import Contactus from "./pages/contactus";

// import ScrollToTop from "./utils/ScrollToTop";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      {/* <ScrollToTop /> */}
      <Routes>
        <Route path="/" element={<>you're here</>} />
        <Route path="/order" element={<Navigation/>} />
        <Route path="/contact" element={<Contactus/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
