import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
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
  Bell,
  Settings,
  ChevronRight,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { mockSections, mock13WeekCashData, mockHeadlines } from '../../lib/mockData';
import { cn } from '../ui/utils';
import { HealthStatus } from '../../types';

interface OverviewProps {
  onNavigateToSection: (sectionId: string) => void;
}

const iconMap: Record<string, any> = {
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
  Bell,
  Settings,
};

const statusColors: Record<HealthStatus, string> = {
  healthy: 'bg-green-500/20 border-green-500',
  warning: 'bg-yellow-500/20 border-yellow-500',
  critical: 'bg-red-500/20 border-red-500',
};

const statusBadgeColors: Record<HealthStatus, 'default' | 'secondary' | 'destructive'> = {
  healthy: 'default',
  warning: 'secondary',
  critical: 'destructive',
};

function MiniSparkline({ data }: { data: number[] }) {
  const chartData = data.map((value, index) => ({ x: index, y: value }));
  
  return (
    <ResponsiveContainer width="100%" height={32}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="y"
          stroke="currentColor"
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function Overview({ onNavigateToSection }: OverviewProps) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Dashboard</h2>
          <p className="text-muted-foreground">Executive business health overview</p>
        </div>
        <Button size="sm">
          Export Report
        </Button>
      </div>
      {/* Headlines */}
      <div className="grid gap-4 md:grid-cols-3" style={{ display: 'none' }}>
        {mockHeadlines.map((headline, index) => (
          <Card key={index} className="p-4">
            <p className="mb-2 text-muted-foreground">{headline.label}</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{headline.value}</span>
              {headline.trend === 'up' ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Section Cards */}
      <div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockSections.map((section) => {
            const Icon = iconMap[section.icon];
            return (
              <Card
                key={section.id}
                className="group cursor-pointer transition-all hover:shadow-lg"
                onClick={() => onNavigateToSection(section.id)}
              >
                <div className="p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        'rounded-lg p-2',
                        section.status === 'healthy' && 'bg-green-500/10',
                        section.status === 'warning' && 'bg-yellow-500/10',
                        section.status === 'critical' && 'bg-red-500/10'
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <Badge variant={statusBadgeColors[section.status]}>
                        {section.status}
                      </Badge>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>

                  <h4 className="mb-3">{section.name}</h4>

                  <div className="space-y-2">
                    {section.kpis.map((kpi, idx) => (
                      <div key={idx}>
                        <p className="text-muted-foreground">{kpi.label}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{kpi.value}</span>
                          {kpi.change !== undefined && (
                            <span
                              className={cn(
                                'flex items-center gap-0.5',
                                kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'
                              )}
                            >
                              {kpi.trend === 'up' ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : (
                                <ArrowDown className="h-3 w-3" />
                              )}
                              {Math.abs(kpi.change)}%
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {section.sparklineData && (
                    <div className="mt-4 h-12 opacity-60">
                      <MiniSparkline data={section.sparklineData} />
                    </div>
                  )}

                  <div className="mt-3 text-muted-foreground">
                    Source: api_{section.id}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
