import { useState, useEffect, useMemo } from 'react';
import { AppBar } from './components/layout/AppBar';
import { Sidebar } from './components/layout/Sidebar';
import { RightDrawer } from './components/layout/RightDrawer';
import { Overview } from './components/overview/Overview';
import { SectionPage } from './components/sections/SectionPage';
import { AlertsPage } from './components/alerts/AlertsPage';
import { ComparePage } from './components/compare/ComparePage';
import { ReportsPage } from './components/reports/ReportsPage';
import { OpsAdminPage } from './components/ops/OpsAdminPage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './components/ui/dialog';
import { Input } from './components/ui/input';
import { Search, Command } from 'lucide-react';
import { GlobalFilters, Entity, TenantDirectoryEntry } from './types';
import {
  mockPeriods,
  mockAlerts,
  mockSections,
} from './lib/mockData';
import { tenantDirectoryService } from './services/api/tenantDirectoryService';

const buildEntitiesForTenant = (
  tenant?: TenantDirectoryEntry
): Entity[] => {
  if (!tenant) {
    return [];
  }

  return tenant.entities.map((entry) => ({
    id: entry.entity_id.toString(),
    name: entry.name,
    type: 'subsidiary',
    directoryEntityId: entry.entity_id,
    tenantId: tenant.tenant_id,
    countryCode: entry.country_code,
    baseCurrency: entry.base_currency,
  }));
};

