# Ticket 003: Validation Engine

## Status: COMPLETED
## Blocked By: None (Tickets 001, 002 completed)

## Description
Implement pure validation functions for the Enrollment Form to enforce institutional rules and prevent Uniqueness Violations.

## Acceptance Criteria
- `src/utils/validation.ts`:
  - `validateStudentId(id: string, existingStudents: Student[]): string | null`
    - Checks required (non-empty)
    - Checks exactly 8 digits (`/^\d{8}$/`)
    - Checks uniqueness against `existingStudents` (flags Uniqueness Violation if already present)
  - `validateStudentName(name: string): string | null`
    - Checks required, trimmed length >= 2
  - `validateStudentEmail(email: string): string | null`
    - Checks required, valid email syntax regex
  - `validateStudentMajor(major: string): string | null`
    - Checks non-empty and valid selected major
  - `validateStudentForm(formData: StudentFormData, existingStudents: Student[]): ValidationErrors`
- Comprehensive unit tests in `src/utils/validation.test.ts` covering:
  - Valid student submission
  - Missing fields
  - Malformed student IDs (alphabetic, < 8 digits, > 8 digits)
  - Duplicate student ID (Uniqueness Violation)
  - Malformed email address
  - Invalid / empty major
