'use client';

import Link from 'next/link';
import { useGetUsersQuery } from '@/lib/store';

export default function UsersPage() {
  const { data: users, isLoading } = useGetUsersQuery();

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        {users?.map((user) => (
          <Link
            key={user.id}
            href={`/users/${user.id}`}
            className="block p-4 border rounded hover:bg-gray-50 transition"
          >
            <h2 className="font-semibold text-lg">{user.name}</h2>
            <p className="text-gray-600 text-sm">{user.email}</p>
            <p className="text-gray-500 text-xs mt-1">@{user.username}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}