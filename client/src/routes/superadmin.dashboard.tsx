import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/config/api';

export const Route = createFileRoute('/superadmin/dashboard')({
  component: SuperadminDashboard,
});

function SuperadminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<any>(null);
  const [adminsList, setAdminsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, { credentials: 'include' });
        const data = await response.json();
        
        if (data.success && data.admin.role === 'SUPERADMIN') {
          setAdmin(data.admin);
          fetchAdmins();
        } else {
          toast.error('Superadmin access required');
          navigate({ to: '/admin/login' });
        }
      } catch (error) {
        navigate({ to: '/admin/login' });
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchAdmins = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/superadmin/admins`, { credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        setAdminsList(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch admins');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
      toast.success('Logged out successfully');
      navigate({ to: '/admin/login' });
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl rounded-lg bg-white p-6 shadow-md">
        <div className="flex items-center justify-between border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Superadmin Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        <div className="mt-8">
          <p className="text-lg">Welcome, <strong>{admin?.username}</strong>!</p>
          <p className="mt-2 text-gray-600">You have full control to manage Admin accounts.</p>
          
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Admin Accounts</h3>
              <button className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90">
                + Create Admin
              </button>
            </div>
            
            <div className="mt-4 overflow-hidden rounded border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {adminsList.map((a: any) => (
                    <tr key={a._id}>
                      <td className="whitespace-nowrap px-6 py-4">{a.username}</td>
                      <td className="whitespace-nowrap px-6 py-4">{a.email}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${a.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {a.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {adminsList.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No admins found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
