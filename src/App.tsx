import { useState } from 'react';
import EnrollmentForm from './components/EnrollmentForm';
import StudentRoster from './components/StudentRoster';
import initialStudentsData from './data/students.json';
import type { Student } from './types/student';

export default function App() {
  const [students, setStudents] = useState<Student[]>(
    initialStudentsData as Student[]
  );

  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [...prev, newStudent]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Portal Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                SP
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Student Portal
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  Client-Side Rendered (CSR) Student Management
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                CSR Active
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                Single Source of Truth
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portal Stats Summary */}
        <section aria-label="Portal summary" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Enrolled Students
            </span>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {students.length}
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Active Majors
            </span>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {new Set(students.map((s) => s.major)).size}
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              State Paradigm
            </span>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              Pure CSR
            </p>
          </div>
        </section>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <section aria-label="Enrollment Section" className="lg:col-span-5">
            <EnrollmentForm
              onAddStudent={handleAddStudent}
              existingStudents={students}
            />
          </section>

          <section aria-label="Roster Section" className="lg:col-span-7">
            <StudentRoster students={students} />
          </section>
        </div>
      </main>

      {/* Portal Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-4 text-center text-xs text-gray-500">
        <p>
          HCMUS Student Portal &bull; Client-Side Rendered (CSR) Single-Page Application &bull; Single Source of Truth
        </p>
      </footer>
    </div>
  );
}
