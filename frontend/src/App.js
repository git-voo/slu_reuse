import "./App.css";
//import ScrollToTop from "./utils/ScrollToTop";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/auth/register";
import Login from './pages/auth/login';
import Forgot_Password from './pages/auth/forgot_password';

function App() {
  return (
    <>
       <BrowserRouter>
        {/*<ScrollToTop />*/}
      <Routes>
      <Route path="/" element={<Register/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/forgot-password" element={<Forgot_Password/>} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
