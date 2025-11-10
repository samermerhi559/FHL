import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Download, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../ui/utils';

interface SectionPageProps {
  sectionId: string;
  sectionName: string;
}

// Mock data generators for different sections
const trendData = [
  { month: 'May', value: 7800 },
  { month: 'Jun', value: 8000 },
  { month: 'Jul', value: 7900 },
  { month: 'Aug', value: 8100 },
  { month: 'Sep', value: 8300 },
  { month: 'Oct', value: 8200 },
];

const agingData = [
  { bucket: 'Current', amount: 4200, pct: 51 },
  { bucket: '1-30 days', amount: 2100, pct: 26 },
  { bucket: '31-60 days', amount: 1200, pct: 15 },
  { bucket: '61-90 days', amount: 480, pct: 6 },
  { bucket: '>90 days', amount: 220, pct: 3 },
];

const topCustomersData = [
  { name: 'Enterprise Corp', amount: 1850, dso: 38, overdue: 120, trend: 'up' },
  { name: 'Global Industries', amount: 1420, dso: 42, overdue: 280, trend: 'up' },
  { name: 'Tech Solutions', amount: 980, dso: 35, overdue: 0, trend: 'down' },
  { name: 'Acme Partners', amount: 760, dso: 45, overdue: 185, trend: 'up' },
  { name: 'Digital Ventures', amount: 640, dso: 31, overdue: 0, trend: 'down' },
];

const detailData = [
  {
    id: 'INV-2024-1247',
    customer: 'Enterprise Corp',
    date: '2024-08-25',
    due: '2024-09-24',
    amount: 380000,
    days: 72,
    status: 'overdue',
  },
  {
    id: 'INV-2024-1389',
    customer: 'Global Industries',
    date: '2024-09-15',
    due: '2024-10-15',
    amount: 280000,
    days: 23,
    status: 'current',
  },
  {
    id: 'INV-2024-1412',
    customer: 'Tech Solutions',
    date: '2024-10-01',
    due: '2024-10-31',
    amount: 156000,
    days: 7,
    status: 'current',
  },
  {
    id: 'INV-2024-1445',
    customer: 'Acme Partners',
    date: '2024-09-10',
    due: '2024-10-10',
    amount: 185000,
    days: 28,
    status: 'warning',
  },
  {
    id: 'INV-2024-1498',
    customer: 'Digital Ventures',
    date: '2024-10-10',
    due: '2024-11-09',
    amount: 92000,
    days: -2,
    status: 'current',
  },
];

const sectionKPIs: Record<string, Array<{ label: string; value: string; change?: number; status?: string }>> = {
  ar: [
    { label: 'DSO', value: '42 days', change: 3, status: 'warning' },
    { label: 'Open AR', value: '$8.2M', change: 1.5 },
    { label: '% Overdue', value: '18%', change: 2.3, status: 'warning' },
    { label: 'Collection Rate', value: '92%', change: -8 },
  ],
  liquidity: [
    { label: 'Cash Position', value: '$24.3M', change: 8.2 },
    { label: 'Quick Ratio', value: '2.4x', change: 0.3 },
    { label: 'Working Capital', value: '$6.8M', change: 4.2 },
    { label: 'Burn Rate', value: '$1.2M/mo', change: -5.3 },
  ],
  ap: [
    { label: 'DPO', value: '35 days', change: -2 },
    { label: 'Open AP', value: '$4.6M', change: -1.2 },
    { label: 'Due in 7 Days', value: '$890K' },
    { label: 'Overdue', value: '$120K', status: 'warning' },
  ],
};

export function SectionPage({ sectionId, sectionName }: SectionPageProps) {
  const kpis = sectionKPIs[sectionId] || sectionKPIs.ar;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2>{sectionName}</h2>
        <div className="flex items-center gap-2">
          <Button size="sm">
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex items-center gap-6">
          <button className="border-b-2 border-primary pb-3 text-primary">
            OVERVIEW
          </button>
          <button className="pb-3 text-muted-foreground hover:text-foreground">
            DETAILS
          </button>
          <button className="pb-3 text-muted-foreground hover:text-foreground">
            TRENDS
          </button>
          <button className="pb-3 text-muted-foreground hover:text-foreground">
            REPORTS
          </button>
        </div>
      </div>

      {/* KPIs Strip */}
      <div className="flex items-center gap-8">
        {kpis.map((kpi, idx) => (
          <div key={idx}>
            <p className="text-muted-foreground">{kpi.label}</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{kpi.value}</span>
              {kpi.change !== undefined && (
                <span
                  className={cn(
                    'flex items-center gap-0.5',
                    kpi.change > 0 ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {kpi.change > 0 ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {Math.abs(kpi.change)}%
                </span>
              )}
              {kpi.status === 'warning' && (
                <Badge variant="secondary">Warning</Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Layout Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Trend */}
        <Card className="p-6 lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h3>Trend (6 months)</h3>
            <Badge variant="outline">api_{sectionId}_trend</Badge>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Center: Structure */}
        <Card className="p-6 lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h3>Aging Breakdown</h3>
            <Badge variant="outline">api_{sectionId}_aging</Badge>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={agingData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" className="text-muted-foreground" />
              <YAxis dataKey="bucket" type="category" className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Bar dataKey="amount" fill="hsl(var(--primary))">
                {agingData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === 4
                        ? 'hsl(var(--destructive))'
                        : index === 3
                        ? 'hsl(var(--warning))'
                        : 'hsl(var(--primary))'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Right: Leaders & Laggards */}
        <Card className="p-6 lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h3>Top Customers</h3>
            <Badge variant="outline">api_{sectionId}_top</Badge>
          </div>
          <div className="space-y-3">
            {topCustomersData.map((customer, idx) => (
              <div key={idx} className="rounded-lg border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span>{customer.name}</span>
                  <Badge variant={customer.trend === 'up' ? 'destructive' : 'default'}>
                    {customer.trend === 'up' ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-muted-foreground">
                  <div>
                    <div className="text-xs">Amount</div>
                    <div className="text-foreground">${customer.amount}K</div>
                  </div>
                  <div>
                    <div className="text-xs">DSO</div>
                    <div className="text-foreground">{customer.dso}d</div>
                  </div>
                  <div>
                    <div className="text-xs">Overdue</div>
                    <div className={cn(
                      'text-foreground',
                      customer.overdue > 0 && 'text-red-500'
                    )}>
                      ${customer.overdue}K
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom: Workbench */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3>Detailed Transactions</h3>
            <p className="text-muted-foreground">
              Click any row to view customer SOA
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">api_{sectionId}_detail</Badge>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Days</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detailData.map((row) => (
                <TableRow key={row.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-mono">{row.id}</TableCell>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.due}</TableCell>
                  <TableCell className="text-right">
                    ${row.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className={cn(
                    'text-right',
                    row.days > 60 && 'text-red-500',
                    row.days > 30 && row.days <= 60 && 'text-yellow-500'
                  )}>
                    {row.days > 0 ? `${row.days}` : `-${Math.abs(row.days)}`}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        row.status === 'overdue'
                          ? 'destructive'
                          : row.status === 'warning'
                          ? 'secondary'
                          : 'default'
                      }
                    >
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
