# Ticket 002: Domain Entity & Seed Data

## Status: BLOCKED
## Blocked By: Ticket 001

## Description
Define domain models for `Student` and initial seed data extracted from `README.md`.

## Acceptance Criteria
- `src/types/student.ts`: Defines `Student` interface with `id: string`, `name: string`, `email: string`, `major: string`.
- Also exports canonical list of supported majors (`Computer Science`, `Software Engineering`, `Information Technology`, `Information Systems`, `Data Science`, `Artificial Intelligence`).
- `src/data/students.json`: Pre-seeded with 3 records from `README.md`:
  - `24127052`, "Phùng Bảo Khang", `24127052@student.hcmus.edu.vn`, "Computer Science"
  - `24127345`, "Nguyễn Minh Đức", `24127345@student.hcmus.edu.vn`, "Software Engineering"
  - `24127388`, "Hy Huê Hưng", `24127388@student.hcmus.edu.vn`, "Information Technology"
- Unit test ensuring seed JSON adheres to `Student` schema and correctly reflects all 3 members.
