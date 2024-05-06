import React from 'react';
import { render, screen } from '@testing-library/react';
import AddBudget from '../../components/AddBudget';  // Adjust path as necessary

describe('AddBudget Component', () => {
  it('renders form fields and submit button', () => {
    render(<AddBudget />);
    expect(screen.getByLabelText('Budget Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Total Amount')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
});
