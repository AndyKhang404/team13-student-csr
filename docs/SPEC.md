# Specification: CSR Student Portal

## Problem Statement

Academic administrators and faculty members need a lightweight, responsive web portal to view and register students without suffering the performance penalties, flash-of-unstyled-content, and disorienting page reloads of traditional multi-page document requests. When submitting new student registrations, users expect immediate feedback, clean form states, strict client-side validation against duplicate IDs or malformed data, and instantaneous roster updates, where client state serves as the authoritative single source of truth.

## Solution

A Client-Side Rendered (CSR) Single-Page Application (SPA) built with React and TypeScript, styled with Tailwind CSS, and initialized with seeded student data from `README.md`. The portal hosts two primary cohesive sections: an interactive **Enrollment Form** and a **Student Roster**. All interactions—including validation, state updates, form resets, and roster rendering—operate exclusively on client-side state without triggering any HTTP document requests or page reloads.

## User Stories

1. As an academic administrator, I want the portal to load with initial student records pre-populated from `README.md`, so that I can immediately review current students without manual data entry.
2. As an academic administrator, I want to see each student's ID, full name, institutional email address, and major clearly displayed in the Student Roster, so that I have a complete profile of each learner.
3. As an academic administrator, I want the Student Roster to be rendered from client-side state, so that changes can be reflected instantly without page reloads.
4. As an academic administrator, I want the Enrollment Form to reject an empty Student ID, so that every enrolled student has a valid identifier.
5. As an academic administrator, I want the Enrollment Form to validate that a Student ID contains exactly 8 numeric digits, so that it conforms to HCMUS institutional identity standards.
6. As an academic administrator, I want the Enrollment Form to check the Student ID against the current Student Roster and flag a Uniqueness Violation, so that duplicate student records cannot be created.
7. As an academic administrator, I want the Enrollment Form to validate that the Student Name is non-empty and contains at least 2 characters, so that incomplete names are caught before submission.
8. As an academic administrator, I want the Enrollment Form to validate that the Email conforms to standard email syntax, so that communications reach valid addresses.
9. As an academic administrator, I want to select a Student Major from a standardized dropdown list, so that majors remain consistent and typo-free across the roster.
10. As an academic administrator, I want to see inline validation feedback when a field loses focus (blur) or changes, so that I can correct errors before attempting submission.
11. As an academic administrator, I want the Submit button to execute a full validation check across all fields, so that invalid data cannot be added under any circumstances.
12. As an academic administrator, I want form submission to prevent the browser's default form submit behavior, so that the page does not reload and no network document requests are dispatched.
13. As an academic administrator, I want the newly enrolled student to appear immediately in the Student Roster upon successful submission, so that I have zero waiting time and no UI flicker.
14. As an academic administrator, I want all input fields in the Enrollment Form to reset to their blank/initial state upon successful submission, so that the form is immediately ready for another entry.
15. As an academic administrator, I want validation error messages to disappear as soon as I correct the corresponding input, so that I know my changes are valid.
16. As an academic administrator, I want the client state to serve as the single source of truth, so that adding students persists in-memory throughout the browsing session.
17. As a student portal developer, I want a clear component and state owner diagram, so that I understand where state resides and how props and actions flow across the application hierarchy.

## Implementation Decisions

- **Architectural Paradigm**: Pure Client-Side Rendering (CSR) with Vite, React, and TypeScript. No Server-Side Rendering (SSR) or full-page HTML navigation.
- **Seeded Data Storage**: Initial student data seeded directly into a structured JSON file containing the three members from `README.md` (`24127052`, `24127345`, `24127388`) with email format `<id>@student.hcmus.edu.vn` and assigned Computer Science / Information Technology majors.
- **State Ownership Hierarchy**:
  - The root Portal component acts as the state owner for the `Student Roster` (`students` state).
  - The `Enrollment Form` component maintains local form control state (`formData` and `errors`) for field inputs and error validation states.
  - On valid submission, the `Enrollment Form` calls an `onAddStudent(newStudent)` callback owned by the Portal component to append the student to the `students` state.
- **Form Submission & Event Handling**: The form submission handler explicitly invokes `event.preventDefault()` to prevent native browser form submission, guaranteeing zero document requests in the Network panel.
- **Validation Engine**:
  - Pure validation functions that inspect input fields and check `id` uniqueness against the current `students` list.
  - Validation triggers on both field blur/change and form submission.
- **Form Reset**: State reset is triggered via standard React state initialization upon successful submission.
- **Visual Design**: Clean, accessible portal layout using Tailwind CSS with responsive tables/cards, badge styling for academic majors, and accessible form labels and error alerts.

## Testing Decisions

- **Testing Philosophy**: Test only external behavior from the user's perspective, avoiding assertions on private component state or internal React implementation details.
- **Test Seam**: A single high-level component integration seam at the root Portal level.
  - The test mounts the top-level portal component.
  - The test interacts with user-facing elements using accessible queries (`getByRole('textbox', ...)`, `getByRole('button', ...)`).
  - The test verifies:
    1. Initial rendering of the seeded Student Roster from `README.md`.
    2. Input validation triggers on invalid fields (invalid ID format, duplicate ID, empty name, bad email).
    3. State mutation and immediate roster update upon valid submission.
    4. Form input clearing/reset post-submission.
    5. Prevention of page reloads / submission lifecycle.
- **Prior Art**: Modern testing patterns using Vitest and React Testing Library (`@testing-library/react` and `@testing-library/user-event`).

## Out of Scope

- Remote backend API endpoints (REST/GraphQL) or database persistence (PostgreSQL/MongoDB).
- Persistent browser storage (`localStorage` / `sessionStorage`) beyond the in-memory client state session.
- Student record deletion, editing, or sorting features (future phase).
- Authentication and role-based access control (RBAC).

## Further Notes

- After code implementation, a comprehensive Mermaid component and state ownership diagram will be documented in `README.md` and architectural documentation.
