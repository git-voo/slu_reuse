import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from '../../components/profile/sidebar';

describe('Profile Sidebar Component', () => {
    test('renders sidebar with all links', () => {
        render(
            <Router>
                <Sidebar />
            </Router>
        );

        // Check if all links are present
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('My Listings')).toBeInTheDocument();
        expect(screen.getByText('List an Item')).toBeInTheDocument();
        expect(screen.getByText('Conversations')).toBeInTheDocument();
        expect(screen.getByText('Change Email')).toBeInTheDocument();
        expect(screen.getByText('Delete My Account')).toBeInTheDocument();
    });

    test('navigates to correct routes', () => {
        render(
            <Router>
                <Sidebar />
            </Router>
        );

        // Check if each link has the correct href using getByRole
        expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
        expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/profile');
        expect(screen.getByRole('link', { name: 'My Listings' })).toHaveAttribute('href', '/profile/my-listings');
        expect(screen.getByRole('link', { name: 'List an Item' })).toHaveAttribute('href', '/profile/list-item');
        expect(screen.getByRole('link', { name: 'Conversations' })).toHaveAttribute('href', '/profile/conversations');
        expect(screen.getByRole('link', { name: 'Change Email' })).toHaveAttribute('href', '/profile/verify-email');
        expect(screen.getByRole('link', { name: 'Delete My Account' })).toHaveAttribute('href', '/profile/delete-account');
    });

    test('delete account link is inside list item with correct class', () => {
        render(
            <Router>
                <Sidebar />
            </Router>
        );

        // Find the delete account list item by class name
        const deleteListItem = screen.getByText('Delete My Account').closest('li');

        // Assert the list item has the correct class and contains the link
        expect(deleteListItem).toHaveClass('delete-account');
        expect(screen.getByText('Delete My Account')).toBeInTheDocument();
    });
});
