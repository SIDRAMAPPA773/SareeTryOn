import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/config/api';

export const Route = createFileRoute('/admin/sarees')({
  component: AdminSarees,
});

function AdminSarees() {
  const navigate = useNavigate();
  const [sarees, setSarees] = useState<any[]>([]);
  const [catalogs, setCatalogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSaree, setSelectedSaree] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    catalogId: '',
    category: '', // Used as fallback or if catalogId is not set
    color: '',
    fabric: '',
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
          fetchSarees();
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

  const handleCreateSaree = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('color', formData.color);
      data.append('fabric', formData.fabric);
      data.append('description', formData.description);
      if (formData.catalogId) data.append('catalogId', formData.catalogId);
      if (imageFile) {
        data.append('image', imageFile);
      } else {
        toast.error('Please upload an image');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/sarees`, {
        method: 'POST',
        credentials: 'include',
        body: data
      });
      const result = await response.json();
      
      if (result.success) {
        toast.success('Saree created successfully');
        setIsCreateOpen(false);
        fetchSarees();
      } else {
        toast.error(result.message || 'Failed to create saree');
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
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('color', formData.color);
      data.append('fabric', formData.fabric);
      data.append('description', formData.description);
      if (formData.catalogId) data.append('catalogId', formData.catalogId);
      if (imageFile) {
        data.append('image', imageFile);
      }

      const response = await fetch(`${API_BASE_URL}/sarees/${selectedSaree._id}`, {
        method: 'PUT',
        credentials: 'include',
        body: data
      });
      const result = await response.json();
      
      if (result.success) {
        toast.success('Saree updated successfully');
        setIsEditOpen(false);
        fetchSarees();
      } else {
        toast.error(result.message || 'Failed to update saree');
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
    setFormData({ name: '', catalogId: '', category: '', color: '', fabric: '', description: '' });
    setImageFile(null);
    setIsCreateOpen(true);
  };

  const openEditModal = (saree: any) => {
    setSelectedSaree(saree);
    setFormData({
      name: saree.name || '',
      catalogId: saree.catalogId || '',
      category: saree.category || '',
      color: saree.color || '',
      fabric: saree.fabric || '',
      description: saree.description || '',
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
            <h1 className="text-3xl font-bold text-gray-900 border-l pl-4">Manage Sarees</h1>
          </div>
          <button 
            onClick={openCreateModal}
            className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            + Add New Saree
          </button>
        </div>
        
        <div className="mt-8">
          <div className="overflow-hidden rounded border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
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
                  <label className="block text-sm font-medium">Catalog (Optional)</label>
                  <select 
                    value={formData.catalogId} 
                    onChange={(e) => {
                      const selectedCat = catalogs.find(c => c._id === e.target.value);
                      setFormData({
                        ...formData, 
                        catalogId: e.target.value,
                        category: selectedCat ? selectedCat.name : formData.category
                      });
                    }} 
                    className="mt-1 block w-full rounded border p-2 bg-white"
                  >
                    <option value="">None / Custom</option>
                    {catalogs.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Category / Type</label>
                  <input required type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="mt-1 block w-full rounded border p-2" placeholder="e.g. Silk" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Fabric</label>
                  <input required type="text" value={formData.fabric} onChange={(e) => setFormData({...formData, fabric: e.target.value})} className="mt-1 block w-full rounded border p-2" placeholder="e.g. Pure Silk" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Color</label>
                  <input required type="text" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="mt-1 block w-full rounded border p-2" placeholder="e.g. Red" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Upload Image</label>
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
                {isEditOpen && !imageFile && selectedSaree?.imageUrl && (
                  <p className="mt-1 text-xs text-gray-500">Leave blank to keep existing image</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full rounded border p-2" placeholder="Saree description..." />
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
                  {isSubmitting ? 'Uploading & Saving...' : (isCreateOpen ? 'Create Saree' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
