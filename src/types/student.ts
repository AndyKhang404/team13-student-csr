export interface Student {
  id: string;
  name: string;
  email: string;
  major: string;
}

export const AVAILABLE_MAJORS = [
  'Computer Science',
  'Software Engineering',
  'Information Technology',
  'Information Systems',
  'Data Science',
  'Artificial Intelligence',
] as const;

export type Major = (typeof AVAILABLE_MAJORS)[number];

export type StudentFormData = Partial<Student>;

export type ValidationErrors = Partial<Record<keyof Student, string>>;
