import type { Major, Student } from '../types/student';

export interface StudentRosterProps {
  students: Student[];
}

const getMajorBadgeStyle = (major: Major | string): string => {
  switch (major) {
    case 'Computer Science':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Software Engineering':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Information Technology':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Information Systems':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'Data Science':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Artificial Intelligence':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function StudentRoster({ students }: StudentRosterProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">Student Roster</h2>
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800"
              aria-label={`Total students: ${students.length}`}
            >
              {students.length}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Authoritative in-memory client state holding currently registered learners.
          </p>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No students enrolled yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Use the Enrollment Form to register prospective students into the portal.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Student ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Full Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Major
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900">
                    {student.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getMajorBadgeStyle(
                        student.major
                      )}`}
                    >
                      {student.major}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
