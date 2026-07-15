import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/config/api';

export const Route = createFileRoute('/admin/dashboard')({
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`);
        const data = await response.json();
        
        if (data.success && (data.admin.role === 'ADMIN' || data.admin.role === 'SUPERADMIN')) {
          setAdmin(data.admin);
        } else {
          toast.error('Unauthorized access');
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

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        <div className="mt-8">
          <p className="text-lg">Welcome, <strong>{admin?.username}</strong>!</p>
          <p className="mt-2 text-gray-600">Here you can manage sarees, inventory, and other store-related content.</p>
          
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded border p-4 shadow-sm">
              <h3 className="text-xl font-semibold">Manage Sarees</h3>
              <p className="mt-2 text-sm text-gray-500">Upload, edit, and delete saree designs.</p>
              <button className="mt-4 rounded bg-primary px-4 py-2 text-white">Go to Sarees</button>
            </div>
            {/* Additional admin sections can go here */}
          </div>
        </div>
      </div>
    </div>
  );
}
