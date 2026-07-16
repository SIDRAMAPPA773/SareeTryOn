import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/config/api';

export const Route = createFileRoute('/admin/dashboard')({
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<any>(null);
  const [stats, setStats] = useState({ sarees: 0, catalogs: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, { credentials: 'include' });
        const data = await response.json();
        
        if (data.success && (data.admin.role === 'ADMIN' || data.admin.role === 'SUPERADMIN' || data.admin.role === 'SUPER_ADMIN')) {
          setAdmin(data.admin);
          fetchStats();
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

  const fetchStats = async () => {
    try {
      const [sareesRes, catalogsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/sarees`),
        fetch(`${API_BASE_URL}/catalogs`)
      ]);
      const sareesData = await sareesRes.json();
      const catalogsData = await catalogsRes.json();
      
      setStats({
        sarees: sareesData.success ? sareesData.count : 0,
        catalogs: catalogsData.success ? catalogsData.count : 0
      });
    } catch (error) {
      console.error('Failed to fetch stats');
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
    <div className="min-h-screen bg-gray-50">
      
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-primary">SareeTryOn Admin</span>
              <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                <Link to="/admin/dashboard" className="border-primary text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Overview
                </Link>
                <Link to="/admin/catalogs" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Manage Catalogs
                </Link>
                <Link to="/admin/sarees" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Manage Sarees
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-sm text-gray-600">Logged in as <strong>{admin?.username}</strong></span>
              <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:text-red-500">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">System Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Catalogs Stat Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg border">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary/10 rounded-md p-3">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Catalogs</dt>
                    <dd className="text-3xl font-semibold text-gray-900">{stats.catalogs}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/admin/catalogs" className="font-medium text-primary hover:text-primary/90">View and modify catalogs</Link>
              </div>
            </div>
          </div>

          {/* Sarees Stat Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg border">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary/10 rounded-md p-3">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Sarees</dt>
                    <dd className="text-3xl font-semibold text-gray-900">{stats.sarees}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/admin/sarees" className="font-medium text-primary hover:text-primary/90">View and modify sarees</Link>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
