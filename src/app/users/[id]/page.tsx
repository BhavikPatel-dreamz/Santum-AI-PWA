'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useGetUserQuery } from '@/lib/store';

export default function UserDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  
  const { data: user, isLoading } = useGetUserQuery(id);

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <div className="p-8 text-center">User not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link href="/users" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Back to Users
      </Link>
      
      <div className="border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
        <p className="text-gray-600 mb-4">@{user.username}</p>
        
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Phone:</span> {user.phone}</p>
          <p><span className="font-medium">Website:</span> {user.website}</p>
        </div>

        <div className="mt-4 pt-4 border-t">
          <h3 className="font-semibold mb-2">Address</h3>
          <p className="text-sm text-gray-600">
            {user.address.suite}, {user.address.street}<br />
            {user.address.city}, {user.address.zipcode}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t">
          <h3 className="font-semibold mb-2">Company</h3>
          <p className="text-sm font-medium">{user.company.name}</p>
          <p className="text-sm text-gray-600">{user.company.catchPhrase}</p>
        </div>
      </div>
    </div>
  );
}