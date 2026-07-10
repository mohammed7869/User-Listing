import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  LayoutGrid,
  Star,
  ExternalLink,
  Image,
  AlertTriangle,
  X,
  FolderOpen,
} from "lucide-react";
import { apiService } from "@/lib/api";

const emptyFormData = {
  title: "",
  townHallLevel: 1,
  description: "",
  category: "",
  rating: "",
  reviewCount: "",
  creatorName: "",
  creatorUrl: "",
  copyBaseUrl: "",
  imagePath: "",
  isActive: true,
};

function LayoutListing() {
  const [layouts, setLayouts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({ ...emptyFormData });
  const [formErrors, setFormErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [viewLayout, setViewLayout] = useState(null);
  const [deletingLayout, setDeletingLayout] = useState(null);

  // Fetch layouts
  useEffect(() => {
    fetchLayouts();
  }, []);

  const fetchLayouts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiService.fetchLayouts();
      setLayouts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch layouts");
    } finally {
      setLoading(false);
    }
  };

  // Search filter
  const filteredLayouts = layouts.filter((layout) => {
    const query = searchQuery.toLowerCase();
    return (
      (layout.title || "").toLowerCase().includes(query) ||
      (layout.category || "").toLowerCase().includes(query) ||
      (layout.creatorName || "").toLowerCase().includes(query) ||
      (layout.description || "").toLowerCase().includes(query)
    );
  });

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSwitchChange = (checked) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openCreateDialog = () => {
    setFormData({ ...emptyFormData });
    setFormErrors({});
    setEditingId(null);
    setFormDialogOpen(true);
  };

  const openEditDialog = (layout) => {
    setFormData({
      title: layout.title || "",
      townHallLevel: layout.townHallLevel || 1,
      description: layout.description || "",
      category: layout.category || "",
      rating: layout.rating ?? "",
      reviewCount: layout.reviewCount ?? "",
      creatorName: layout.creatorName || "",
      creatorUrl: layout.creatorUrl || "",
      copyBaseUrl: layout.copyBaseUrl || "",
      imagePath: layout.imagePath || "",
      isActive: layout.isActive ?? true,
    });
    setFormErrors({});
    setEditingId(layout.id);
    setFormDialogOpen(true);
  };

  const openViewDialog = (layout) => {
    setViewLayout(layout);
    setViewDialogOpen(true);
  };

  const openDeleteDialog = (layout) => {
    setDeletingLayout(layout);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      const payload = {
        ...formData,
        townHallLevel: parseInt(formData.townHallLevel, 10) || 0,
        rating: formData.rating !== "" ? parseFloat(formData.rating) : null,
        reviewCount:
          formData.reviewCount !== ""
            ? parseInt(formData.reviewCount, 10)
            : null,
      };

      if (editingId) {
        payload.id = editingId;
        await apiService.updateLayout(payload);
      } else {
        await apiService.createLayout(payload);
      }

      setFormDialogOpen(false);
      await fetchLayouts();
    } catch (err) {
      setFormErrors({
        submit: err.message || "Failed to save layout",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingLayout) return;
    try {
      setSaving(true);
      await apiService.deleteLayout(deletingLayout.id);
      setDeleteDialogOpen(false);
      setDeletingLayout(null);
      await fetchLayouts();
    } catch (err) {
      setError(err.message || "Failed to delete layout");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading layouts...</p>
        </div>
      </div>
    );
  }

  // Error state is now handled by a banner lower down in the JSX

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Layouts</h2>
          <p className="text-muted-foreground">
            Manage your game layouts
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Layout
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Layouts
            </CardTitle>
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{layouts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {layouts.filter((l) => l.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {layouts.filter((l) => !l.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {layouts.length > 0
                ? (
                    layouts.reduce(
                      (sum, l) => sum + (parseFloat(l.rating) || 0),
                      0
                    ) / layouts.filter((l) => l.rating).length || 0
                  ).toFixed(1)
                : "—"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title, category, or creator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error banner */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
          <p className="text-sm text-destructive flex-1">{error}</p>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => setError("")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Layout List */}
      <Card>
        <CardHeader>
          <CardTitle>Layout List</CardTitle>
          <CardDescription>
            {filteredLayouts.length} layout(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredLayouts.length === 0 ? (
            <div className="text-center py-12">
              <LayoutGrid className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No layouts found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={openCreateDialog}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create your first layout
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLayouts.map((layout) => (
                <div
                  key={layout.id}
                  className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  {/* Layout image / fallback */}
                  <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                    {layout.imagePath ? (
                      <img
                        src={layout.imagePath}
                        alt={layout.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <Image
                      className="h-6 w-6 text-muted-foreground"
                      style={layout.imagePath ? { display: "none" } : {}}
                    />
                  </div>

                  {/* Layout info */}
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold truncate">
                        {layout.title}
                      </p>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          layout.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        }`}
                      >
                        {layout.isActive ? "Active" : "Inactive"}
                      </span>
                      {layout.category && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {layout.category}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {layout.townHallLevel != null && (
                        <span>TH {layout.townHallLevel}</span>
                      )}
                      {layout.rating != null && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span>{layout.rating}</span>
                        </div>
                      )}
                      {layout.creatorName && (
                        <span>by {layout.creatorName}</span>
                      )}
                    </div>
                    {layout.description && (
                      <p className="text-xs text-muted-foreground truncate max-w-md">
                        {layout.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openViewDialog(layout)}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openEditDialog(layout)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => openDeleteDialog(layout)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* =========== Create / Edit Dialog =========== */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Layout" : "Create Layout"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update the layout details below."
                : "Fill in the details to create a new layout."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title (mandatory) */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter layout title"
                value={formData.title}
                onChange={handleInputChange}
                className={formErrors.title ? "border-destructive" : ""}
              />
              {formErrors.title && (
                <p className="text-xs text-destructive">{formErrors.title}</p>
              )}
            </div>

            {/* Town Hall Level & Category row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="townHallLevel">Town Hall Level</Label>
                <Input
                  id="townHallLevel"
                  name="townHallLevel"
                  type="number"
                  min="1"
                  max="17"
                  placeholder="1"
                  value={formData.townHallLevel}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="e.g. War, Farming, Trophy"
                  value={formData.category}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe this layout..."
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            {/* Rating & Review Count row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="0.0"
                  value={formData.rating}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reviewCount">Review Count</Label>
                <Input
                  id="reviewCount"
                  name="reviewCount"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.reviewCount}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Creator Name & Creator URL row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="creatorName">Creator Name</Label>
                <Input
                  id="creatorName"
                  name="creatorName"
                  placeholder="Creator name"
                  value={formData.creatorName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="creatorUrl">Creator URL</Label>
                <Input
                  id="creatorUrl"
                  name="creatorUrl"
                  placeholder="https://..."
                  value={formData.creatorUrl}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Copy Base URL */}
            <div className="space-y-2">
              <Label htmlFor="copyBaseUrl">Copy Base URL</Label>
              <Input
                id="copyBaseUrl"
                name="copyBaseUrl"
                placeholder="https://link.clashofclans.com/..."
                value={formData.copyBaseUrl}
                onChange={handleInputChange}
              />
            </div>

            {/* Image Path */}
            <div className="space-y-2">
              <Label htmlFor="imagePath">Image Path</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="imagePath"
                  name="imagePath"
                  placeholder="Image URL or path"
                  value={formData.imagePath}
                  onChange={handleInputChange}
                  className="flex-1"
                />
                <div className="relative cursor-pointer">
                  <Input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData((prev) => ({ ...prev, imagePath: reader.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                      e.target.value = "";
                    }}
                  />
                  <Button type="button" variant="secondary" className="whitespace-nowrap">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Select Image
                  </Button>
                </div>
              </div>
            </div>

            {/* Is Active toggle */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">Active Status</Label>
                <p className="text-xs text-muted-foreground">
                  Mark this layout as active or inactive
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
            </div>

            {/* Submit error */}
            {formErrors.submit && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                <p className="text-sm text-destructive">
                  {formErrors.submit}
                </p>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormDialogOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingId ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* =========== View Dialog =========== */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Layout Details</DialogTitle>
          </DialogHeader>

          {viewLayout && (
            <div className="space-y-4">
              {/* Image preview */}
              {viewLayout.imagePath && (
                <div className="rounded-lg overflow-hidden border bg-muted">
                  <img
                    src={viewLayout.imagePath}
                    alt={viewLayout.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Title</p>
                  <p className="font-medium">{viewLayout.title}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      viewLayout.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    }`}
                  >
                    {viewLayout.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Town Hall Level
                  </p>
                  <p className="font-medium">
                    {viewLayout.townHallLevel ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="font-medium">
                    {viewLayout.category || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="font-medium flex items-center gap-1">
                    {viewLayout.rating != null ? (
                      <>
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {viewLayout.rating}
                      </>
                    ) : (
                      "—"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Review Count
                  </p>
                  <p className="font-medium">
                    {viewLayout.reviewCount ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Creator Name
                  </p>
                  <p className="font-medium">
                    {viewLayout.creatorName || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Creator URL
                  </p>
                  {viewLayout.creatorUrl ? (
                    <a
                      href={viewLayout.creatorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      Visit <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <p className="font-medium">—</p>
                  )}
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">
                    Copy Base URL
                  </p>
                  {viewLayout.copyBaseUrl ? (
                    <a
                      href={viewLayout.copyBaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1 truncate"
                    >
                      {viewLayout.copyBaseUrl}{" "}
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  ) : (
                    <p className="font-medium">—</p>
                  )}
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">
                    Description
                  </p>
                  <p className="font-medium text-sm">
                    {viewLayout.description || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Created Date
                  </p>
                  <p className="font-medium text-sm">
                    {formatDate(viewLayout.createdDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Modified Date
                  </p>
                  <p className="font-medium text-sm">
                    {formatDate(viewLayout.modifiedDate)}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setViewDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setViewDialogOpen(false);
                    openEditDialog(viewLayout);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* =========== Delete Confirmation Dialog =========== */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Layout
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                "{deletingLayout?.title}"
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={saving}
            >
              {saving && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default LayoutListing;
