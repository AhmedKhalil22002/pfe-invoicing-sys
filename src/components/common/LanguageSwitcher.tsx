import { cn } from '@/lib/utils';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  return (
    <div className={cn(className)}>
      <Select>
        <SelectTrigger>
          <Globe className="w-4 h-4 mr-2" />
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fr">Français</SelectItem>
          <SelectItem value="en">Anglais</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
