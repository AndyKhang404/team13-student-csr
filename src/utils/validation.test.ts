import { describe, expect, it } from 'vitest';
import type { Student } from '../types/student';
import {
  validateStudentId,
  validateStudentName,
  validateStudentEmail,
  validateStudentMajor,
  validateStudentForm,
  VALIDATION_MESSAGES,
} from './validation';

describe('Validation Engine', () => {
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

  describe('validateStudentId', () => {
    it('returns error when student ID is empty or whitespace', () => {
      expect(validateStudentId('', sampleStudents)).toBe(VALIDATION_MESSAGES.ID_REQUIRED);
      expect(validateStudentId('   ', sampleStudents)).toBe(VALIDATION_MESSAGES.ID_REQUIRED);
    });

    it('returns error when student ID is not exactly 8 digits', () => {
      // Fewer than 8 digits
      expect(validateStudentId('1234567', sampleStudents)).toBe(VALIDATION_MESSAGES.ID_FORMAT);
      expect(validateStudentId('1', sampleStudents)).toBe(VALIDATION_MESSAGES.ID_FORMAT);

      // More than 8 digits
      expect(validateStudentId('123456789', sampleStudents)).toBe(VALIDATION_MESSAGES.ID_FORMAT);

      // Alphabetic characters
      expect(validateStudentId('abcdefgh', sampleStudents)).toBe(VALIDATION_MESSAGES.ID_FORMAT);

      // Alphanumeric mix
      expect(validateStudentId('2412abcd', sampleStudents)).toBe(VALIDATION_MESSAGES.ID_FORMAT);

      // Special characters
      expect(validateStudentId('2412-705', sampleStudents)).toBe(VALIDATION_MESSAGES.ID_FORMAT);
    });

    it('returns Uniqueness Violation error when student ID already exists in the roster', () => {
      const error = validateStudentId('24127052', sampleStudents);
      expect(error).toBe(VALIDATION_MESSAGES.ID_DUPLICATE);
      expect(error).toContain('Uniqueness Violation');
    });

    it('returns null for a valid, non-duplicate 8-digit student ID', () => {
      expect(validateStudentId('24127388', sampleStudents)).toBeNull();
      expect(validateStudentId('12345678', sampleStudents)).toBeNull();
    });
  });

  describe('validateStudentName', () => {
    it('returns error when name is empty or only whitespace', () => {
      expect(validateStudentName('')).toBe(VALIDATION_MESSAGES.NAME_REQUIRED);
      expect(validateStudentName('   ')).toBe(VALIDATION_MESSAGES.NAME_REQUIRED);
    });

    it('returns error when trimmed name is shorter than 2 characters', () => {
      expect(validateStudentName('A')).toBe(VALIDATION_MESSAGES.NAME_MIN_LENGTH);
      expect(validateStudentName(' B ')).toBe(VALIDATION_MESSAGES.NAME_MIN_LENGTH);
    });

    it('returns null for a valid name of 2 or more characters', () => {
      expect(validateStudentName('Al')).toBeNull();
      expect(validateStudentName('Phùng Bảo Khang')).toBeNull();
      expect(validateStudentName('  John Doe  ')).toBeNull();
    });
  });

  describe('validateStudentEmail', () => {
    it('returns error when email is empty or only whitespace', () => {
      expect(validateStudentEmail('')).toBe(VALIDATION_MESSAGES.EMAIL_REQUIRED);
      expect(validateStudentEmail('   ')).toBe(VALIDATION_MESSAGES.EMAIL_REQUIRED);
    });

    it('returns error when email syntax is invalid', () => {
      expect(validateStudentEmail('plainaddress')).toBe(VALIDATION_MESSAGES.EMAIL_FORMAT);
      expect(validateStudentEmail('missingatsign.com')).toBe(VALIDATION_MESSAGES.EMAIL_FORMAT);
      expect(validateStudentEmail('@missingusername.com')).toBe(VALIDATION_MESSAGES.EMAIL_FORMAT);
      expect(validateStudentEmail('user@')).toBe(VALIDATION_MESSAGES.EMAIL_FORMAT);
      expect(validateStudentEmail('user@domain')).toBe(VALIDATION_MESSAGES.EMAIL_FORMAT);
      expect(validateStudentEmail('user@.com')).toBe(VALIDATION_MESSAGES.EMAIL_FORMAT);
      expect(validateStudentEmail('user space@domain.com')).toBe(VALIDATION_MESSAGES.EMAIL_FORMAT);
    });

    it('returns null for valid email addresses', () => {
      expect(validateStudentEmail('24127052@student.hcmus.edu.vn')).toBeNull();
      expect(validateStudentEmail('john.doe@example.com')).toBeNull();
      expect(validateStudentEmail('user+test@sub.domain.org')).toBeNull();
    });
  });

  describe('validateStudentMajor', () => {
    it('returns error when major is empty or only whitespace', () => {
      expect(validateStudentMajor('')).toBe(VALIDATION_MESSAGES.MAJOR_REQUIRED);
      expect(validateStudentMajor('   ')).toBe(VALIDATION_MESSAGES.MAJOR_REQUIRED);
    });

    it('returns error when major is not an accepted institutional major', () => {
      expect(validateStudentMajor('Mechanical Engineering')).toBe(VALIDATION_MESSAGES.MAJOR_INVALID);
      expect(validateStudentMajor('Fine Arts')).toBe(VALIDATION_MESSAGES.MAJOR_INVALID);
      expect(validateStudentMajor('random')).toBe(VALIDATION_MESSAGES.MAJOR_INVALID);
    });

    it('returns null for valid available majors', () => {
      expect(validateStudentMajor('Computer Science')).toBeNull();
      expect(validateStudentMajor('Software Engineering')).toBeNull();
      expect(validateStudentMajor('Information Technology')).toBeNull();
      expect(validateStudentMajor('Information Systems')).toBeNull();
      expect(validateStudentMajor('Data Science')).toBeNull();
      expect(validateStudentMajor('Artificial Intelligence')).toBeNull();
    });
  });

  describe('validateStudentForm', () => {
    it('returns empty errors object when all fields are valid and ID is unique', () => {
      const validData = {
        id: '24127388',
        name: 'Hy Huê Hưng',
        email: '24127388@student.hcmus.edu.vn',
        major: 'Information Technology',
      };

      const errors = validateStudentForm(validData, sampleStudents);
      expect(errors).toEqual({});
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('returns errors for all missing/empty fields on blank form submission', () => {
      const blankData = {};
      const errors = validateStudentForm(blankData, sampleStudents);

      expect(errors.id).toBe(VALIDATION_MESSAGES.ID_REQUIRED);
      expect(errors.name).toBe(VALIDATION_MESSAGES.NAME_REQUIRED);
      expect(errors.email).toBe(VALIDATION_MESSAGES.EMAIL_REQUIRED);
      expect(errors.major).toBe(VALIDATION_MESSAGES.MAJOR_REQUIRED);
    });

    it('detects Uniqueness Violation on duplicate student ID during form validation', () => {
      const duplicateData = {
        id: '24127052',
        name: 'Another Student',
        email: 'another@example.com',
        major: 'Computer Science',
      };

      const errors = validateStudentForm(duplicateData, sampleStudents);
      expect(errors.id).toBe(VALIDATION_MESSAGES.ID_DUPLICATE);
      expect(errors.id).toContain('Uniqueness Violation');
      expect(errors.name).toBeUndefined();
      expect(errors.email).toBeUndefined();
      expect(errors.major).toBeUndefined();
    });

    it('accumulates multiple field validation errors simultaneously', () => {
      const invalidData = {
        id: '123', // malformed
        name: 'A', // too short
        email: 'not-an-email', // malformed
        major: 'InvalidMajor', // not allowed
      };

      const errors = validateStudentForm(invalidData, sampleStudents);
      expect(errors.id).toBe(VALIDATION_MESSAGES.ID_FORMAT);
      expect(errors.name).toBe(VALIDATION_MESSAGES.NAME_MIN_LENGTH);
      expect(errors.email).toBe(VALIDATION_MESSAGES.EMAIL_FORMAT);
      expect(errors.major).toBe(VALIDATION_MESSAGES.MAJOR_INVALID);
    });

    it('handles undefined or partial fields gracefully without crashing', () => {
      const partialData = {
        name: 'Phùng Bảo Khang',
      };

      const errors = validateStudentForm(partialData, sampleStudents);
      expect(errors.name).toBeUndefined();
      expect(errors.id).toBe(VALIDATION_MESSAGES.ID_REQUIRED);
      expect(errors.email).toBe(VALIDATION_MESSAGES.EMAIL_REQUIRED);
      expect(errors.major).toBe(VALIDATION_MESSAGES.MAJOR_REQUIRED);
    });
  });
});
