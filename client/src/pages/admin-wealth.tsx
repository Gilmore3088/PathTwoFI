import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PlusCircle, Edit, Trash2, TrendingUp, Users, User, Heart, Search, Download, CheckSquare, Square } from "lucide-react";
import { format } from "date-fns";
import { insertWealthDataSchema, type WealthData, type InsertWealthData } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import Papa from 'papaparse';

export default function AdminWealth() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WealthData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all wealth data
  const { data: allWealthData = [], isLoading } = useQuery<WealthData[]>({
    queryKey: ["/api/wealth-data"],
  });

  // Filtered and searched wealth data
  const wealthData = useMemo(() => {
    return allWealthData.filter(entry => {
      const matchesSearch = searchTerm === "" || 
        format(new Date(entry.date!), 'MMM dd, yyyy').toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || entry.category === selectedCategory;
      
      const matchesPeriod = selectedPeriod === "all" || (() => {
        const entryDate = new Date(entry.date!);
        const now = new Date();
        switch (selectedPeriod) {
          case "30d": return (now.getTime() - entryDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
          case "90d": return (now.getTime() - entryDate.getTime()) <= 90 * 24 * 60 * 60 * 1000;
          case "1y": return (now.getTime() - entryDate.getTime()) <= 365 * 24 * 60 * 60 * 1000;
          default: return true;
        }
      })();
      
      return matchesSearch && matchesCategory && matchesPeriod;
    });
  }, [allWealthData, searchTerm, selectedCategory, selectedPeriod]);

  const form = useForm<InsertWealthData>({
    resolver: zodResolver(insertWealthDataSchema),
    defaultValues: {
      date: new Date(),
      category: "Both",
      netWorth: "",
      investments: "",
      cash: "",
      liabilities: "",
      fireTarget: "1000000.00",
      savingsRate: ""
    }
  });

  // Create/Update mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertWealthData) => {
      return await apiRequest('/api/wealth-data', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wealth-data"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      form.reset();
      toast({
        title: "Success",
        description: "Wealth data saved successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save wealth data",
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<InsertWealthData> }) => {
      return await apiRequest(`/api/wealth-data/${id}`, 'PUT', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wealth-data"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      form.reset();
      toast({
        title: "Success",
        description: "Wealth data updated successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error", 
        description: "Failed to update wealth data",
        variant: "destructive"
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/wealth-data/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wealth-data"] });
      toast({
        title: "Success",
        description: "Wealth data deleted successfully!"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete wealth data",
        variant: "destructive"
      });
    }
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map(id => 
        apiRequest('DELETE', `/api/wealth-data/${id}`)
      ));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wealth-data"] });
      setSelectedEntries(new Set());
      toast({
        title: "Success",
        description: "Selected entries deleted successfully!"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete selected entries",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InsertWealthData) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (item: WealthData) => {
    setEditingItem(item);
    form.reset({
      date: new Date(item.date),
      category: item.category as "His" | "Her" | "Both",
      netWorth: item.netWorth,
      investments: item.investments,
      cash: item.cash,
      liabilities: item.liabilities,
      fireTarget: item.fireTarget,
      savingsRate: item.savingsRate
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this wealth entry?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkDelete = () => {
    if (selectedEntries.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedEntries.size} selected entries?`)) {
      bulkDeleteMutation.mutate(Array.from(selectedEntries));
    }
  };

  const handleSelectAll = () => {
    if (selectedEntries.size === wealthData.length) {
      setSelectedEntries(new Set());
    } else {
      setSelectedEntries(new Set(wealthData.map(entry => entry.id)));
    }
  };

  const handleSelectEntry = (entryId: string) => {
    const newSelected = new Set(selectedEntries);
    if (newSelected.has(entryId)) {
      newSelected.delete(entryId);
    } else {
      newSelected.add(entryId);
    }
    setSelectedEntries(newSelected);
  };

  const handleExportCSV = useCallback(() => {
    const csvData = wealthData.map(entry => ({
      Date: format(new Date(entry.date!), 'yyyy-MM-dd'),
      Category: entry.category,
      'Net Worth': entry.netWorth,
      Investments: entry.investments,
      Cash: entry.cash,
      Liabilities: entry.liabilities,
      'FIRE Target': entry.fireTarget,
      'Savings Rate': entry.savingsRate
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pathwo-wealth-data-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Success",
      description: "Wealth data exported successfully!"
    });
  }, [wealthData, toast]);

  const resetForm = () => {
    setEditingItem(null);
    form.reset();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "His": return <User className="h-4 w-4 text-blue-600" />;
      case "Her": return <Heart className="h-4 w-4 text-pink-600" />;
      case "Both": return <Users className="h-4 w-4 text-purple-600" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground" data-testid="text-admin-wealth-title">
                Wealth Data Management
              </h1>
              <p className="text-muted-foreground mt-2" data-testid="text-admin-wealth-subtitle">
                Manage wealth data for His, Her, and Both categories
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleExportCSV}
                variant="outline"
                data-testid="button-export-csv"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-wealth">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Wealth Data
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle data-testid="text-dialog-title">
                    {editingItem ? "Edit Wealth Data" : "Add New Wealth Data"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                              onChange={(e) => field.onChange(new Date(e.target.value))}
                              data-testid="input-date"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="His">His</SelectItem>
                              <SelectItem value="Her">Her</SelectItem>
                              <SelectItem value="Both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="netWorth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Net Worth ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="350000.00" {...field} data-testid="input-net-worth" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="investments"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Investments ($)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="287000.00" {...field} data-testid="input-investments" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cash"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cash ($)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="63000.00" {...field} data-testid="input-cash" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="liabilities"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Liabilities ($)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="15000.00" {...field} data-testid="input-liabilities" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="savingsRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Savings Rate (%)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="47.00" {...field} data-testid="input-savings-rate" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="fireTarget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>FIRE Target ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="1000000.00" {...field} data-testid="input-fire-target" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2 pt-4">
                      <Button
                        type="submit"
                        disabled={createMutation.isPending || updateMutation.isPending}
                        data-testid="button-save-wealth"
                      >
                        {editingItem ? "Update" : "Create"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        data-testid="button-cancel"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search wealth data..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                    data-testid="input-search"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label>Category:</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48" data-testid="select-filter-category">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="His">His</SelectItem>
                      <SelectItem value="Her">Her</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label>Period:</Label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-48" data-testid="select-filter-period">
                      <SelectValue placeholder="All Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                      <SelectItem value="90d">Last 90 Days</SelectItem>
                      <SelectItem value="1y">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedEntries.size > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={bulkDeleteMutation.isPending}
                    data-testid="button-bulk-delete"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected ({selectedEntries.size})
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" data-testid="text-data-table-title">
                <TrendingUp className="w-5 h-5" />
                Wealth Data Entries ({wealthData.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8" data-testid="text-loading">
                  Loading wealth data...
                </div>
              ) : wealthData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground" data-testid="text-no-data">
                  No wealth data found. Add some entries to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSelectAll}
                            data-testid="button-select-all"
                          >
                            {selectedEntries.size === wealthData.length ? (
                              <CheckSquare className="w-4 h-4" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Net Worth</TableHead>
                        <TableHead>Investments</TableHead>
                        <TableHead>Cash</TableHead>
                        <TableHead>Liabilities</TableHead>
                        <TableHead>Savings Rate</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wealthData.map((item) => (
                        <TableRow key={item.id} data-testid={`row-wealth-${item.id}`}>
                          <TableCell>
                            <Checkbox
                              checked={selectedEntries.has(item.id)}
                              onCheckedChange={() => handleSelectEntry(item.id)}
                              data-testid={`checkbox-select-${item.id}`}
                            />
                          </TableCell>
                          <TableCell>{format(new Date(item.date), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(item.category)}
                              {item.category}
                            </div>
                          </TableCell>
                          <TableCell>${parseFloat(item.netWorth).toLocaleString()}</TableCell>
                          <TableCell>${parseFloat(item.investments).toLocaleString()}</TableCell>
                          <TableCell>${parseFloat(item.cash).toLocaleString()}</TableCell>
                          <TableCell>${parseFloat(item.liabilities).toLocaleString()}</TableCell>
                          <TableCell>{item.savingsRate}%</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(item)}
                                data-testid={`button-edit-${item.id}`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(item.id)}
                                disabled={deleteMutation.isPending}
                                data-testid={`button-delete-${item.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}