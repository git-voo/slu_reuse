import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SLUReuse brand link', () => {
  render(<App />);
  const brandElement = screen.getByText(/SLUReuse/i);
  expect(brandElement).toBeInTheDocument();
});
