import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import App from './App';
import initialStudents from './data/students.json';
import { VALIDATION_MESSAGES } from './utils/validation';

describe('App Integration', () => {
  it('renders student portal heading, summary, and initial seeded students', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: /student portal/i })
    ).toBeInTheDocument();

    const table = screen.getByRole('table');

    // Verify initial seeded students from students.json are displayed in the roster table
    initialStudents.forEach((student) => {
      expect(within(table).getByText(student.id)).toBeInTheDocument();
      expect(within(table).getByText(student.name)).toBeInTheDocument();
      expect(within(table).getByText(student.email)).toBeInTheDocument();
      expect(within(table).getByText(student.major)).toBeInTheDocument();
    });

    // Total enrolled students should match initial count
    const totalBadges = screen.getAllByText(String(initialStudents.length));
    expect(totalBadges.length).toBeGreaterThan(0);
  });

  it('adds a new student to the roster and updates state and UI without page reload', async () => {
    const user = userEvent.setup();
    render(<App />);

    const idInput = screen.getByLabelText(/student id/i);
    const nameInput = screen.getByLabelText(/full name|student name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const majorSelect = screen.getByLabelText(/major/i);
    const submitButton = screen.getByRole('button', { name: /enroll student|add student/i });

    await user.type(idInput, '24127999');
    await user.type(nameInput, 'Trần Minh Anh');
    await user.type(emailInput, '24127999@student.hcmus.edu.vn');
    await user.selectOptions(majorSelect, 'Data Science');
    await user.click(submitButton);

    const table = screen.getByRole('table');

    // Newly added student should now be displayed in the roster table
    expect(within(table).getByText('24127999')).toBeInTheDocument();
    expect(within(table).getByText('Trần Minh Anh')).toBeInTheDocument();
    expect(within(table).getByText('24127999@student.hcmus.edu.vn')).toBeInTheDocument();
    expect(within(table).getByText('Data Science')).toBeInTheDocument();

    // Count should be incremented
    const updatedCount = initialStudents.length + 1;
    const countBadges = screen.getAllByText(String(updatedCount));
    expect(countBadges.length).toBeGreaterThan(0);

    // Form inputs should be reset to blank/default
    expect(idInput).toHaveValue('');
    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
  });

  it('prevents duplicate student ID enrollment (Uniqueness Violation)', async () => {
    const user = userEvent.setup();
    render(<App />);

    const idInput = screen.getByLabelText(/student id/i);
    const nameInput = screen.getByLabelText(/full name|student name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /enroll student|add student/i });

    // Use existing student's ID
    const duplicateId = initialStudents[0].id;
    await user.type(idInput, duplicateId);
    await user.type(nameInput, 'Another Student');
    await user.type(emailInput, 'another@student.hcmus.edu.vn');
    await user.click(submitButton);

    expect(screen.getByRole('alert')).toHaveTextContent(
      VALIDATION_MESSAGES.ID_DUPLICATE
    );

    // Roster count should not increase
    const totalBadges = screen.getAllByText(String(initialStudents.length));
    expect(totalBadges.length).toBeGreaterThan(0);
  });
});
