import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
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
import { Link, useLocation } from "wouter";

export default function AdminWealth() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WealthData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      toast({
        title: "Access Denied",
        description: "You need admin access to view this page. Redirecting to login...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
  }, [isAuthenticated, isAdmin, authLoading, toast]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  // Fetch all wealth data
  const { data: allWealthData = [], isLoading } = useQuery<WealthData[]>({
    queryKey: ["/api/wealth-data"],
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

  // Keep wealthData for backward compatibility
  const wealthData = filteredWealthData;

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
      return await apiRequest(`/api/wealth-data/${id}`, 'DELETE');
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
        apiRequest(`/api/wealth-data/${id}`, 'DELETE')
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
      savingsRate: item.savingsRate,
      // Asset breakdown
      stocks: item.stocks?.toString() || "0",
      bonds: item.bonds?.toString() || "0",
      realEstate: item.realEstate?.toString() || "0",
      crypto: item.crypto?.toString() || "0",
      commodities: item.commodities?.toString() || "0",
      alternativeInvestments: item.alternativeInvestments?.toString() || "0",
      // Debt breakdown
      mortgage: item.mortgage?.toString() || "0",
      creditCards: item.creditCards?.toString() || "0",
      studentLoans: item.studentLoans?.toString() || "0",
      autoLoans: item.autoLoans?.toString() || "0"
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
      'Savings Rate': entry.savingsRate,
      // Asset breakdown
      Stocks: entry.stocks || '0',
      Bonds: entry.bonds || '0',
      'Real Estate': entry.realEstate || '0',
      Crypto: entry.crypto || '0',
      Commodities: entry.commodities || '0',
      'Alternative Investments': entry.alternativeInvestments || '0',
      // Debt breakdown
      Mortgage: entry.mortgage || '0',
      'Credit Cards': entry.creditCards || '0',
      'Student Loans': entry.studentLoans || '0',
      'Auto Loans': entry.autoLoans || '0'
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
          {/* Admin Navigation */}
          <div className="flex gap-2 mb-6">
            <Link href="/admin/wealth">
              <Button variant="outline" className="bg-primary text-primary-foreground">
                Wealth Data
              </Button>
            </Link>
            <Link href="/admin/blog">
              <Button variant="outline">Blog Posts</Button>
            </Link>
            <Link href="/admin/goals">
              <Button variant="outline">Financial Goals</Button>
            </Link>
          </div>

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
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
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

                    {/* FIRE Settings */}
                    <div className="grid grid-cols-2 gap-4">
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

                    {/* To FIRE Goal Section */}
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-semibold mb-4 text-blue-600">To FIRE Goal</h3>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <FormField
                          control={form.control}
                          name="netWorth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Net Worth ($)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" placeholder="3000000.00" {...field} data-testid="input-net-worth" />
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
                              <FormLabel>Net Worth Less Home ($)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" placeholder="1500000.00" {...field} data-testid="input-net-worth-less-home" />
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
                              <FormLabel>Working Cap ($)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" placeholder="100000.00" {...field} data-testid="input-working-cap" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Assets Section */}
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-semibold mb-4 text-green-600">Assets</h3>
                      
                      {/* Retirement Accounts */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium mb-3 text-green-700">Retirement Accounts</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="retirement401k"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Traditional 401(k) ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-401k" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="retirementRoth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Roth IRA ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-roth-ira" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="retirementIRA"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Other IRA ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-other-ira" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="hsa"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>HSA ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-hsa" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Cash & Banking */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium mb-3 text-green-700">Cash & Banking</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="checkingAccounts"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Checking Account ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-checking" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="savingsAccounts"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Savings Account ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-savings" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Investments */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium mb-3 text-green-700">Investments</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="stocks"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Brokerage Account ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-brokerage" />
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
                          
                          <FormField
                            control={form.control}
                            name="alternativeInvestments"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Other ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-other-investments" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Real Estate */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium mb-3 text-green-700">Real Estate</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="realEstate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Primary Residence ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-primary-residence" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Liabilities Section */}
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-semibold mb-4 text-red-600">Liabilities</h3>
                      
                      {/* Housing */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium mb-3 text-red-700">Housing</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="mortgage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mortgage Balance ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-mortgage" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Consumer Debt */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium mb-3 text-red-700">Consumer Debt</h4>
                        <div className="grid grid-cols-2 gap-4">
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
                          
                          <FormField
                            control={form.control}
                            name="personalLoans"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Other Loans ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="input-other-loans" />
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
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedItems);
                              if (e.target.checked) {
                                newSelected.add(item.id);
                              } else {
                                newSelected.delete(item.id);
                              }
                              setSelectedItems(newSelected);
                            }}
                            className="rounded"
                            data-testid={`checkbox-wealth-${item.id}`}
                          />
                          {getCategoryIcon(item.category)}
                          <div>
                            <CardTitle className="text-lg" data-testid={`text-wealth-date-${item.id}`}>
                              {format(new Date(item.date), "MMMM d, yyyy")}
                            </CardTitle>
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
