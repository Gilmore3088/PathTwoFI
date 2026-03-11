"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Eye, EyeOff, Save } from "lucide-react";
import { toast } from "sonner";
import { upsertPrivacySettings, updateDisplayName } from "./actions";
import type { PrivacySettings, PrivacyGranularity } from "@/types/wealth.types";

interface SettingsClientProps {
  initialPrivacySettings: PrivacySettings | null;
  initialDisplayName: string;
}

const GRANULARITY_OPTIONS: { value: PrivacyGranularity; label: string }[] = [
  { value: "exact", label: "Exact numbers" },
  { value: "percentage", label: "Percentages only" },
  { value: "hidden", label: "Hidden" },
];

export function SettingsClient({
  initialPrivacySettings,
  initialDisplayName,
}: SettingsClientProps) {
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState(initialDisplayName);

  const [privacy, setPrivacy] = useState({
    is_public: initialPrivacySettings?.is_public ?? false,
    show_net_worth: initialPrivacySettings?.show_net_worth ?? "exact" as PrivacyGranularity,
    show_assets: initialPrivacySettings?.show_assets ?? "percentage" as PrivacyGranularity,
    show_debts: initialPrivacySettings?.show_debts ?? "hidden" as PrivacyGranularity,
    show_cash_flow: initialPrivacySettings?.show_cash_flow ?? "hidden" as PrivacyGranularity,
    show_goals: initialPrivacySettings?.show_goals ?? "percentage" as PrivacyGranularity,
    show_his_category: initialPrivacySettings?.show_his_category ?? false,
    show_her_category: initialPrivacySettings?.show_her_category ?? false,
    show_combined_category: initialPrivacySettings?.show_combined_category ?? true,
  });

  async function handleSavePrivacy() {
    setSaving(true);
    try {
      const [privacyResult, nameResult] = await Promise.all([
        upsertPrivacySettings(privacy),
        updateDisplayName(displayName),
      ]);

      if (privacyResult.success && nameResult.success) {
        toast.success("Privacy settings saved");
      } else {
        toast.error(privacyResult.error || nameResult.error || "Failed to save");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your privacy and application preferences.
        </p>
      </div>

      <Tabs defaultValue="privacy" className="space-y-6">
        <TabsList>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="privacy" className="space-y-6">
          {/* Public Toggle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Public Wealthboard
              </CardTitle>
              <CardDescription>
                Control whether your financial data is visible on the public wealthboard at /wealthboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="is-public"
                  checked={privacy.is_public}
                  onCheckedChange={(checked) =>
                    setPrivacy((p) => ({ ...p, is_public: checked === true }))
                  }
                />
                <Label htmlFor="is-public" className="flex items-center gap-2">
                  {privacy.is_public ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  {privacy.is_public
                    ? "Wealthboard is public"
                    : "Wealthboard is private"}
                </Label>
              </div>

              {privacy.is_public && (
                <>
                  <Separator />

                  {/* Section Visibility */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Section Visibility</h4>
                    <p className="text-xs text-muted-foreground">
                      Choose how much detail to show for each section. &quot;Percentages only&quot; shows progress without exact dollar amounts.
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {([
                        ["show_net_worth", "Net Worth"],
                        ["show_assets", "Assets"],
                        ["show_debts", "Debts"],
                        ["show_cash_flow", "Cash Flow"],
                        ["show_goals", "Goals"],
                      ] as const).map(([field, label]) => (
                        <div key={field} className="space-y-1.5">
                          <Label htmlFor={field}>{label}</Label>
                          <Select
                            value={privacy[field]}
                            onValueChange={(val) =>
                              setPrivacy((p) => ({
                                ...p,
                                [field]: val as PrivacyGranularity,
                              }))
                            }
                          >
                            <SelectTrigger id={field}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {GRANULARITY_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Category Visibility */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Category Visibility</h4>
                    <p className="text-xs text-muted-foreground">
                      Choose which categories are visible publicly.
                    </p>

                    <div className="space-y-3">
                      {([
                        ["show_combined_category", "Combined"],
                        ["show_his_category", "His"],
                        ["show_her_category", "Her"],
                      ] as const).map(([field, label]) => (
                        <div key={field} className="flex items-center gap-3">
                          <Checkbox
                            id={field}
                            checked={privacy[field]}
                            onCheckedChange={(checked) =>
                              setPrivacy((p) => ({
                                ...p,
                                [field]: checked === true,
                              }))
                            }
                          />
                          <Label htmlFor={field}>{label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />
              <div className="flex justify-end">
                <Button onClick={handleSavePrivacy} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Privacy Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Display Name</CardTitle>
              <CardDescription>
                This is the name shown publicly on your blog posts and wealthboard. Use an alias to stay anonymous.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display-name">Public Display Name</Label>
                <Input
                  id="display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Anonymous"
                />
                <p className="text-xs text-muted-foreground">
                  This replaces your real name everywhere on the public site.
                </p>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button onClick={handleSavePrivacy} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
