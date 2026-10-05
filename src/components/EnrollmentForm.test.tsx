import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import EnrollmentForm from './EnrollmentForm';
import { AVAILABLE_MAJORS, type Student } from '../types/student';
import { VALIDATION_MESSAGES } from '../utils/validation';

describe('EnrollmentForm', () => {
  const existingStudents: Student[] = [
    {
      id: '24127052',
      name: 'Phùng Bảo Khang',
      email: '24127052@student.hcmus.edu.vn',
      major: 'Computer Science',
    },
  ];

  it('renders form inputs and submit button with default values', () => {
    const onAddStudent = vi.fn();
    render(<EnrollmentForm onAddStudent={onAddStudent} existingStudents={existingStudents} />);

    expect(screen.getByRole('heading', { name: /enrollment form/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/student id/i)).toHaveValue('');
    expect(screen.getByLabelText(/full name|student name/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/major/i)).toHaveValue(AVAILABLE_MAJORS[0]);
    expect(screen.getByRole('button', { name: /enroll student|add student/i })).toBeInTheDocument();
  });

  it('updates input values when typing (controlled inputs)', async () => {
    const user = userEvent.setup();
    const onAddStudent = vi.fn();
    render(<EnrollmentForm onAddStudent={onAddStudent} existingStudents={existingStudents} />);

    const idInput = screen.getByLabelText(/student id/i);
    const nameInput = screen.getByLabelText(/full name|student name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const majorSelect = screen.getByLabelText(/major/i);

    await user.type(idInput, '24127345');
    await user.type(nameInput, 'Nguyễn Minh Đức');
    await user.type(emailInput, '24127345@student.hcmus.edu.vn');
    await user.selectOptions(majorSelect, 'Software Engineering');

    expect(idInput).toHaveValue('24127345');
    expect(nameInput).toHaveValue('Nguyễn Minh Đức');
    expect(emailInput).toHaveValue('24127345@student.hcmus.edu.vn');
    expect(majorSelect).toHaveValue('Software Engineering');
  });

  it('displays validation errors on blur for invalid inputs', async () => {
    const user = userEvent.setup();
    const onAddStudent = vi.fn();
    render(<EnrollmentForm onAddStudent={onAddStudent} existingStudents={existingStudents} />);

    const idInput = screen.getByLabelText(/student id/i);
    await user.type(idInput, '123');
    await user.tab();

    expect(screen.getByRole('alert')).toHaveTextContent(VALIDATION_MESSAGES.ID_FORMAT);

    const nameInput = screen.getByLabelText(/full name|student name/i);
    await user.type(nameInput, 'A');
    await user.tab();

    expect(screen.getByText(VALIDATION_MESSAGES.NAME_MIN_LENGTH)).toBeInTheDocument();

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'not-an-email');
    await user.tab();

    expect(screen.getByText(VALIDATION_MESSAGES.EMAIL_FORMAT)).toBeInTheDocument();
  });

  it('displays Uniqueness Violation error if student ID already exists', async () => {
    const user = userEvent.setup();
    const onAddStudent = vi.fn();
    render(<EnrollmentForm onAddStudent={onAddStudent} existingStudents={existingStudents} />);

    const idInput = screen.getByLabelText(/student id/i);
    await user.type(idInput, '24127052');
    await user.tab();

    expect(screen.getByRole('alert')).toHaveTextContent(VALIDATION_MESSAGES.ID_DUPLICATE);
  });

  it('clears error message when input is corrected', async () => {
    const user = userEvent.setup();
    const onAddStudent = vi.fn();
    render(<EnrollmentForm onAddStudent={onAddStudent} existingStudents={existingStudents} />);

    const idInput = screen.getByLabelText(/student id/i);
    await user.type(idInput, '123');
    await user.tab();

    expect(screen.getByText(VALIDATION_MESSAGES.ID_FORMAT)).toBeInTheDocument();

    await user.type(idInput, '45678');
    // Field should clear error once valid
    expect(screen.queryByText(VALIDATION_MESSAGES.ID_FORMAT)).not.toBeInTheDocument();
  });

  it('validates all fields on submit attempt and prevents submission if invalid', async () => {
    const user = userEvent.setup();
    const onAddStudent = vi.fn();
    render(<EnrollmentForm onAddStudent={onAddStudent} existingStudents={existingStudents} />);

    const submitButton = screen.getByRole('button', { name: /enroll student|add student/i });
    await user.click(submitButton);

    expect(screen.getByText(VALIDATION_MESSAGES.ID_REQUIRED)).toBeInTheDocument();
    expect(screen.getByText(VALIDATION_MESSAGES.NAME_REQUIRED)).toBeInTheDocument();
    expect(screen.getByText(VALIDATION_MESSAGES.EMAIL_REQUIRED)).toBeInTheDocument();
    expect(onAddStudent).not.toHaveBeenCalled();
  });

  it('explicitly calls event.preventDefault() upon form submission', () => {
    const onAddStudent = vi.fn();
    const { container } = render(
      <EnrollmentForm onAddStudent={onAddStudent} existingStudents={existingStudents} />
    );

    const form = container.querySelector('form');
    expect(form).not.toBeNull();

    const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
    const preventDefaultSpy = vi.spyOn(submitEvent, 'preventDefault');

    fireEvent(form!, submitEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('submits valid student, calls onAddStudent, and resets form fields to initial state', async () => {
    const user = userEvent.setup();
    const onAddStudent = vi.fn();
    render(<EnrollmentForm onAddStudent={onAddStudent} existingStudents={existingStudents} />);

    const idInput = screen.getByLabelText(/student id/i);
    const nameInput = screen.getByLabelText(/full name|student name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const majorSelect = screen.getByLabelText(/major/i);

    await user.type(idInput, '24127388');
    await user.type(nameInput, 'Hy Huê Hưng');
    await user.type(emailInput, '24127388@student.hcmus.edu.vn');
    await user.selectOptions(majorSelect, 'Information Technology');

    const submitButton = screen.getByRole('button', { name: /enroll student|add student/i });
    await user.click(submitButton);

    expect(onAddStudent).toHaveBeenCalledTimes(1);
    expect(onAddStudent).toHaveBeenCalledWith({
      id: '24127388',
      name: 'Hy Huê Hưng',
      email: '24127388@student.hcmus.edu.vn',
      major: 'Information Technology',
    });

    // Verify form fields reset to initial state
    expect(idInput).toHaveValue('');
    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(majorSelect).toHaveValue(AVAILABLE_MAJORS[0]);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
