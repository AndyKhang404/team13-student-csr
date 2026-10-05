import React, { useState } from 'react';
import {
  AVAILABLE_MAJORS,
  type Major,
  type Student,
  type ValidationErrors,
} from '../types/student';
import {
  validateStudentField,
  validateStudentForm,
} from '../utils/validation';

export interface EnrollmentFormProps {
  onAddStudent: (student: Student) => void;
  existingStudents: Student[];
}

interface FormState {
  id: string;
  name: string;
  email: string;
  major: string;
}

const INITIAL_FORM_STATE: FormState = {
  id: '',
  name: '',
  email: '',
  major: AVAILABLE_MAJORS[0],
};

export default function EnrollmentForm({
  onAddStudent,
  existingStudents,
}: EnrollmentFormProps) {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (name: keyof Student, value: string) => {
    const error = validateStudentField(name, value, existingStudents);

    setErrors((prev) => {
      const updated = { ...prev };
      if (error) {
        updated[name] = error;
      } else {
        delete updated[name];
      }
      return updated;
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof Student;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    // Real-time inline validation feedback triggers immediately on input change
    validateField(fieldName, value);
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    validateField(name as keyof Student, value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formErrors = validateStudentForm(formData, existingStudents);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    onAddStudent({
      id: formData.id.trim(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      major: formData.major.trim() as Major,
    });

    setFormData(INITIAL_FORM_STATE);
    setErrors({});
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Enrollment Form</h2>
        <p className="text-sm text-gray-500 mt-1">
          Register a new prospective student into the client-side roster.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="student-id"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Student ID
          </label>
          <input
            id="student-id"
            name="id"
            type="text"
            placeholder="e.g. 24127052 (8 digits)"
            value={formData.id}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.id)}
            aria-describedby={errors.id ? 'student-id-error' : undefined}
            className={`w-full px-3.5 py-2 text-gray-900 border rounded-lg text-sm shadow-sm transition focus:outline-none focus:ring-2 ${
              errors.id
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
          {errors.id && (
            <p
              id="student-id-error"
              role="alert"
              className="mt-1.5 text-sm text-red-600 font-medium"
            >
              {errors.id}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="student-name"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            id="student-name"
            name="name"
            type="text"
            placeholder="e.g. Nguyễn Văn A"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'student-name-error' : undefined}
            className={`w-full px-3.5 py-2 text-gray-900 border rounded-lg text-sm shadow-sm transition focus:outline-none focus:ring-2 ${
              errors.name
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
          {errors.name && (
            <p
              id="student-name-error"
              role="alert"
              className="mt-1.5 text-sm text-red-600 font-medium"
            >
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="student-email"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Institutional Email
          </label>
          <input
            id="student-email"
            name="email"
            type="email"
            placeholder="e.g. 24127052@student.hcmus.edu.vn"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'student-email-error' : undefined}
            className={`w-full px-3.5 py-2 text-gray-900 border rounded-lg text-sm shadow-sm transition focus:outline-none focus:ring-2 ${
              errors.email
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
          {errors.email && (
            <p
              id="student-email-error"
              role="alert"
              className="mt-1.5 text-sm text-red-600 font-medium"
            >
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="student-major"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Academic Major
          </label>
          <select
            id="student-major"
            name="major"
            value={formData.major}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.major)}
            aria-describedby={errors.major ? 'student-major-error' : undefined}
            className={`w-full px-3.5 py-2 text-gray-900 bg-white border rounded-lg text-sm shadow-sm transition focus:outline-none focus:ring-2 ${
              errors.major
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          >
            {AVAILABLE_MAJORS.map((major) => (
              <option key={major} value={major}>
                {major}
              </option>
            ))}
          </select>
          {errors.major && (
            <p
              id="student-major-error"
              role="alert"
              className="mt-1.5 text-sm text-red-600 font-medium"
            >
              {errors.major}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
        >
          Enroll Student
        </button>
      </form>
    </div>
  );
}
