import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StudentRoster from './StudentRoster';
import type { Student } from '../types/student';

describe('StudentRoster', () => {
  const sampleStudents: Student[] = [
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
  ];

  it('renders student roster heading and total count badge', () => {
    render(<StudentRoster students={sampleStudents} />);

    expect(screen.getByRole('heading', { name: /student roster/i })).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders table headers and student details for each enrolled student', () => {
    render(<StudentRoster students={sampleStudents} />);

    expect(screen.getByRole('columnheader', { name: /student id/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /full name|name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /major/i })).toBeInTheDocument();

    sampleStudents.forEach((student) => {
      expect(screen.getByText(student.id)).toBeInTheDocument();
      expect(screen.getByText(student.name)).toBeInTheDocument();
      expect(screen.getByText(student.email)).toBeInTheDocument();
      expect(screen.getByText(student.major)).toBeInTheDocument();
    });
  });

  it('renders styled badge for majors', () => {
    render(<StudentRoster students={sampleStudents} />);

    const csBadge = screen.getByText('Computer Science');
    expect(csBadge).toBeInTheDocument();
    expect(csBadge.className).toMatch(/rounded|badge|px-/i);
  });

  it('renders empty state message when students list is empty', () => {
    render(<StudentRoster students={[]} />);

    expect(screen.getByRole('heading', { name: /student roster/i })).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText(/no students/i)).toBeInTheDocument();
  });
});
