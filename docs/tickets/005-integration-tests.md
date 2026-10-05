# Ticket 005: High-Level Integration Tests

## Status: BLOCKED
## Blocked By: Ticket 004

## Description
Implement the high-level integration test suite at the `<App />` root seam using Vitest and React Testing Library.

## Acceptance Criteria
- Integration tests in `src/App.test.tsx` verifying:
  - Initial rendering of all 3 students from `README.md` (Phùng Bảo Khang, Nguyễn Minh Đức, Hy Huê Hưng).
  - Validation blocking submission when fields are blank.
  - Inline error feedback for invalid student ID, invalid email format, and empty name.
  - Uniqueness Violation triggered when entering an existing ID (e.g., `24127052`).
  - Successful submission adds new student immediately to the rendered roster.
  - Form fields reset to empty after successful submission.
  - Form submission does NOT trigger native document reload / navigation (`preventDefault` called).
- All tests pass with zero warnings/errors.
