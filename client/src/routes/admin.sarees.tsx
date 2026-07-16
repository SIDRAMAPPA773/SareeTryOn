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
    price: '',
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
      data.append('price', formData.price);
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
      data.append('price', formData.price);
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
    setFormData({ name: '', catalogId: '', category: '', color: '', fabric: '', price: '', description: '' });
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
      price: saree.price ? saree.price.toString() : '',
      description: saree.description || '',
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
            <h1 className="font-serif text-4xl sm:text-5xl text-foreground">Manage Sarees</h1>
          </div>
          <button 
            onClick={openCreateModal}
            className="btn-gold px-8 py-3 text-xs font-semibold tracking-[0.2em] uppercase rounded-full shrink-0"
          >
            + Add New Saree
          </button>
        </div>
        
        {/* Inventory List Section */}
        <div className="glass-premium rounded-3xl overflow-hidden border border-border/50">
          {/* Table Header (Hidden on mobile) */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-border/40 bg-primary/5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <div className="col-span-2">Image</div>
            <div className="col-span-4">Name</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          
          <div className="divide-y divide-border/40">
            {sarees.map((saree: any, i: number) => (
              <div 
                key={saree._id} 
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center hover:bg-primary/5 transition-colors group"
              >
                <div className="col-span-2 flex justify-center md:justify-start">
                  <div className="w-28 h-36 sm:w-24 sm:h-32 rounded-xl overflow-hidden shadow-sm">
                    {saree.imageUrl ? (
                      <img src={saree.imageUrl} alt={saree.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <span className="text-[10px] uppercase text-primary/50">No Img</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="col-span-4 text-center md:text-left">
                  <h3 className="font-serif text-lg text-foreground">{saree.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{saree.fabric} &middot; {saree.color}</p>
                </div>
                
                <div className="col-span-2 text-center md:text-left">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-primary/10 text-primary">
                    {saree.category}
                  </span>
                </div>

                <div className="col-span-2 text-center md:text-left font-medium text-foreground">
                  ₹{saree.price?.toLocaleString('en-IN') || '15,000'}
                </div>
                
                <div className="col-span-2 flex items-center justify-center md:justify-end gap-3">
                  <button onClick={() => openEditModal(saree)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(saree._id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            
            {sarees.length === 0 && (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl text-foreground mb-2">No Sarees Found</h3>
                <p className="text-muted-foreground text-sm">Your inventory is currently empty. Add a new saree to get started.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create / Edit Modal Form Component */}
      {(isCreateOpen || isEditOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto py-12">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm fixed" onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }} />
          <div className="relative w-full max-w-2xl glass-premium rounded-2xl p-8 shadow-2xl border border-border/50 reveal-up my-auto">
            <h2 className="mb-8 font-serif text-3xl text-foreground">
              {isCreateOpen ? 'Add New Saree' : 'Edit Saree Details'}
            </h2>
            <form onSubmit={isCreateOpen ? handleCreateSaree : handleEditSaree} className="space-y-6">
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Saree Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="e.g. Crimson Red Banarasi" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Link to Catalog (Optional)</label>
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
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                  >
                    <option value="">None / Auto-Create Custom</option>
                    {catalogs.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Category / Type</label>
                  <input required type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="e.g. Silk, Banarasi" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Fabric</label>
                  <input required type="text" value={formData.fabric} onChange={(e) => setFormData({...formData, fabric: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="e.g. Pure Silk" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Color</label>
                  <input required type="text" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="e.g. Ruby Red" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Price (₹)</label>
                <input required type="number" min="0" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="e.g. 15000" />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Upload Image</label>
                <div className="relative group rounded-xl border border-dashed border-primary/30 hover:border-primary/60 transition-colors bg-primary/5 p-4 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden">
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
                  <span className="text-sm font-medium text-foreground">{imageFile ? imageFile.name : 'Click to upload image'}</span>
                </div>
                {isEditOpen && !imageFile && selectedSaree?.imageUrl && (
                  <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Leave blank to keep existing image
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Description</label>
                <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none" placeholder="Saree description..." />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }} className="flex-1 py-3 text-xs font-semibold uppercase tracking-widest text-foreground bg-secondary/50 hover:bg-secondary rounded-full transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-gold flex-1 py-3 text-xs font-semibold tracking-[0.2em] uppercase rounded-full">
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
