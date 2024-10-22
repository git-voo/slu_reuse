import { render, screen, fireEvent } from '@testing-library/react';
import ListItem from '../items/ListItem'; // Adjust this path to match your actual folder structure
import { BrowserRouter } from 'react-router-dom';

describe('ListItem Component', () => {
    beforeEach(() => {
        // Mock the window.alert function
        window.alert = jest.fn();
    });

    it('should render form fields correctly', () => {
        render(
            <BrowserRouter>
                <ListItem />
            </BrowserRouter>
        );

        expect(screen.getByLabelText(/Item Images/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Item Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Item Description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Item Category/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Item Quantity/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Pickup Location/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Item Tags/i)).toBeInTheDocument();
    });

    it('should display error if required fields are missing', async () => {
        render(
            <BrowserRouter>
                <ListItem />
            </BrowserRouter>
        );

        const submitButton = screen.getByText(/Submit/i);
        fireEvent.click(submitButton);

        // Check if alert is called
        expect(window.alert).toHaveBeenCalledWith("Please fill in the required fields: Name, Category, Images, Description, ");
    });

    it('should update form fields on user input', () => {
        render(
            <BrowserRouter>
                <ListItem />
            </BrowserRouter>
        );

        const itemNameInput = screen.getByLabelText(/Item Name/i);
        fireEvent.change(itemNameInput, { target: { value: 'Test Item' } });
        expect(itemNameInput.value).toBe('Test Item');

        const itemDescriptionInput = screen.getByLabelText(/Item Description/i);
        fireEvent.change(itemDescriptionInput, { target: { value: 'This is a test description.' } });
        expect(itemDescriptionInput.value).toBe('This is a test description.');

        const itemCategoryInput = screen.getByLabelText(/Item Category/i);
        fireEvent.change(itemCategoryInput, { target: { value: 'Test Category' } });
        expect(itemCategoryInput.value).toBe('Test Category');

        const itemQuantityInput = screen.getByLabelText(/Item Quantity/i);
        fireEvent.change(itemQuantityInput, { target: { value: '5' } });
        expect(itemQuantityInput.value).toBe('5');

        const pickupLocationInput = screen.getByLabelText(/Pickup Location/i);
        fireEvent.change(pickupLocationInput, { target: { value: '123 Test St' } });
        expect(pickupLocationInput.value).toBe('123 Test St');

        const itemTagsInput = screen.getByLabelText(/Item Tags/i);
        fireEvent.change(itemTagsInput, { target: { value: 'tag1, tag2' } });
        expect(itemTagsInput.value).toBe('tag1, tag2');
    });
});
