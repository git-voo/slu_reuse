import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { Button, Form } from 'react-bootstrap';
import { FaXTwitter } from 'react-icons/fa6'; 
import { useEffect, useState } from "react";
import ItemCard from "../../components/card/index.mjs";
import Footer from "../../components/footer";
import Navbar from "../../components/navigation";
import "../../styles/landingPage/index.css"; 
import "../../styles/chatbot/chatbot.css";  // Import chatbot-specific styles
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/AxiosInstance";

export default function LandingPage() {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [filters, setFilters] = useState({
        category: "All",
        location: "All Locations",
        sortOption: "newest",
        searchQuery: "",
    });
    const [isChatOpen, setIsChatOpen] = useState(false);  // Chatbot open state
    const [chatMessages, setChatMessages] = useState([
        { sender: "bot", text: "Hello! How can I assist you today?" }
    ]);
    const [userInput, setUserInput] = useState("");

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        filterItemsByCategory();
    }, [filters]);
    
    const handleFormOpen = () => {
        setShowForm(true);
    };
    
    const handleFormClose = () => {
        setShowForm(false);
    };

    const fetchItems = async () => {
        try {
            const response = await axiosInstance.get("/items");
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const filterItemsByCategory = async () => {
        const { category, location, sortOption, searchQuery } = filters;
        try {
            const response = await axiosInstance.get(`/filter`, {
                params: {
                    category: category.toLowerCase(),
                    location: location !== "All Locations" ? location : "",
                    sort: sortOption,
                    searchQuery,
                },
            });
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching filtered items:", error);
        }
    };

    const updateFilters = (newFilters) => {
        setFilters({ ...filters, ...newFilters });
    };

    // Chatbot Functions
    const toggleChatbot = () => {
        setIsChatOpen((prevIsOpen) => !prevIsOpen);
    };

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleSendMessage = () => {
        if (userInput.trim()) {
            setChatMessages([...chatMessages, { sender: "user", text: userInput }]);
            setUserInput("");

            setTimeout(() => {
                setChatMessages((prevMessages) => [
                    ...prevMessages,
                    { sender: "bot", text: "Thank you for your message! We will get back to you shortly." },
                ]);
            }, 1000);
        }
    };

    return (
        <div className="landing-page-container">
            <Navbar filters={filters} updateFilters={updateFilters} />
            <div className="items-list">
                {items.length ? (
                    items.map((item) => (
                        <div onClick={() => navigate(`/item/${item._id}`)} key={item._id} className="text-decoration-none">
                            <ItemCard 
                                userAvatar={item.userAvatar}
                                userName={item.userName}
                                itemImage={item.images[0]} 
                                title={item.name}
                                description={item.description}
                                location={item.pickupLocation}
                            />
                        </div>
                    ))
                ) : (
                    <p>No items found</p>
                )}
            </div>

            <div className="footer-section">
                <div className="social-media-section">
                    <a href="https://www.facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                        <FaFacebookF />
                    </a>
                    <a href="https://www.twitter.com" className="social-icon twitter" target="_blank" rel="noopener noreferrer">
                        <FaXTwitter />
                    </a>
                    <a href="https://www.instagram.com" className="social-icon instagram" target="_blank" rel="noopener noreferrer">
                        <FaInstagram />
                    </a>
                </div>
                <div className="contact-button-container">
                    <Button className="contact-button" onClick={handleFormOpen}>Contact Us</Button>
                </div>
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <Button className="close-button" variant="light" onClick={handleFormClose}>X</Button>
                        <h2>Contact Us</h2>
                        <p>Thank you for considering our services. This is a donation website, SLU Reuse, pertaining to SLU users. We will get back to you within 48 hours.</p>
                        <Form className="contact-form">
                            <Form.Group controlId="formName">
                                <Form.Label>Name*</Form.Label>
                                <Form.Control type="text" placeholder="Enter your name" required />
                            </Form.Group>

                            <Form.Group controlId="formEmail">
                                <Form.Label>Email address*</Form.Label>
                                <Form.Control type="email" placeholder="Enter your email" required />
                            </Form.Group>

                            <Form.Group controlId="formPhone">
                                <Form.Label>Phone number</Form.Label>
                                <Form.Control type="tel" placeholder="Enter your phone number" required />
                            </Form.Group>

                            <Form.Group controlId="formMessage">
                                <Form.Label>What would you like to let us know?*</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Enter your message" required />
                            </Form.Group>

                            <Button variant="primary" type="submit">Send</Button>
                        </Form>
                    </div>
                </div>
            )}

            {/* Chatbot pop-up in the bottom right */}
            <div className={`chatbot-container ${isChatOpen ? "open" : ""}`}>
                <div className="chatbot-header">
                    Chat with Us
                    <button className="minimize-button" onClick={toggleChatbot}>
                        {isChatOpen ? "–" : "+"}
                    </button>
                </div>
                {isChatOpen && (
                    <div className="chatbot-body">
                        <div className="messages">
                            {chatMessages.map((message, index) => (
                                <div key={index} className={`message ${message.sender}`}>
                                    {message.text}
                                </div>
                            ))}
                        </div>
                        <Form className="chatbot-input" onSubmit={(e) => e.preventDefault()}>
                            <Form.Control
                                type="text"
                                placeholder="Type your question..."
                                value={userInput}
                                onChange={handleInputChange}
                            />
                            <Button variant="primary" onClick={handleSendMessage}>Send</Button>
                        </Form>
                    </div>
                )}
            </div>
        </div>
    );
}