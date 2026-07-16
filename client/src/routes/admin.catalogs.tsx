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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/20" />

      <main className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 reveal-up">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <Link to="/admin/dashboard" className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 mb-6">
              <span>&larr;</span> Back to Dashboard
            </Link>
            <h1 className="font-serif text-4xl sm:text-5xl text-foreground">Manage Catalogs</h1>
          </div>
          <button 
            onClick={openCreateModal}
            className="btn-gold px-8 py-3 text-xs font-semibold tracking-[0.2em] uppercase rounded-full shrink-0"
          >
            + Add New Catalog
          </button>
        </div>
        
        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {catalogs.map((catalog: any, i: number) => (
            <div 
              key={catalog._id} 
              className="group glass-premium rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/10 border border-border/50 flex flex-col"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {catalog.coverImage ? (
                  <img src={catalog.coverImage} alt={catalog.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                    <span className="text-xs uppercase tracking-widest text-primary/40 font-semibold">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-x-0 bottom-0 p-6 flex items-end justify-between">
                  <div className="min-w-0 pr-4">
                    <h3 className="font-serif text-2xl text-white truncate drop-shadow-md">{catalog.name}</h3>
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col bg-background/50">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                  {catalog.description || <span className="italic opacity-50">No description provided.</span>}
                </p>
                
                <div className="flex items-center gap-3 pt-4 border-t border-border/50 mt-auto">
                  <button onClick={() => openEditModal(catalog)} className="flex-1 py-2 text-xs font-semibold uppercase tracking-widest text-primary border border-primary/20 hover:bg-primary/5 rounded-lg transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(catalog._id)} className="flex-1 py-2 text-xs font-semibold uppercase tracking-widest text-red-500 border border-red-500/20 hover:bg-red-500/5 rounded-lg transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {catalogs.length === 0 && (
            <div className="col-span-full glass-premium rounded-2xl p-16 flex flex-col items-center justify-center text-center border border-dashed border-primary/30">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-2">No Catalogs Found</h3>
              <p className="text-muted-foreground text-sm max-w-md">You haven't created any catalogs yet. Add a catalog to start organizing your saree collections.</p>
            </div>
          )}
        </div>
      </main>

      {/* Create / Edit Modal Form Component */}
      {(isCreateOpen || isEditOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }} />
          <div className="relative w-full max-w-lg glass-premium rounded-2xl p-8 shadow-2xl border border-border/50 reveal-up">
            <h2 className="mb-8 font-serif text-3xl text-foreground">
              {isCreateOpen ? 'Create New Catalog' : 'Edit Catalog'}
            </h2>
            <form onSubmit={isCreateOpen ? handleCreateCatalog : handleEditCatalog} className="space-y-6">
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Catalog Name</label>
                <input 
                  required 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                  placeholder="e.g. Summer Collection 2026" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Cover Image</label>
                <div className="relative group rounded-xl border border-dashed border-primary/30 hover:border-primary/60 transition-colors bg-primary/5 p-6 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setImageFile(e.target.files[0]);
                      }
                    }} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  <svg className="w-8 h-8 text-primary/60 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-foreground">{imageFile ? imageFile.name : 'Click to upload image'}</span>
                  <span className="text-xs text-muted-foreground mt-1">JPEG, PNG, WEBP</span>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Description</label>
                <textarea 
                  rows={4} 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none" 
                  placeholder="Describe this collection..." 
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }} 
                  className="flex-1 py-3 text-xs font-semibold uppercase tracking-widest text-foreground bg-secondary/50 hover:bg-secondary rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="btn-gold flex-1 py-3 text-xs font-semibold tracking-[0.2em] uppercase rounded-full"
                >
                  {isSubmitting ? 'Saving...' : (isCreateOpen ? 'Create' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
