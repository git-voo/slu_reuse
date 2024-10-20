import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "./App.css"
import Contactus from "./pages/contactus";
import LandingPage from "./pages/landingPage";
import Register from "./pages/auth/register";
import VerifyEmail from "./pages/auth/verify_email";
import Login from './pages/auth/login';
<<<<<<< HEAD
import Forgot_Password from './pages/auth/forgot_password';
import AboutUs from "./pages/aboutUs/AboutUs";
=======
import ForgotPassword from './pages/auth/forgot_password';
import ResetPassword from './pages/auth/reset_password';
import AboutUs from "./pages/aboutUs/AboutUs"
>>>>>>> origin
import ProfilePage from './pages/profile/profilePage';
/* 
import Conversations from './pages/profile/conversations';
import DeleteAccount from './pages/profile/deleteAccount';
import ListItem from './pages/profile/listItem';
import MyListings from './pages/profile/myListings';
import VerifyEmail from './pages/profile/verifyEmail';
*/
import ProfileLayout from './layout/ProfileLayout';

// import Navigation from "./components/navigation";
// import ScrollToTop from "./utils/ScrollToTop";

function App() {
<<<<<<< HEAD
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
    );
=======
  return (
    <BrowserRouter>
      {/* <ScrollToTop /> */}
        <Routes >
            <Route path = "/register" element = { <Register/> }/> 
            <Route path = "/verify-email" element = { <VerifyEmail/> }/> 
            <Route path = "/login" element = { <Login/> }/> 
            <Route path = "/forgot-password" element = { <ForgotPassword/> }/>
            <Route path = "/reset-password" element = { <ResetPassword/> }/> 
            <Route path = "/" element = { <LandingPage/> }/> 
            <Route path="/about" element={ <AboutUs/> }/> 
            <Route path="/contact" element={ <Contactus/> }/>
            <Route path="/profile" element={ <ProfilePage/> }/>
        </Routes> 
    </BrowserRouter> 
    )
>>>>>>> origin
}

export default App;
