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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Gradient matching Storefront */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/20" />

      {/* Top Navbar */}
      <nav className="glass-premium sticky top-0 z-50 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <span className="text-2xl font-serif font-bold text-primary tracking-wide flex items-center gap-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Virtual Couture <span className="text-muted-foreground/60 font-sans text-sm tracking-widest font-normal uppercase ml-2">Admin</span>
              </span>
              <div className="hidden sm:ml-12 sm:flex sm:space-x-8">
                <Link to="/admin/dashboard" className="border-primary text-foreground inline-flex items-center px-1 pt-1 border-b-2 text-xs uppercase tracking-[0.2em] font-semibold transition-colors">
                  Overview
                </Link>
                <Link to="/admin/catalogs" className="border-transparent text-muted-foreground hover:border-border hover:text-foreground inline-flex items-center px-1 pt-1 border-b-2 text-xs uppercase tracking-[0.2em] font-medium transition-colors">
                  Catalogs
                </Link>
                <Link to="/admin/sarees" className="border-transparent text-muted-foreground hover:border-border hover:text-foreground inline-flex items-center px-1 pt-1 border-b-2 text-xs uppercase tracking-[0.2em] font-medium transition-colors">
                  Sarees
                </Link>
                <Link to="/" className="border-transparent text-primary/70 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-xs uppercase tracking-[0.2em] font-medium transition-colors ml-4">
                  Storefront &rarr;
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Admin</div>
                <div className="text-sm font-semibold text-foreground">{admin?.username}</div>
              </div>
              <button 
                onClick={handleLogout} 
                className="btn-gold px-6 py-2 text-[10px] font-semibold tracking-[0.2em] uppercase rounded-full"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 reveal-up">
        <div className="mb-12">
          <div className="text-xs uppercase tracking-[0.32em] text-primary">Command Center</div>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl text-foreground">System Overview</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Catalogs Stat Card */}
          <Link to="/admin/catalogs" className="group glass-premium rounded-2xl p-8 hover:-translate-y-2 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 cursor-pointer block border border-border/50">
            <div className="flex items-start justify-between">
              <div className="bg-primary/5 p-4 rounded-xl group-hover:bg-primary/10 transition-colors">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Catalogs</div>
                <div className="font-serif text-5xl text-foreground mt-2">{stats.catalogs}</div>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary opacity-80 group-hover:opacity-100 transition-opacity">
              <span>Manage Collections</span>
              <span>&rarr;</span>
            </div>
          </Link>

          {/* Sarees Stat Card */}
          <Link to="/admin/sarees" className="group glass-premium rounded-2xl p-8 hover:-translate-y-2 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 cursor-pointer block border border-border/50">
            <div className="flex items-start justify-between">
              <div className="bg-primary/5 p-4 rounded-xl group-hover:bg-primary/10 transition-colors">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Sarees</div>
                <div className="font-serif text-5xl text-foreground mt-2">{stats.sarees}</div>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary opacity-80 group-hover:opacity-100 transition-opacity">
              <span>Manage Inventory</span>
              <span>&rarr;</span>
            </div>
          </Link>
          
        </div>
      </main>
    </div>
  );
}
