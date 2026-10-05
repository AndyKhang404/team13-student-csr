import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import App from './App';
import initialStudents from './data/students.json';
import { AVAILABLE_MAJORS } from './types/student';
import { VALIDATION_MESSAGES } from './utils/validation';

describe('App Integration', () => {
  it('renders student portal layout and initial student roster pre-seeded from README.md', () => {
    render(<App />);

    // Header and section headings
    expect(
      screen.getByRole('heading', { level: 1, name: /student portal/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /enrollment form/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /student roster/i })
    ).toBeInTheDocument();

    const table = screen.getByRole('table');

    // Verify all 3 initial students from README.md are pre-seeded in the roster table
    const expectedStudents = [
      {
        id: '24127052',
        name: 'Phùng Bảo Khang',
        email: '24127052@student.hcmus.edu.vn',
        major: 'Computer Science',
      },
      {
        id: '24127345',
        name: 'Nguyễn Minh Đức',
        email: '24127345@student.hcmus.edu.vn',
        major: 'Software Engineering',
      },
      {
        id: '24127388',
        name: 'Hy Huê Hưng',
        email: '24127388@student.hcmus.edu.vn',
        major: 'Information Technology',
      },
    ];

    expectedStudents.forEach((student) => {
      expect(within(table).getByText(student.id)).toBeInTheDocument();
      expect(within(table).getByText(student.name)).toBeInTheDocument();
      expect(within(table).getByText(student.email)).toBeInTheDocument();
      expect(within(table).getByText(student.major)).toBeInTheDocument();
    });

    // Total enrolled students count displays initial count (3)
    const countBadges = screen.getAllByText(String(initialStudents.length));
    expect(countBadges.length).toBeGreaterThan(0);
  });

  it('blocks submission and displays required validation errors when fields are blank', async () => {
    const user = userEvent.setup();
    render(<App />);

    const submitButton = screen.getByRole('button', {
      name: /enroll student|add student/i,
    });

    // Attempt submission with blank inputs
    await user.click(submitButton);

    // Validation errors must be displayed for required inputs
    expect(screen.getByText(VALIDATION_MESSAGES.ID_REQUIRED)).toBeInTheDocument();
    expect(screen.getByText(VALIDATION_MESSAGES.NAME_REQUIRED)).toBeInTheDocument();
    expect(screen.getByText(VALIDATION_MESSAGES.EMAIL_REQUIRED)).toBeInTheDocument();

    // Roster count remains unchanged
    const countBadges = screen.getAllByText(String(initialStudents.length));
    expect(countBadges.length).toBeGreaterThan(0);

    // Table rows remain only initial students (+ 1 header row)
    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(initialStudents.length + 1);
  });

  it('displays inline error feedback for invalid inputs and clears errors when corrected', async () => {
    const user = userEvent.setup();
    render(<App />);

    const idInput = screen.getByLabelText(/student id/i);
    const nameInput = screen.getByLabelText(/full name|student name/i);
    const emailInput = screen.getByLabelText(/institutional email|email/i);

    // 1. Invalid student ID (less than 8 digits)
    await user.type(idInput, '12345');
    await user.tab();
    expect(screen.getByText(VALIDATION_MESSAGES.ID_FORMAT)).toBeInTheDocument();

    // 2. Invalid student name (less than 2 characters)
    await user.type(nameInput, 'A');
    await user.tab();
    expect(screen.getByText(VALIDATION_MESSAGES.NAME_MIN_LENGTH)).toBeInTheDocument();

    // 3. Invalid student email (malformed format)
    await user.type(emailInput, 'notanemail');
    await user.tab();
    expect(screen.getByText(VALIDATION_MESSAGES.EMAIL_FORMAT)).toBeInTheDocument();

    // Correct student ID to valid 8 digits -> error clears
    await user.clear(idInput);
    await user.type(idInput, '24127900');
    expect(screen.queryByText(VALIDATION_MESSAGES.ID_FORMAT)).not.toBeInTheDocument();

    // Correct student name -> error clears
    await user.type(nameInput, 'lex');
    expect(screen.queryByText(VALIDATION_MESSAGES.NAME_MIN_LENGTH)).not.toBeInTheDocument();

    // Correct email -> error clears
    await user.clear(emailInput);
    await user.type(emailInput, 'alex@student.hcmus.edu.vn');
    expect(screen.queryByText(VALIDATION_MESSAGES.EMAIL_FORMAT)).not.toBeInTheDocument();
  });

  it('prevents duplicate student ID enrollment by displaying a Uniqueness Violation error', async () => {
    const user = userEvent.setup();
    render(<App />);

    const idInput = screen.getByLabelText(/student id/i);
    const nameInput = screen.getByLabelText(/full name|student name/i);
    const emailInput = screen.getByLabelText(/institutional email|email/i);
    const submitButton = screen.getByRole('button', {
      name: /enroll student|add student/i,
    });

    // Enter existing student ID (Phùng Bảo Khang: 24127052)
    const duplicateId = initialStudents[0].id;
    await user.type(idInput, duplicateId);
    await user.type(nameInput, 'Duplicate Student');
    await user.type(emailInput, 'duplicate@student.hcmus.edu.vn');
    await user.click(submitButton);

    // Uniqueness Violation error is displayed
    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toHaveTextContent(VALIDATION_MESSAGES.ID_UNIQUENESS_VIOLATION);

    // Roster count is still initial count
    const totalBadges = screen.getAllByText(String(initialStudents.length));
    expect(totalBadges.length).toBeGreaterThan(0);

    // Duplicate student was NOT added to the roster
    const table = screen.getByRole('table');
    expect(within(table).queryByText('Duplicate Student')).not.toBeInTheDocument();
  });

  it('successfully enrolls a new student, immediately updates the Student Roster DOM, and resets the form', async () => {
    const user = userEvent.setup();
    render(<App />);

    const idInput = screen.getByLabelText(/student id/i);
    const nameInput = screen.getByLabelText(/full name|student name/i);
    const emailInput = screen.getByLabelText(/institutional email|email/i);
    const majorSelect = screen.getByLabelText(/major/i);
    const submitButton = screen.getByRole('button', {
      name: /enroll student|add student/i,
    });

    // Fill in valid student details
    await user.type(idInput, '24127999');
    await user.type(nameInput, 'Trần Minh Anh');
    await user.type(emailInput, '24127999@student.hcmus.edu.vn');
    await user.selectOptions(majorSelect, 'Data Science');

    // Click submit
    await user.click(submitButton);

    const table = screen.getByRole('table');

    // Assert student appears IMMEDIATELY in the Student Roster DOM
    expect(within(table).getByText('24127999')).toBeInTheDocument();
    expect(within(table).getByText('Trần Minh Anh')).toBeInTheDocument();
    expect(within(table).getByText('24127999@student.hcmus.edu.vn')).toBeInTheDocument();
    expect(within(table).getByText('Data Science')).toBeInTheDocument();

    // Assert count incremented in summary and roster badge
    const updatedCount = initialStudents.length + 1;
    const countBadges = screen.getAllByText(String(updatedCount));
    expect(countBadges.length).toBeGreaterThan(0);

    // Assert form reset: input fields are cleared / reset back to blank and default
    expect(idInput).toHaveValue('');
    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(majorSelect).toHaveValue(AVAILABLE_MAJORS[0]);

    // Assert no error alerts remain in DOM
    expect(screen.queryAllByRole('alert')).toHaveLength(0);
  });

  it('invokes preventDefault on submit event to prevent full page reloads and document navigation', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const form = container.querySelector('form')!;
    let submitEvent: Event | null = null;
    form.addEventListener('submit', (e) => {
      submitEvent = e;
    });

    const submitButton = screen.getByRole('button', {
      name: /enroll student|add student/i,
    });

    await user.click(submitButton);

    // Verify submit event was captured and preventDefault was invoked
    expect(submitEvent).not.toBeNull();
    expect(submitEvent!.defaultPrevented).toBe(true);
  });

  it('maintains client state as single source of truth across subsequent additions and enforces uniqueness on newly added students', async () => {
    const user = userEvent.setup();
    render(<App />);

    const idInput = screen.getByLabelText(/student id/i);
    const nameInput = screen.getByLabelText(/full name|student name/i);
    const emailInput = screen.getByLabelText(/institutional email|email/i);
    const majorSelect = screen.getByLabelText(/major/i);
    const submitButton = screen.getByRole('button', {
      name: /enroll student|add student/i,
    });

    // 1st addition: Đỗ Hoàng Long (24127101)
    await user.type(idInput, '24127101');
    await user.type(nameInput, 'Đỗ Hoàng Long');
    await user.type(emailInput, '24127101@student.hcmus.edu.vn');
    await user.selectOptions(majorSelect, 'Information Systems');
    await user.click(submitButton);

    // 2nd addition: Lê Ngọc Mai (24127102)
    await user.type(idInput, '24127102');
    await user.type(nameInput, 'Lê Ngọc Mai');
    await user.type(emailInput, '24127102@student.hcmus.edu.vn');
    await user.selectOptions(majorSelect, 'Artificial Intelligence');
    await user.click(submitButton);

    const table = screen.getByRole('table');

    // Both new students and all initial students accumulate in state
    expect(within(table).getByText('24127101')).toBeInTheDocument();
    expect(within(table).getByText('Đỗ Hoàng Long')).toBeInTheDocument();
    expect(within(table).getByText('24127102')).toBeInTheDocument();
    expect(within(table).getByText('Lê Ngọc Mai')).toBeInTheDocument();

    // Initial students are still present
    expect(within(table).getByText('24127052')).toBeInTheDocument();
    expect(within(table).getByText('24127345')).toBeInTheDocument();
    expect(within(table).getByText('24127388')).toBeInTheDocument();

    // Roster count is now initial + 2
    const totalCount = initialStudents.length + 2;
    const countBadges = screen.getAllByText(String(totalCount));
    expect(countBadges.length).toBeGreaterThan(0);

    // Verify dynamic Uniqueness Violation check against newly added student (24127101)
    await user.type(idInput, '24127101');
    await user.type(nameInput, 'Another Long');
    await user.type(emailInput, 'anotherlong@student.hcmus.edu.vn');
    await user.click(submitButton);

    expect(screen.getByRole('alert')).toHaveTextContent(
      VALIDATION_MESSAGES.ID_UNIQUENESS_VIOLATION
    );
    expect(within(table).queryByText('Another Long')).not.toBeInTheDocument();
  });
});

