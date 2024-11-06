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
import ProfilePage from './pages/profile/profilePage'
import ItemListPage from './pages/items/ItemListPage'
import DonateItem from './pages/items/DonateItem'
import SingleItemPage from './pages/singleItem/SingleItemPage'
import ProfileLayout from './layout/ProfileLayout'
import Conversations from './components/conversations'

// import Navigation from "./components/navigation";
// import ScrollToTop from "./utils/ScrollToTop";

function App() {
  const initialMessages = [
    { id: 1, senderId: 101, text: "Hello, I’m interested in your donation item!", timestamp: "10:01 AM" },
    { id: 2, senderId: 102, text: "Hi! Sure, it's still available.", timestamp: "10:02 AM" },
    { id: 3, senderId: 101, text: "Great! When would be a good time to pick it up?", timestamp: "10:05 AM" },
  ];
  const userId = 101; // Set the current user's ID
  
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
        <Route path="/donate-item" element={<DonateItem />} />
        <Route path="/profile" element={<ProfileLayout />} />
        {/* <Route index element={<ProfilePage />} /> */}

        <Route path="/profile/conversations" element={<Conversations initialMessages={initialMessages} userId={userId}  />}>
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
