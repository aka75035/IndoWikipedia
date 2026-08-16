interface User {
  name: string;
  email: string;
  role: string;
  createdAt: Date | string;
}

interface RecentUsersProps {
  users: User[];
}

export default function RecentUsers({
  users,
}: RecentUsersProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Recent Users
        </h2>

        <a
          href="/admin/users"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All
        </a>
      </div>

      {users.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          No users found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="px-4 py-3 font-medium">
                  Name
                </th>

                <th className="px-4 py-3 font-medium">
                  Email
                </th>

                <th className="px-4 py-3 font-medium">
                  Role
                </th>

                <th className="px-4 py-3 font-medium">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.email}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-4 font-medium">
                    {user.name}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {user.email}
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-500">
                    {new Date(
                      user.createdAt
                    ).toLocaleDateString()}
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

