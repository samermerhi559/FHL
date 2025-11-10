import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ArrowUp, ArrowDown, GitCompare } from 'lucide-react';
import { cn } from '../ui/utils';

const entityCompareData = [
  { metric: 'Revenue', us: 12500, uk: 8200, apac: 15300 },
  { metric: 'EBITDA', us: 3200, uk: 1800, apac: 4100 },
  { metric: 'Cash', us: 8500, uk: 6200, apac: 9600 },
  { metric: 'AR', us: 2800, uk: 2100, apac: 3300 },
  { metric: 'AP', us: 1500, uk: 1200, apac: 1900 },
];

const timeCompareData = [
  { month: 'May', thisYear: 18200, lastYear: 16800 },
  { month: 'Jun', thisYear: 19100, lastYear: 17200 },
  { month: 'Jul', thisYear: 18800, lastYear: 17600 },
  { month: 'Aug', thisYear: 20200, lastYear: 18100 },
  { month: 'Sep', thisYear: 21300, lastYear: 18900 },
  { month: 'Oct', thisYear: 22100, lastYear: 19200 },
];

const segmentCompareData = [
  { segment: 'Enterprise', revenue: 18200, margin: 72 },
  { segment: 'SMB', revenue: 8900, margin: 64 },
  { segment: 'SaaS', revenue: 15600, margin: 78 },
  { segment: 'Consulting', revenue: 11500, margin: 58 },
];

const varianceData = [
  { metric: 'Revenue', actual: 22100, budget: 21000, variance: 5.2, status: 'favorable' },
  { metric: 'EBITDA', actual: 5200, budget: 4800, variance: 8.3, status: 'favorable' },
  { metric: 'Cash', actual: 24300, budget: 26400, variance: -7.9, status: 'unfavorable' },
  { metric: 'Headcount', actual: 248, budget: 245, variance: 1.2, status: 'unfavorable' },
];

export function ComparePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="mb-2">Compare Hub</h2>
        <p className="text-muted-foreground">
          Side-by-side comparisons across entities, time periods, and segments
        </p>
      </div>

      {/* Compare Tabs */}
      <Tabs defaultValue="entities">
        <TabsList>
          <TabsTrigger value="entities">Entities</TabsTrigger>
          <TabsTrigger value="time">Time Periods</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
        </TabsList>

        {/* Entities Compare */}
        <TabsContent value="entities" className="space-y-6">
          <div className="flex items-center gap-4">
            <Select defaultValue="consolidated">
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consolidated">All Entities</SelectItem>
                <SelectItem value="us-uk">US vs UK</SelectItem>
                <SelectItem value="regions">By Region</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline">
              <GitCompare className="mr-1 h-3 w-3" />
              3 entities selected
            </Badge>
          </div>

          {/* Entity KPI Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-4">
              <h4 className="mb-3 text-center">US Operations</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground">Revenue</p>
                  <p className="text-2xl">$12.5M</p>
                </div>
                <div>
                  <p className="text-muted-foreground">EBITDA Margin</p>
                  <p className="text-2xl">25.6%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cash</p>
                  <p className="text-2xl">$8.5M</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="mb-3 text-center">UK Operations</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground">Revenue</p>
                  <p className="text-2xl">$8.2M</p>
                </div>
                <div>
                  <p className="text-muted-foreground">EBITDA Margin</p>
                  <p className="text-2xl">22.0%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cash</p>
                  <p className="text-2xl">$6.2M</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="mb-3 text-center">APAC Region</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground">Revenue</p>
                  <p className="text-2xl">$15.3M</p>
                </div>
                <div>
                  <p className="text-muted-foreground">EBITDA Margin</p>
                  <p className="text-2xl">26.8%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cash</p>
                  <p className="text-2xl">$9.6M</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Entity Chart */}
          <Card className="p-6">
            <h3 className="mb-4">Key Metrics by Entity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={entityCompareData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="metric" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                <Bar dataKey="us" name="US" fill="hsl(var(--primary))" />
                <Bar dataKey="uk" name="UK" fill="hsl(var(--secondary))" />
                <Bar dataKey="apac" name="APAC" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Time Periods Compare */}
        <TabsContent value="time" className="space-y-6">
          <div className="flex items-center gap-4">
            <Select defaultValue="mom">
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mom">Month over Month</SelectItem>
                <SelectItem value="qoq">Quarter over Quarter</SelectItem>
                <SelectItem value="yoy">Year over Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Variance Bridge */}
          <Card className="p-6">
            <h3 className="mb-4">Actual vs Budget Variance</h3>
            <div className="space-y-3">
              {varianceData.map((item) => (
                <div key={item.metric} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h4>{item.metric}</h4>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span>Actual: ${item.actual.toLocaleString()}</span>
                      <span>Budget: ${item.budget.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'flex items-center gap-1 text-xl',
                        item.status === 'favorable' ? 'text-green-500' : 'text-red-500'
                      )}
                    >
                      {item.status === 'favorable' ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                      {Math.abs(item.variance)}%
                    </span>
                    <Badge variant={item.status === 'favorable' ? 'default' : 'destructive'}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Time Chart */}
          <Card className="p-6">
            <h3 className="mb-4">Revenue: This Year vs Last Year</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeCompareData}>
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="thisYear"
                  name="This Year"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="lastYear"
                  name="Last Year"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Segments Compare */}
        <TabsContent value="segments" className="space-y-6">
          <div className="flex items-center gap-4">
            <Select defaultValue="bu">
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bu">By Business Unit</SelectItem>
                <SelectItem value="customer">By Customer Tier</SelectItem>
                <SelectItem value="product">By Product Line</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Segment Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {segmentCompareData.map((segment) => (
              <Card key={segment.segment} className="p-4">
                <h4 className="mb-3">{segment.segment}</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-muted-foreground">Revenue</p>
                    <p className="text-2xl">${(segment.revenue / 1000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Margin</p>
                    <p className="text-2xl">{segment.margin}%</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Segment Chart */}
          <Card className="p-6">
            <h3 className="mb-4">Revenue & Margin by Segment</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={segmentCompareData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="segment" className="text-muted-foreground" />
                <YAxis yAxisId="left" className="text-muted-foreground" />
                <YAxis yAxisId="right" orientation="right" className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" name="Revenue ($K)" fill="hsl(var(--primary))" />
                <Bar yAxisId="right" dataKey="margin" name="Margin (%)" fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
