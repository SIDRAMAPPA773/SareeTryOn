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
  const [sarees, setSarees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSaree, setSelectedSaree] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    color: '',
    fabric: '',
    description: '',
    imageUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, { credentials: 'include' });
        const data = await response.json();
        
        if (data.success && (data.admin.role === 'ADMIN' || data.admin.role === 'SUPERADMIN' || data.admin.role === 'SUPER_ADMIN')) {
          setAdmin(data.admin);
          fetchSarees();
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

  const fetchSarees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sarees`);
      const data = await response.json();
      if (data.success) {
        setSarees(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch sarees');
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

  const handleCreateSaree = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/sarees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Saree created successfully');
        setIsCreateOpen(false);
        fetchSarees();
      } else {
        toast.error(data.message || 'Failed to create saree');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSaree = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/sarees/${selectedSaree._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Saree updated successfully');
        setIsEditOpen(false);
        fetchSarees();
      } else {
        toast.error(data.message || 'Failed to update saree');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saree?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/sarees/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Saree deleted');
        fetchSarees();
      } else {
        toast.error(data.message || 'Failed to delete saree');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const openCreateModal = () => {
    setFormData({ name: '', category: '', color: '', fabric: '', description: '', imageUrl: '' });
    setIsCreateOpen(true);
  };

  const openEditModal = (saree: any) => {
    setSelectedSaree(saree);
    setFormData({
      name: saree.name || '',
      category: saree.category || '',
      color: saree.color || '',
      fabric: saree.fabric || '',
      description: saree.description || '',
      imageUrl: saree.imageUrl || ''
    });
    setIsEditOpen(true);
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
          
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Saree Catalog</h3>
              <button 
                onClick={openCreateModal}
                className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
              >
                + Add New Saree
              </button>
            </div>
            
            <div className="mt-4 overflow-hidden rounded border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Color</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sarees.map((saree: any) => (
                    <tr key={saree._id}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <img src={saree.imageUrl} alt={saree.name} className="h-12 w-12 rounded object-cover" />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">{saree.name}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-500">{saree.category}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-500">{saree.color}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <button onClick={() => openEditModal(saree)} className="mr-4 text-indigo-600 hover:text-indigo-900">Edit</button>
                        <button onClick={() => handleDelete(saree._id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {sarees.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No sarees found in catalog</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit Modal Form Component */}
      {(isCreateOpen || isEditOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl my-8">
            <h2 className="mb-4 text-xl font-bold">{isCreateOpen ? 'Add New Saree' : 'Edit Saree'}</h2>
            <form onSubmit={isCreateOpen ? handleCreateSaree : handleEditSaree} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full rounded border p-2" placeholder="e.g. Crimson Red Banarasi" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Category</label>
                  <input required type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="mt-1 block w-full rounded border p-2" placeholder="e.g. Silk" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Fabric</label>
                  <input required type="text" value={formData.fabric} onChange={(e) => setFormData({...formData, fabric: e.target.value})} className="mt-1 block w-full rounded border p-2" placeholder="e.g. Pure Silk" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Color</label>
                <input required type="text" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="mt-1 block w-full rounded border p-2" placeholder="e.g. Red" />
              </div>
              <div>
                <label className="block text-sm font-medium">Image URL</label>
                <input required type="url" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="mt-1 block w-full rounded border p-2" placeholder="https://example.com/image.jpg" />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img src={formData.imageUrl} alt="Preview" className="h-24 w-24 rounded object-cover border" onError={(e) => (e.currentTarget.style.display = 'none')} onLoad={(e) => (e.currentTarget.style.display = 'block')} />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full rounded border p-2" placeholder="Saree description..." />
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
                  {isSubmitting ? 'Saving...' : (isCreateOpen ? 'Create Saree' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
