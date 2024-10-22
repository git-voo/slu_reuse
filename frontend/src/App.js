import { BrowserRouter, Route, Routes } from 'react-router-dom'
import "./App.css"
import Contactus from "./pages/contactus"
import LandingPage from "./pages/landingPage"
import Register from "./pages/auth/register"
import VerifyEmail from "./pages/auth/verify_email"
import Login from './pages/auth/login'
import ForgotPassword from './pages/auth/forgot_password'
import ResetPassword from './pages/auth/reset_password'
import AboutUs from "./pages/aboutUs/AboutUs"
import ProfilePage from './pages/profile/profilePage';
import ItemListPage from './pages/items/ItemListPage';
import DonateItem from './pages/items/DonateItem';

// import Navigation from "./components/navigation";
// import ScrollToTop from "./utils/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      {/* <ScrollToTop /> */}
      <Routes >
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contactus />} />
        <Route path="/item/:itemID" element={<SingleItemPage />} />
        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<ProfilePage />} />
          {/*
                <Route path="conversations" element={<Conversations />} />
                <Route path="delete-account" element={<DeleteAccount />} />
                <Route path="list-item" element={<ListItem />} />
                <Route path="my-listings" element={<MyListings />} />
                <Route path="verify-email" element={<VerifyEmail />} />
                */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
