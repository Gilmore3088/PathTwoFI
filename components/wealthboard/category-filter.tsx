'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { WealthCategory } from '@/types/wealth.types';

interface CategoryFilterProps {
  value: WealthCategory | 'All';
  onChange: (value: WealthCategory | 'All') => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onChange(v as WealthCategory | 'All')}
    >
      <TabsList>
        <TabsTrigger value="All">All</TabsTrigger>
        <TabsTrigger value="Combined">Combined</TabsTrigger>
        <TabsTrigger value="His">His</TabsTrigger>
        <TabsTrigger value="Her">Her</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
