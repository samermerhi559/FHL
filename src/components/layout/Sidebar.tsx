import {
  LayoutDashboard,
  Droplets,
  ArrowDownToLine,
  ArrowUpToLine,
  TrendingUp,
  Repeat,
  DollarSign,
  Coins,
  FileText,
  Scale,
  Target,
  Settings,
  ChevronLeft,
  Home,
} from 'lucide-react';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';
import { useState } from 'react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole?: 'admin' | 'user';
}

const iconMap: Record<string, any> = {
  Home,
  Droplets,
  ArrowDownToLine,
  ArrowUpToLine,
  TrendingUp,
  Repeat,
  DollarSign,
  Coins,
  FileText,
  Scale,
  Target,
  Settings,
};

const sections = [
  { id: 'overview', name: 'Home', icon: 'Home' },
  { id: 'liquidity', name: 'Liquidity', icon: 'Droplets' },
  { id: 'ar', name: 'Incomes', icon: 'ArrowDownToLine' },
  { id: 'ap', name: 'Expenses', icon: 'ArrowUpToLine' },
  { id: 'profitability', name: 'Profitability', icon: 'TrendingUp' },
  { id: 'working-capital', name: 'Treasury', icon: 'Repeat' },
  { id: 'revenue-health', name: 'Revenue', icon: 'DollarSign' },
  { id: 'fx-treasury', name: 'FX & Treasury', icon: 'Coins' },
  { id: 'tax-vat', name: 'Files', icon: 'FileText' },
  { id: 'balance-sheet', name: 'Accounting', icon: 'Scale' },
  { id: 'concentration-risk', name: 'Master Data', icon: 'Target' },
];

export function Sidebar({ currentPage, onNavigate, userRole = 'user' }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        'border-r bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Collapse button */}
      <div className="flex items-center justify-end border-b p-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          <ChevronLeft
            className={cn(
              'h-4 w-4 transition-transform',
              collapsed && 'rotate-180'
            )}
          />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 p-2">
        {sections.map((section) => {
          const Icon = iconMap[section.icon];
          const isActive = currentPage === section.id;

          return (
            <button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded px-3 py-2 transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{section.name}</span>}
            </button>
          );
        })}

        {/* Admin section */}
        {userRole === 'admin' && (
          <>
            <div className="my-2 h-px bg-sidebar-border" />
            <button
              onClick={() => onNavigate('ops-admin')}
              className={cn(
                'flex w-full items-center gap-3 rounded px-3 py-2 transition-colors',
                currentPage === 'ops-admin'
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              <Settings className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">Ops / Admin</span>}
            </button>
          </>
        )}
      </nav>
    </div>
  );
}
