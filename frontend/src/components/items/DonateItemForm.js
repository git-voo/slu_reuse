import React, { useState } from "react";
import axiosInstance from "../../services/AxiosInstance";
import "../../styles/DonateItem/donateItem.css";

const DonateItemForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        quantity: 1,
        tags: "",
        pickupLocation: "",
        imageFile: null,
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, imageFile: e.target.files[0] });
    };

    const handleUploadAndAnalyze = async () => {
        if (!formData.imageFile) {
            alert("Please upload an image first!");
            return;
        }

        setLoading(true);

        try {
            // Upload image
            const imageFormData = new FormData();
            imageFormData.append("image", formData.imageFile);

            const uploadResponse = await axiosInstance.post("/images/upload", imageFormData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const imageUrl = uploadResponse.data.url;

            // Analyze image
            const analyzeResponse = await axiosInstance.post("/analyze-image", { imageUrl });

            const { name, description, category } = analyzeResponse.data;

            // Auto-fill form fields
            setFormData({
                ...formData,
                name,
                description,
                category,
            });

            alert("Details auto-filled. Please review and submit!");
        } catch (error) {
            console.error("Error uploading or analyzing image:", error);
            alert("Failed to analyze image. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post("/api/items", formData);
            alert("Item successfully saved!");
        } catch (error) {
            console.error("Error saving item:", error);
            alert("Failed to save item. Try again.");
        }
    };

    return (
        <form className="donate-item-form" onSubmit={handleSubmit}>
            <label htmlFor="image">Upload Item Image</label>
            <input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
                required
            />
            <button type="button" onClick={handleUploadAndAnalyze} disabled={loading}>
                {loading ? "Analyzing..." : "Upload and Analyze"}
            </button>

            <label htmlFor="name">Item Name</label>
            <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
            />

            <label htmlFor="description">Item Description</label>
            <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
            ></textarea>

            <label htmlFor="category">Category</label>
            <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
            />

            <label htmlFor="quantity">Quantity</label>
            <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
            />

            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
            />

            <label htmlFor="pickupLocation">Pickup Location</label>
            <input
                type="text"
                id="pickupLocation"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleInputChange}
                required
            />

            <button type="submit" className="submit-btn">Submit</button>
        </form>
    );
};

export default DonateItemForm;
