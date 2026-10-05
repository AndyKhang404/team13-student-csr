# Student Portal

A client-side rendered (CSR) web portal for registering students and managing their academic details in an in-memory client state.

## Language

**Student**:
A registered student entity characterized by a unique 8-digit identification number, full name, institutional email address, and academic major.
_Avoid_: User, member, account, record

**Student Roster**:
The in-memory collection of all currently registered students held in client state, acting as the application's single source of truth.
_Avoid_: Student table, student list state, record store, database

**Enrollment Form**:
The interactive user interface that captures, validates, and admits prospective students into the Student Roster without triggering page reloads or network document requests.
_Avoid_: Input form, entry screen, submit box

**Uniqueness Violation**:
A validation error condition occurring when an enrollment attempt submits a student ID that already belongs to an existing student in the Student Roster.
_Avoid_: Duplicate error, ID collision
