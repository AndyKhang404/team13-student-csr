# Ticket 004: UI Components (EnrollmentForm, StudentRoster, App)

## Status: BLOCKED
## Blocked By: Ticket 001, Ticket 002, Ticket 003

## Description
Build the user interface components in React with Tailwind CSS adhering to CSR single source of truth requirements.

## Acceptance Criteria
- `src/components/EnrollmentForm.tsx`:
  - Controlled inputs for `id`, `name`, `email`, `major` (select dropdown).
  - Validation error state displayed beneath corresponding fields on blur/change and on submit attempt.
  - Form submit handler calls `event.preventDefault()` to ensure no document request / page reload occurs.
  - Invokes `onAddStudent(newStudent)` on valid submission.
  - Automatically resets form inputs to blank/default state upon successful submit.
- `src/components/StudentRoster.tsx`:
  - Renders the list of students passed via props.
  - Shows student ID, name, email, and major badge.
  - Shows empty state if no students are present.
  - Displays total student count badge.
- `src/App.tsx`:
  - State owner for `Student Roster`: `const [students, setStudents] = useState<Student[]>(initialStudents)`.
  - Initialized with `src/data/students.json`.
  - Appends new student directly to state: `setStudents(prev => [...prev, newStudent])`.
  - Renders header, `EnrollmentForm`, and `StudentRoster` in a responsive layout.
