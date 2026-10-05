import { describe, expect, it } from 'vitest';
import studentsData from './students.json';
import { AVAILABLE_MAJORS, type Student } from '../types/student';

describe('Seed Student Data', () => {
  const students: Student[] = studentsData as Student[];

  it('contains exactly 3 seed students', () => {
    expect(students).toHaveLength(3);
  });

  it('contains all 3 students from README.md with correct attributes', () => {
    expect(students).toEqual([
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
    ]);
  });

  it('validates each student conforms to the Student schema', () => {
    const eightDigitRegex = /^\d{8}$/;
    const hcmusEmailRegex = /^\d{8}@student\.hcmus\.edu\.vn$/;

    students.forEach((student) => {
      expect(typeof student.id).toBe('string');
      expect(student.id).toMatch(eightDigitRegex);

      expect(typeof student.name).toBe('string');
      expect(student.name.trim().length).toBeGreaterThanOrEqual(2);

      expect(typeof student.email).toBe('string');
      expect(student.email).toMatch(hcmusEmailRegex);

      expect(typeof student.major).toBe('string');
      expect(AVAILABLE_MAJORS).toContain(student.major);
    });
  });

  it('ensures all seed students have unique IDs', () => {
    const ids = students.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(students.length);
  });
});
