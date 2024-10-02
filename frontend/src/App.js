import "./App.css";
import Navigation from "./components/navigation";
// import ScrollToTop from "./utils/ScrollToTop";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      {/* <ScrollToTop /> */}
      <Routes>
        <Route path="/" element={<>you're here</>} />
        <Route path="/order" element={<Navigation/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
