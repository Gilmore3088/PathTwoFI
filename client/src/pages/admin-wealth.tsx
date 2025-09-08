import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PlusCircle, Edit, Trash2, TrendingUp, Users, User, Heart, Search, Download, CheckSquare, Square, LogOut } from "lucide-react";
import { format } from "date-fns";
import { insertWealthDataSchema, type WealthData, type InsertWealthData } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import Papa from 'papaparse';
import { Link, useLocation } from "wouter";
import { makeAdminRequest } from "@/lib/adminAuth";

export default function AdminWealth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WealthData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ALL HOOKS MUST BE BEFORE CONDITIONAL RETURNS
  // Fetch all wealth data
  const { data: allWealthData = [], isLoading } = useQuery<WealthData[]>({
    queryKey: ["/api/wealth-data"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await makeAdminRequest('/api/wealth-data');
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json();
    }
  });

  // Filtered and searched wealth data
  const filteredWealthData = useMemo(() => {
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
      savingsRate: "",
      // Asset breakdown
      stocks: "0",
      bonds: "0",
      realEstate: "0",
      crypto: "0",
      commodities: "0",
      alternativeInvestments: "0",
      // Debt breakdown
      mortgage: "0",
      creditCards: "0",
      studentLoans: "0",
      autoLoans: "0"
    }
  });

  // Create/Update mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertWealthData) => {
      const response = await makeAdminRequest('/api/wealth-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to create wealth data' }));
        throw new Error(errorData.message || 'Failed to create wealth data');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wealth-data"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      form.reset();
      toast({ description: "Wealth data created successfully" });
    },
    onError: (error) => {
      toast({ 
        variant: "destructive", 
        description: error.message || "Failed to create wealth data" 
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertWealthData }) => {
      const response = await makeAdminRequest(`/api/wealth-data/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update wealth data' }));
        throw new Error(errorData.message || 'Failed to update wealth data');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wealth-data"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      form.reset();
      toast({ description: "Wealth data updated successfully" });
    },
    onError: (error) => {
      toast({ 
        variant: "destructive", 
        description: error.message || "Failed to update wealth data" 
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await makeAdminRequest(`/api/wealth-data/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete wealth data' }));
        throw new Error(errorData.message || 'Failed to delete wealth data');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wealth-data"] });
      toast({ description: "Wealth data deleted successfully" });
    },
    onError: (error) => {
      toast({ 
        variant: "destructive", 
        description: error.message || "Failed to delete wealth data" 
      });
    }
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await makeAdminRequest('/api/wealth-data/bulk-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete wealth data' }));
        throw new Error(errorData.message || 'Failed to delete wealth data');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wealth-data"] });
      setSelectedItems(new Set());
      toast({ description: "Wealth data deleted successfully" });
    },
    onError: (error) => {
      toast({ 
        variant: "destructive", 
        description: error.message || "Failed to delete wealth data" 
      });
    }
  });

  const handleExportCSV = useCallback(() => {
    const csvData = filteredWealthData.map(item => ({
      Date: format(new Date(item.date!), 'yyyy-MM-dd'),
      Category: item.category,
      'Net Worth': item.netWorth,
      Investments: item.investments,
      Cash: item.cash,
      Liabilities: item.liabilities,
      'FIRE Target': item.fireTarget,
      'Savings Rate': item.savingsRate,
      Stocks: item.stocks || '',
      Bonds: item.bonds || '',
      'Real Estate': item.realEstate || '',
      Crypto: item.crypto || '',
      Commodities: item.commodities || '',
      'Alternative Investments': item.alternativeInvestments || '',
      Mortgage: item.mortgage || '',
      'Credit Cards': item.creditCards || '',
      'Student Loans': item.studentLoans || '',
      'Auto Loans': item.autoLoans || ''
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `wealth-data-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredWealthData]);

  // Check localStorage authentication
  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem("adminAuth");
      const authExpiry = localStorage.getItem("adminAuthExpiry");
      
      if (authToken && authExpiry) {
        const now = new Date().getTime();
        const expiry = parseInt(authExpiry);
        
        if (now < expiry) {
          setIsAuthenticated(true);
          setAuthLoading(false);
        } else {
          localStorage.removeItem("adminAuth");
          localStorage.removeItem("adminAuthExpiry");
          setAuthLoading(false);
          window.location.href = "/admin";
          return;
        }
      } else {
        setAuthLoading(false);
        window.location.href = "/admin";
        return;
      }
    };
    
    checkAuth();
  }, []);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Keep wealthData for backward compatibility
  const wealthData = filteredWealthData;

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
      date: new Date(item.date!),
      category: item.category,
      netWorth: item.netWorth,
      investments: item.investments,
      cash: item.cash,
      liabilities: item.liabilities,
      fireTarget: item.fireTarget || "1000000.00",
      savingsRate: item.savingsRate,
      // Asset breakdown
      stocks: item.stocks || "0",
      bonds: item.bonds || "0",
      realEstate: item.realEstate || "0",
      crypto: item.crypto || "0",
      commodities: item.commodities || "0",
      alternativeInvestments: item.alternativeInvestments || "0",
      // Debt breakdown
      mortgage: item.mortgage || "0",
      creditCards: item.creditCards || "0",
      studentLoans: item.studentLoans || "0",
      autoLoans: item.autoLoans || "0"
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this wealth data entry?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.size === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedItems.size} selected entries?`)) {
      bulkDeleteMutation.mutate(Array.from(selectedItems));
    }
  };

  const toggleEntrySelection = (id: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  const toggleAllEntries = () => {
    if (selectedItems.size === wealthData.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(wealthData.map(item => item.id)));
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Both": return <Users className="w-5 h-5 text-blue-500" />;
      case "Individual 1": return <User className="w-5 h-5 text-green-500" />;
      case "Individual 2": return <Heart className="w-5 h-5 text-pink-500" />;
      default: return <TrendingUp className="w-5 h-5 text-gray-500" />;
    }
  };

  const logout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminAuthExpiry");
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <nav className="flex gap-4">
                <Link href="/admin/home">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/admin/blog">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Blog Posts
                  </Button>
                </Link>
                <Link href="/admin/wealth">
                  <Button variant="default">
                    Wealth Data
                  </Button>
                </Link>
                <Link href="/admin/goals">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Goals
                  </Button>
                </Link>
              </nav>
            </div>
            <Button onClick={logout} variant="outline" size="sm" data-testid="button-logout">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Wealth Data Management</h2>
              <p className="text-muted-foreground mt-1">Track and manage wealth tracking data entries</p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleExportCSV} variant="outline" data-testid="button-export-csv">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-wealth">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Wealth Data
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingItem ? "Edit" : "Add"} Wealth Data</DialogTitle>
                  </DialogHeader>
                  
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Basic Information</h3>
                        
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
                                  value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
                                  onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
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
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-category">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Individual 1">Individual 1</SelectItem>
                                  <SelectItem value="Individual 2">Individual 2</SelectItem>
                                  <SelectItem value="Both">Both (Combined)</SelectItem>
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
                                <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-net-worth" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="investments"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Investments ($)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-investments" />
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
                                <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-cash" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="liabilities"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Liabilities ($)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-liabilities" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="fireTarget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>FIRE Target ($)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" placeholder="1000000.00" {...field} value={field.value || ""} data-testid="input-fire-target" />
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
                                <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-savings-rate" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Asset & Debt Breakdown */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Asset Breakdown</h3>
                        
                        <FormField
                          control={form.control}
                          name="stocks"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Stocks ($)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-stocks" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="bonds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bonds ($)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-bonds" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="realEstate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Real Estate ($)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-real-estate" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="crypto"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Crypto ($)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-crypto" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="pt-4">
                          <h3 className="text-lg font-semibold mb-4">Debt Breakdown</h3>
                          
                          <FormField
                            control={form.control}
                            name="mortgage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mortgage ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-mortgage" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="creditCards"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Credit Cards ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-credit-cards" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="autoLoans"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Auto Loans ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-auto-loans" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="studentLoans"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Student Loans ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-student-loans" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-6">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                        Cancel
                      </Button>
                      <Button type="submit" data-testid="button-submit">
                        {editingItem ? "Update" : "Create"} Wealth Data
                      </Button>
                    </div>
                  </form>
                </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Wealth Data Table */}
          <div className="space-y-4">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search wealth data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-wealth"
                />
              </div>
              <div className="flex gap-2">
                {selectedItems.size > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    data-testid="button-bulk-delete"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected ({selectedItems.size})
                  </Button>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredWealthData.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No wealth data yet</h3>
                <p className="text-muted-foreground mb-4">Start tracking your financial journey by adding your first wealth snapshot.</p>
                <Button onClick={() => setIsDialogOpen(true)} data-testid="button-add-first-wealth">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Your First Wealth Data
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredWealthData.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(item.category)}
                          <div>
                            <h3 className="text-lg font-semibold" data-testid={`text-wealth-date-${item.id}`}>
                              {format(new Date(item.date), "MMMM d, yyyy")}
                            </h3>
                            <p className="text-sm text-muted-foreground" data-testid={`text-wealth-category-${item.id}`}>
                              {item.category} • Net Worth: ${parseFloat(item.netWorth).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            data-testid={`button-edit-wealth-${item.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            data-testid={`button-delete-wealth-${item.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Investments</p>
                          <p className="font-medium">${parseFloat(item.investments).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Cash</p>
                          <p className="font-medium">${parseFloat(item.cash).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Liabilities</p>
                          <p className="font-medium">${parseFloat(item.liabilities).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Savings Rate</p>
                          <p className="font-medium">{parseFloat(item.savingsRate)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}