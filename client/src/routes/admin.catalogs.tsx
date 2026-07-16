import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/config/api';

export const Route = createFileRoute('/admin/catalogs')({
  component: AdminCatalogs,
});

function AdminCatalogs() {
  const navigate = useNavigate();
  const [catalogs, setCatalogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, { credentials: 'include' });
        const data = await response.json();
        
        if (data.success && (data.admin.role === 'ADMIN' || data.admin.role === 'SUPERADMIN' || data.admin.role === 'SUPER_ADMIN')) {
          fetchCatalogs();
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

  const fetchCatalogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/catalogs`);
      const data = await response.json();
      if (data.success) {
        setCatalogs(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch catalogs');
    }
  };

  const handleCreateCatalog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      if (imageFile) {
        data.append('coverImage', imageFile);
      }

      const response = await fetch(`${API_BASE_URL}/catalogs`, {
        method: 'POST',
        credentials: 'include',
        body: data
      });
      const result = await response.json();
      
      if (result.success) {
        toast.success('Catalog created successfully');
        setIsCreateOpen(false);
        fetchCatalogs();
      } else {
        toast.error(result.message || 'Failed to create catalog');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCatalog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      if (imageFile) {
        data.append('coverImage', imageFile);
      }

      const response = await fetch(`${API_BASE_URL}/catalogs/${selectedCatalog._id}`, {
        method: 'PUT',
        credentials: 'include',
        body: data
      });
      const result = await response.json();
      
      if (result.success) {
        toast.success('Catalog updated successfully');
        setIsEditOpen(false);
        fetchCatalogs();
      } else {
        toast.error(result.message || 'Failed to update catalog');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this catalog?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/catalogs/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Catalog deleted');
        fetchCatalogs();
      } else {
        toast.error(data.message || 'Failed to delete catalog');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const openCreateModal = () => {
    setFormData({ name: '', description: '' });
    setImageFile(null);
    setIsCreateOpen(true);
  };

  const openEditModal = (catalog: any) => {
    setSelectedCatalog(catalog);
    setFormData({
      name: catalog.name || '',
      description: catalog.description || '',
    });
    setImageFile(null);
    setIsEditOpen(true);
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl rounded-lg bg-white p-6 shadow-md">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="text-gray-500 hover:text-gray-900 font-medium">
              &larr; Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 border-l pl-4">Manage Catalogs</h1>
          </div>
          <button 
            onClick={openCreateModal}
            className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            + Add New Catalog
          </button>
        </div>
        
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {catalogs.map((catalog: any) => (
              <div key={catalog._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow">
                {catalog.coverImage ? (
                  <img src={catalog.coverImage} alt={catalog.name} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                <div className="p-4 bg-white">
                  <h3 className="text-lg font-semibold">{catalog.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{catalog.description || "No description"}</p>
                  
                  <div className="flex gap-4 mt-4 pt-4 border-t">
                    <button onClick={() => openEditModal(catalog)} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit Catalog</button>
                    <button onClick={() => handleDelete(catalog._id)} className="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
                  </div>
                </div>
              </div>
            ))}
            {catalogs.length === 0 && (
              <div className="col-span-3 text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
                No catalogs created yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create / Edit Modal Form Component */}
      {(isCreateOpen || isEditOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">{isCreateOpen ? 'Create Catalog' : 'Edit Catalog'}</h2>
            <form onSubmit={isCreateOpen ? handleCreateCatalog : handleEditCatalog} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Catalog Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full rounded border p-2" placeholder="e.g. Summer Collection 2026" />
              </div>
              
              <div>
                <label className="block text-sm font-medium">Cover Image (Upload)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setImageFile(e.target.files[0]);
                    }
                  }} 
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary/10 file:text-primary
                    hover:file:bg-primary/20
                  " 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full rounded border p-2" placeholder="Describe this collection..." />
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
                  {isSubmitting ? 'Uploading...' : (isCreateOpen ? 'Create Catalog' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