const sectionNames: Record<string, string> = {
  liquidity: 'Liquidity',
  ar: 'Accounts Receivable',
  ap: 'Accounts Payable',
  profitability: 'Profitability',
  'working-capital': 'Working Capital',
  'revenue-health': 'Revenue Health',
  'fx-treasury': 'FX & Treasury',
  'tax-vat': 'Tax/VAT',
  'balance-sheet': 'Balance Sheet & Covenants',
  'concentration-risk': 'Concentration Risk',
  alerts: 'Alerts',
  ops: 'Ops',
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('overview');
  const [filters, setFilters] = useState<GlobalFilters>({
    period: mockPeriods[0],
  });
  const [tenantDirectory, setTenantDirectory] = useState<TenantDirectoryEntry[]>([]);
  const [tenantLoading, setTenantLoading] = useState(true);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadAlerts = mockAlerts.filter((a) => !a.isRead).length;
  const userRole = 'admin'; // In real app, this would come from auth

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const loadTenants = async () => {
      try {
        const directory = await tenantDirectoryService.fetchDirectory(
          controller.signal
        );
        if (!active) return;
        setTenantDirectory(directory);
        if (directory.length > 0) {
          const [firstTenant] = directory;
          const tenantEntities = buildEntitiesForTenant(firstTenant);
          setFilters((prev) => ({
            ...prev,
            tenant: {
              id: firstTenant.tenant_id,
              name: firstTenant.tenant_name,
            },
            entity: tenantEntities[0] ?? prev.entity,
          }));
        } else {
          setFilters((prev) => ({
            ...prev,
            entity: prev.entity,
          }));
        }
      } catch (error) {
        if (!active) return;
        console.error('Failed to load tenant directory', error);
        setFilters((prev) => ({
          ...prev,
          entity: prev.entity,
        }));
      } finally {
        if (active) {
          setTenantLoading(false);
        }
      }
    };

    loadTenants();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Search shortcut: /
      if (e.key === '/' && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
      }
      // Close search: Escape
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
        setSearchQuery('');
      }
      // Help overlay: ?
      if (e.key === '?' && !searchOpen) {
        e.preventDefault();
        // Could show help overlay here
        console.log('Help overlay would appear here');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (aiEnabled) {
      // Keep AI drawer open but update context
    }
  };

  const handleAlertsClick = () => {
    setCurrentPage('alerts');
  };

  const handleSearchClick = () => {
    setSearchOpen(true);
  };

  const selectedTenant = useMemo(
    () =>
      tenantDirectory.find(
        (entry) => entry.tenant_id === filters.tenant?.id
      ),
    [tenantDirectory, filters.tenant]
  );

  const entityOptions = useMemo(
    () => buildEntitiesForTenant(selectedTenant),
    [selectedTenant]
  );

  useEffect(() => {
    if (
      entityOptions.length > 0 &&
      !entityOptions.some(
        (entity) => entity.id === filters.entity?.id
      )
    ) {
      setFilters((prev) => ({
        ...prev,
        entity: entityOptions[0],
      }));
    }
  }, [entityOptions, filters.entity]);

  const handleTenantChange = (tenantId: number) => {
    const tenantEntry = tenantDirectory.find(
      (entry) => entry.tenant_id === tenantId
    );
    const tenantEntities = buildEntitiesForTenant(tenantEntry);
    setFilters((prev) => ({
      ...prev,
      tenant: tenantEntry
        ? { id: tenantEntry.tenant_id, name: tenantEntry.tenant_name }
        : undefined,
      entity: tenantEntities[0],
    }));
  };

  const searchResults = searchQuery
    ? mockSections
        .filter((s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const renderPage = () => {
    if (currentPage === 'overview') {
      return <Overview onNavigateToSection={handleNavigate} />;
    }

    if (currentPage === 'compare') {
      return <ComparePage />;
    }

    if (currentPage === 'reports') {
      return <ReportsPage />;
    }

    if (currentPage === 'alerts') {
      return <AlertsPage onNavigateToSection={handleNavigate} />;
    }

    if (currentPage === 'ops-admin') {
      return <OpsAdminPage />;
    }

    // Section pages
    if (sectionNames[currentPage]) {
      return (
        <SectionPage
          sectionId={currentPage}
          sectionName={sectionNames[currentPage]}
        />
      );
    }

    return <Overview onNavigateToSection={handleNavigate} />;
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* App Bar */}
      <AppBar
        filters={filters}
        onFiltersChange={setFilters}
        tenantOptions={tenantDirectory}
        tenantLoading={tenantLoading}
        entityOptions={entityOptions}
        onTenantChange={handleTenantChange}
        unreadAlerts={unreadAlerts}
        onAlertsClick={handleAlertsClick}
        aiEnabled={aiEnabled}
        onAiToggle={() => setAiEnabled(!aiEnabled)}
        onSearchClick={handleSearchClick}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          userRole={userRole}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-muted/50 p-6">
          <div className="mx-auto max-w-[1600px]">{renderPage()}</div>
        </main>

        {/* Right Drawer (AI Insights) */}
        <RightDrawer
          isOpen={aiEnabled}
          onClose={() => setAiEnabled(false)}
          section={currentPage}
          context={
            [
              filters.tenant?.name,
              filters.entity?.name ?? 'All Entities',
              filters.period.label,
            ]
              .filter(Boolean)
              .join(' | ')
          }
        />
      </div>

      {/* Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search / Jump To
            </DialogTitle>
            <DialogDescription>
              Search for sections, customers, suppliers, accounts, or KPIs
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for sections, customers, suppliers, accounts, or KPIs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>

            {searchQuery && (
              <div className="space-y-2">
                <p className="text-muted-foreground">Sections</p>
                {searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        handleNavigate(result.id);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted"
                    >
                      <div className="rounded bg-primary/10 p-2">
                        <Command className="h-4 w-4" />
                      </div>
                      <div>
                        <p>{result.name}</p>
                        <p className="text-muted-foreground">
                          {result.kpis[0]?.label}: {result.kpis[0]?.value}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="py-8 text-center text-muted-foreground">
                    No results found
                  </p>
                )}
              </div>
            )}

            {!searchQuery && (
              <div className="space-y-2 text-muted-foreground">
                <p>Recent searches</p>
                <div className="space-y-1">
                  <div className="rounded-lg border p-2 px-3">Enterprise Corp</div>
                  <div className="rounded-lg border p-2 px-3">Overdue invoices</div>
                  <div className="rounded-lg border p-2 px-3">Cash projection</div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
