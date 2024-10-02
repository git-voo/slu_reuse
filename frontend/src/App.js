import "./App.css"
// import ScrollToTop from "./utils/ScrollToTop";
import { BrowserRouter, Routes, Route } from "react-router-dom" 
import LandingPage from "./pages/landingPage"

function App() {
  return (
    <BrowserRouter>
      {/* <ScrollToTop /> */}
      <Routes>
        <Route path="/" element={<LandingPage/>} />
       </Routes>
    </BrowserRouter>
  )
}

export default App
