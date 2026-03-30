import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Package, Search, Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { ShopifyProduct, storefrontApiRequest, PRODUCTS_QUERY } from '@/lib/shopify';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminProductsProps {
  products: ShopifyProduct[];
  onProductsChange?: (products: ShopifyProduct[]) => void;
}

interface ProductForm {
  title: string;
  body: string;
  vendor: string;
  product_type: string;
  tags: string;
  price: string;
}

const emptyForm: ProductForm = { title: '', body: '', vendor: '', product_type: '', tags: '', price: '' };

function extractShopifyNumericId(gid: string): number {
  const match = gid.match(/(\d+)$/);
  return match ? parseInt(match[1], 10) : 0;
}

const AdminProducts = ({ products, onProductsChange }: AdminProductsProps) => {
  const [search, setSearch] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<ShopifyProduct | null>(null);
  const [editingProduct, setEditingProduct] = useState<ShopifyProduct | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const filtered = products.filter(p =>
    p.node.title.toLowerCase().includes(search.toLowerCase())
  );

  const callEdgeFunction = async (body: Record<string, unknown>) => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/shopify-products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Request failed');
    }
    return res.json();
  };

  const refreshProducts = async () => {
    setRefreshing(true);
    try {
      const res = await storefrontApiRequest(PRODUCTS_QUERY, { first: 50 });
      if (res?.data?.products?.edges) {
        onProductsChange?.(res.data.products.edges);
      }
      toast({ title: 'Refreshed', description: 'Product catalog updated.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to refresh products.', variant: 'destructive' });
    } finally {
      setRefreshing(false);
    }
  };

  const handleAdd = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await callEdgeFunction({
        action: 'create',
        product: {
          title: form.title,
          body_html: form.body,
          vendor: form.vendor || undefined,
          product_type: form.product_type || undefined,
          tags: form.tags || undefined,
          variants: form.price ? [{ price: form.price }] : undefined,
        },
      });
      toast({ title: 'Product created', description: `"${form.title}" has been added.` });
      setShowAddDialog(false);
      setForm(emptyForm);
      setTimeout(refreshProducts, 1500);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editingProduct || !form.title.trim()) return;
    setSaving(true);
    try {
      const numericId = extractShopifyNumericId(editingProduct.node.id);
      await callEdgeFunction({
        action: 'update',
        product_id: numericId,
        product: {
          title: form.title,
          body_html: form.body,
          vendor: form.vendor || undefined,
          product_type: form.product_type || undefined,
          tags: form.tags || undefined,
        },
      });
      toast({ title: 'Product updated', description: `"${form.title}" has been updated.` });
      setShowEditDialog(false);
      setEditingProduct(null);
      setForm(emptyForm);
      setTimeout(refreshProducts, 1500);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;
    setSaving(true);
    try {
      const numericId = extractShopifyNumericId(deleteProduct.node.id);
      await callEdgeFunction({ action: 'delete', product_id: numericId });
      toast({ title: 'Product deleted', description: `"${deleteProduct.node.title}" has been removed.` });
      onProductsChange?.(products.filter(p => p.node.id !== deleteProduct.node.id));
      setDeleteProduct(null);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (p: ShopifyProduct) => {
    setEditingProduct(p);
    setForm({
      title: p.node.title,
      body: p.node.description,
      vendor: '',
      product_type: '',
      tags: '',
      price: p.node.priceRange.minVariantPrice.amount,
    });
    setShowEditDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Product Management</h2>
          <p className="text-muted-foreground text-sm mt-1">View and manage your product catalog</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refreshProducts} disabled={refreshing}>
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Refresh
          </Button>
          <Button size="sm" onClick={() => { setForm(emptyForm); setShowAddDialog(true); }}>
            <Plus size={14} /> Add Product
          </Button>
        </div>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-lg font-display">
              <Package size={20} className="text-primary" /> Product Catalog ({products.length})
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
              <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <div key={p.node.id} className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow group">
                  {p.node.images.edges[0] && (
                    <div className="aspect-square bg-muted/30 overflow-hidden relative">
                      <img src={p.node.images.edges[0].node.url} alt={p.node.images.edges[0].node.altText || p.node.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => openEdit(p)}>
                          <Pencil size={14} />
                        </Button>
                        <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => setDeleteProduct(p)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-medium text-foreground text-sm line-clamp-2">{p.node.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.node.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-primary font-semibold text-sm">
                        {p.node.priceRange.minVariantPrice.currencyCode} {parseFloat(p.node.priceRange.minVariantPrice.amount).toFixed(2)}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {p.node.variants.edges.length} variant{p.node.variants.edges.length > 1 ? 's' : ''}
                      </Badge>
                    </div>
                    {!p.node.images.edges[0] && (
                      <div className="flex gap-1 mt-2">
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => openEdit(p)}>
                          <Pencil size={12} /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => setDeleteProduct(p)}>
                          <Trash2 size={12} /> Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Fill in the details to create a new product in your catalog.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Product name" /></div>
            <div><Label>Description</Label><Textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Product description" rows={3} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Price</Label><Input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" /></div>
              <div><Label>Vendor</Label><Input value={form.vendor} onChange={e => setForm(f => ({ ...f, vendor: e.target.value }))} placeholder="Brand name" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Product Type</Label><Input value={form.product_type} onChange={e => setForm(f => ({ ...f, product_type: e.target.value }))} placeholder="e.g. Surgical" /></div>
              <div><Label>Tags</Label><Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="tag1, tag2" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={saving || !form.title.trim()}>{saving ? 'Creating...' : 'Create Product'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the product details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div><Label>Description</Label><Textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={3} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Vendor</Label><Input value={form.vendor} onChange={e => setForm(f => ({ ...f, vendor: e.target.value }))} /></div>
              <div><Label>Product Type</Label><Input value={form.product_type} onChange={e => setForm(f => ({ ...f, product_type: e.target.value }))} /></div>
            </div>
            <div><Label>Tags</Label><Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={saving || !form.title.trim()}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteProduct} onOpenChange={(open) => !open && setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteProduct?.node.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={saving} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {saving ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProducts;
