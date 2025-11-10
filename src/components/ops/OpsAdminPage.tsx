import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import {
  Database,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Clock,
  Server,
  Users,
  Shield,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useState } from 'react';

const materializedViews = [
  { name: 'mv_ar_aging_summary', status: 'current', lastRefresh: '2m ago', nextRefresh: '28m' },
  { name: 'mv_ap_aging_summary', status: 'current', lastRefresh: '2m ago', nextRefresh: '28m' },
  { name: 'mv_cash_projection', status: 'current', lastRefresh: '5m ago', nextRefresh: '25m' },
  { name: 'mv_pnl_summary', status: 'stale', lastRefresh: '45m ago', nextRefresh: 'pending' },
  { name: 'mv_balance_sheet', status: 'current', lastRefresh: '2m ago', nextRefresh: '28m' },
];

const smokeTests = [
  { name: 'Data Completeness', status: 'passed', lastRun: '2m ago', duration: '1.2s' },
  { name: 'Referential Integrity', status: 'passed', lastRun: '2m ago', duration: '2.8s' },
  { name: 'Balance Reconciliation', status: 'passed', lastRun: '2m ago', duration: '4.1s' },
  { name: 'FX Rate Freshness', status: 'warning', lastRun: '2m ago', duration: '0.5s' },
  { name: 'API Endpoints', status: 'passed', lastRun: '30s ago', duration: '3.2s' },
];

const tenantInfo = {
  id: 'acme-corp-prod',
  name: 'Acme Corp',
  environment: 'production',
  version: '2.4.1',
  uptime: '99.98%',
  entities: 4,
  users: 24,
  dataSize: '84 GB',
};

export function OpsAdminPage() {
  const [concurrentRefresh, setConcurrentRefresh] = useState(true);
  const [refreshing, setRefreshing] = useState<string | null>(null);

  const handleRefresh = (mvName: string) => {
    setRefreshing(mvName);
    setTimeout(() => setRefreshing(null), 2000);
  };

  const handleRefreshAll = () => {
    setRefreshing('all');
    setTimeout(() => setRefreshing(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="mb-2">Ops / Admin</h2>
        <p className="text-muted-foreground">
          Technical controls and system diagnostics (role-gated)
        </p>
      </div>

      {/* System Status Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
            <Server className="h-4 w-4" />
            System Health
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-2xl">Healthy</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
            <Database className="h-4 w-4" />
            Data Quality
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">99.2%</span>
            <Badge>Good</Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            Last Refresh
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">2m ago</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            Active Users
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">12</span>
          </div>
        </Card>
      </div>

      {/* Materialized Views */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="mb-1">Materialized Views</h3>
            <p className="text-muted-foreground">
              Manage data refresh and concurrency settings
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="concurrent"
                checked={concurrentRefresh}
                onCheckedChange={setConcurrentRefresh}
              />
              <Label htmlFor="concurrent">Concurrent Refresh</Label>
            </div>
            <Button
              onClick={handleRefreshAll}
              disabled={refreshing === 'all'}
              className="gap-2"
            >
              {refreshing === 'all' ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh All
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>View Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Refresh</TableHead>
              <TableHead>Next Refresh</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materializedViews.map((mv) => (
              <TableRow key={mv.name}>
                <TableCell className="font-mono">{mv.name}</TableCell>
                <TableCell>
                  <Badge variant={mv.status === 'current' ? 'default' : 'secondary'}>
                    {mv.status}
                  </Badge>
                </TableCell>
                <TableCell>{mv.lastRefresh}</TableCell>
                <TableCell>{mv.nextRefresh}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRefresh(mv.name)}
                    disabled={refreshing === mv.name}
                  >
                    {refreshing === mv.name ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Smoke Tests */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="mb-1">Smoke Tests</h3>
            <p className="text-muted-foreground">
              Automated data validation and integrity checks
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Play className="h-4 w-4" />
            Run All Tests
          </Button>
        </div>

        <div className="space-y-3">
          {smokeTests.map((test) => (
            <div
              key={test.name}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-4">
                {test.status === 'passed' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : test.status === 'warning' ? (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <h4>{test.name}</h4>
                  <p className="text-muted-foreground">
                    Last run: {test.lastRun} • Duration: {test.duration}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  test.status === 'passed'
                    ? 'default'
                    : test.status === 'warning'
                    ? 'secondary'
                    : 'destructive'
                }
              >
                {test.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Tenant Debug Info */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <h3>Current Tenant Debug</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1 text-muted-foreground">Tenant ID</p>
            <p className="font-mono">{tenantInfo.id}</p>
          </div>
          <div>
            <p className="mb-1 text-muted-foreground">Tenant Name</p>
            <p>{tenantInfo.name}</p>
          </div>
          <div>
            <p className="mb-1 text-muted-foreground">Environment</p>
            <Badge>{tenantInfo.environment}</Badge>
          </div>
          <div>
            <p className="mb-1 text-muted-foreground">Version</p>
            <p className="font-mono">{tenantInfo.version}</p>
          </div>
          <div>
            <p className="mb-1 text-muted-foreground">Uptime</p>
            <p>{tenantInfo.uptime}</p>
          </div>
          <div>
            <p className="mb-1 text-muted-foreground">Entities</p>
            <p>{tenantInfo.entities}</p>
          </div>
          <div>
            <p className="mb-1 text-muted-foreground">Active Users</p>
            <p>{tenantInfo.users}</p>
          </div>
          <div>
            <p className="mb-1 text-muted-foreground">Data Size</p>
            <p>{tenantInfo.dataSize}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button variant="outline">View Audit Log</Button>
          <Button variant="outline">Export Config</Button>
          <Button variant="outline">Run Diagnostics</Button>
        </div>
      </Card>
    </div>
  );
}
