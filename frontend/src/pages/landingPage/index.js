import { FaInstagram, FaFacebookF } from "react-icons/fa"
import { Button, Form } from 'react-bootstrap'
import { FaXTwitter } from 'react-icons/fa6'
import { useEffect, useState } from "react"
import ItemCard from "../../components/card/index.mjs"
import Footer from "../../components/footer"
import Navbar from "../../components/navigation"
import "../../styles/landingPage/index.css"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../services/AxiosInstance"
import Conversations from "../../components/conversations"

export default function LandingPage() {
    const [items, setItems] = useState([])
    const [selectedItemId, setSelectedItemId] = useState(1234)
    const navigate = useNavigate()
    const [allItems, setAllItems] = useState(items)
    const [showForm, setShowForm] = useState(false)
    const [filters, setFilters] = useState({
        category: "All",
        location: "All Locations",
        sortOption: "newest",
        searchQuery: "",
    })

    useEffect(() => {
        fetchItems()  // Fetch all items initially
    }, [])

    useEffect(() => {
        filterItemsByCategory()  // Apply filters whenever they change
    }, [filters])

    const handleFormOpen = () => {
        setShowForm(true)
    }

    const handleFormClose = () => {
        setShowForm(false)
    }
    const fetchItems = async () => {
        try {
            const response = await axiosInstance.get("/items")
            setItems(response.data)
            setAllItems(response.data)  // Store all items initially
        } catch (error) {
            console.error("Error fetching items:", error)
        }
    }

    const filterItemsByCategory = async () => {
        const { category, location, sortOption, searchQuery } = filters

        try {
            const response = await axiosInstance.get(`/filter`, {
                params: {
                    category: category.toLowerCase(),
                    location: location !== "All Locations" ? location : "",
                    sort: sortOption,
                    searchQuery,
                },
            })
            setItems(response.data) // Set the filtered items
        } catch (error) {
            console.error("Error fetching filtered items:", error)
        }
    }

    const updateFilters = (newFilters) => {
        setFilters({ ...filters, ...newFilters })
    }

    return (
        <div className="landing-page-container">
            <Navbar filters={filters} updateFilters={updateFilters} />
            <div className="items-list">
                {items.length ? (
                    items.map((item, index) => {
                        return (
                            <div onClick={() => navigate(`/item/${item._id}`)} key={item._id} className="text-decoration-none">
                                <ItemCard item={item} userId={12345} onChatClick={() => setSelectedItemId(item._id)}

                                />
                                {selectedItemId === item._id && (
                                    <Conversations donorId={item.owner} onClose={(e) => {
                                        e.stopPropagation()
                                        setSelectedItemId(null)
                                    }} />
                                )}
                            </div>
                        )
                    })
                ) : (
                    <p>No items found</p>
                )}
            </div>



            <div className="footer-section">
                {/* Social Media Links */}
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

                {/* Contact Us Button */}
                <div className="contact-button-container">
                    <Button className="contact-button" onClick={handleFormOpen}>Contact Us</Button>
                </div>
            </div>

            {/* Contact Us Modal */}
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

                            <Button variant="primary" type="submit">
                                Send
                            </Button>
                        </Form>
                    </div>
                </div>
            )}
        </div>
    )
}

