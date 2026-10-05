import {
  AVAILABLE_MAJORS,
  type Major,
  type Student,
  type StudentFormData,
  type ValidationErrors,
} from '../types/student';

export type { StudentFormData, ValidationErrors };

export const STUDENT_ID_REGEX = /^\d{8}$/;

export const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

export const VALIDATION_MESSAGES = {
  ID_REQUIRED: 'Student ID is required.',
  ID_FORMAT: 'Student ID must be exactly 8 digits.',
  ID_UNIQUENESS_VIOLATION:
    'Uniqueness Violation: A student with this ID already exists in the Student Roster.',
  NAME_REQUIRED: 'Student name is required.',
  NAME_MIN_LENGTH: 'Student name must be at least 2 characters.',
  EMAIL_REQUIRED: 'Email is required.',
  EMAIL_FORMAT: 'Invalid email address format.',
  MAJOR_REQUIRED: 'Major is required.',
  MAJOR_INVALID: 'Please select a valid major.',
} as const;

/**
 * Validates a student ID:
 * - Must be non-empty.
 * - Must be exactly 8 numeric digits (/^\d{8}$/).
 * - Must not already exist in the Student Roster (Uniqueness Violation).
 */
export const validateStudentId = (
  id: string,
  existingStudents: Student[] = []
): string | null => {
  if (!id || id.trim() === '') {
    return VALIDATION_MESSAGES.ID_REQUIRED;
  }

  const trimmedId = id.trim();
  if (!STUDENT_ID_REGEX.test(trimmedId)) {
    return VALIDATION_MESSAGES.ID_FORMAT;
  }

  const isDuplicate = existingStudents.some((student) => student.id === trimmedId);
  if (isDuplicate) {
    return VALIDATION_MESSAGES.ID_UNIQUENESS_VIOLATION;
  }

  return null;
};

/**
 * Validates a student name:
 * - Must be non-empty.
 * - Trimmed length must be at least 2 characters.
 */
export const validateStudentName = (name: string): string | null => {
  if (!name || name.trim() === '') {
    return VALIDATION_MESSAGES.NAME_REQUIRED;
  }

  if (name.trim().length < 2) {
    return VALIDATION_MESSAGES.NAME_MIN_LENGTH;
  }

  return null;
};

/**
 * Validates a student email address:
 * - Must be non-empty.
 * - Must match standard email syntax.
 */
export const validateStudentEmail = (email: string): string | null => {
  if (!email || email.trim() === '') {
    return VALIDATION_MESSAGES.EMAIL_REQUIRED;
  }

  const trimmedEmail = email.trim();
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return VALIDATION_MESSAGES.EMAIL_FORMAT;
  }

  return null;
};

/**
 * Validates a student major:
 * - Must be non-empty.
 * - Must be one of the institutional available majors.
 */
export const validateStudentMajor = (major: string): string | null => {
  if (!major || major.trim() === '') {
    return VALIDATION_MESSAGES.MAJOR_REQUIRED;
  }

  const trimmedMajor = major.trim();
  if (!AVAILABLE_MAJORS.includes(trimmedMajor as Major)) {
    return VALIDATION_MESSAGES.MAJOR_INVALID;
  }

  return null;
};

/**
 * Validates a single student field by name:
 * Delegates to the corresponding individual validator.
 */
export const validateStudentField = (
  name: keyof Student,
  value: string,
  existingStudents: Student[] = []
): string | null => {
  switch (name) {
    case 'id':
      return validateStudentId(value, existingStudents);
    case 'name':
      return validateStudentName(value);
    case 'email':
      return validateStudentEmail(value);
    case 'major':
      return validateStudentMajor(value);
    default:
      return null;
  }
};

/**
 * Validates all student form fields and aggregates any validation errors.
 * Returns an empty object if all fields are valid.
 */
export const validateStudentForm = (
  formData: StudentFormData,
  existingStudents: Student[] = []
): ValidationErrors => {
  const errors: ValidationErrors = {};
  const fields: (keyof Student)[] = ['id', 'name', 'email', 'major'];

  for (const field of fields) {
    const error = validateStudentField(field, formData[field] ?? '', existingStudents);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
};
