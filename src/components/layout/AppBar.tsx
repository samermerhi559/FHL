import { Bell, Search, Sparkles, Home } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import { Entity, GlobalFilters, TenantDirectoryEntry } from '../../types';
import { mockPeriods } from '../../lib/mockData';
import { cn } from '../ui/utils';

interface AppBarProps {
  filters: GlobalFilters;
  onFiltersChange: (filters: GlobalFilters) => void;
  tenantOptions: TenantDirectoryEntry[];
  tenantLoading: boolean;
  entityOptions: Entity[];
  onTenantChange: (tenantId: number) => void;
  unreadAlerts: number;
  onAlertsClick: () => void;
  aiEnabled: boolean;
  onAiToggle: () => void;
  onSearchClick: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const topNavItems = [
  { id: 'overview', label: 'Dashboard' },
  { id: 'reports', label: 'Reports' },
  { id: 'compare', label: 'Compare' },
  { id: 'alerts', label: 'Alerts' },
];

export function AppBar({
  filters,
  onFiltersChange,
  tenantOptions,
  tenantLoading,
  entityOptions,
  onTenantChange,
  unreadAlerts,
  onAlertsClick,
  aiEnabled,
  onAiToggle,
  onSearchClick,
  currentPage,
  onNavigate,
}: AppBarProps) {
  return (
    <div className="border-b bg-white">
      {/* Top navigation bar */}
      <div className="flex items-center justify-between border-b px-6 py-3">
        {/* Left: Logo and main navigation */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
              <Home className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-primary">ERP</span>
          </div>

          {/* Horizontal navigation */}
          <nav className="flex items-center gap-1">
            {topNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'px-4 py-2 transition-colors',
                  currentPage === item.id
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
                {item.id === 'alerts' && unreadAlerts > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1">
                    {unreadAlerts}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSearchClick}
            title="Search (Press /)"
          >
            <Search className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onAlertsClick}
            className="relative"
          >
            <Bell className="h-4 w-4" />
            {unreadAlerts > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-4 min-w-4 px-1"
              >
                {unreadAlerts}
              </Badge>
            )}
          </Button>

          <Button
            variant={aiEnabled ? 'default' : 'ghost'}
            size="sm"
            onClick={onAiToggle}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            AI Explain
          </Button>
        </div>
      </div>

      {/* Second row: Filters */}
      <div className="flex items-center gap-3 px-6 py-2">
        {/* Tenant */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Tenant:</span>
          <Select
            value={filters.tenant ? String(filters.tenant.id) : undefined}
            onValueChange={(value) => onTenantChange(Number(value))}
            disabled={tenantLoading || tenantOptions.length === 0}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue
                placeholder={
                  tenantLoading ? 'Loading tenants...' : 'Select tenant'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {tenantOptions.map((tenant) => (
                <SelectItem
                  key={tenant.tenant_id}
                  value={tenant.tenant_id.toString()}
                >
                  {tenant.tenant_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Entity */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Entity:</span>
          <Select
            value={filters.entity?.id}
            onValueChange={(value) => {
              const entity = entityOptions.find((e) => e.id === value);
              if (entity) onFiltersChange({ ...filters, entity });
            }}
            disabled={entityOptions.length === 0}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={
                  entityOptions.length === 0
                    ? 'No entities'
                    : 'Select entity'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {entityOptions.map((entity) => (
                <SelectItem key={entity.id} value={entity.id}>
                  {entity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Period */}
        <Select
          value={filters.period.id}
          onValueChange={(value) => {
            const period = mockPeriods.find((p) => p.id === value);
            if (period) onFiltersChange({ ...filters, period });
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {mockPeriods.map((period) => (
              <SelectItem key={period.id} value={period.id}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
