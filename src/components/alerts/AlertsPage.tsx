import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { AlertCircle, AlertTriangle, Info, ExternalLink, CheckCircle } from 'lucide-react';
import { mockAlerts } from '../../lib/mockData';
import { Alert } from '../../types';
import { cn } from '../ui/utils';

interface AlertsPageProps {
  onNavigateToSection: (sectionId: string) => void;
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function AlertCard({ alert, onNavigate }: { alert: Alert; onNavigate: () => void }) {
  const severityConfig = {
    high: {
      icon: AlertCircle,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      badge: 'destructive' as const,
    },
    medium: {
      icon: AlertTriangle,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      badge: 'secondary' as const,
    },
    low: {
      icon: Info,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      badge: 'default' as const,
    },
  };

  const config = severityConfig[alert.severity];
  const Icon = config.icon;

  return (
    <Card className={cn('p-4 transition-all hover:shadow-lg', !alert.isRead && 'border-l-4 border-l-primary')}>
      <div className="flex items-start gap-4">
        <div className={cn('rounded-lg p-2', config.bg)}>
          <Icon className={cn('h-5 w-5', config.color)} />
        </div>
        <div className="flex-1">
          <div className="mb-2 flex items-start justify-between gap-4">
            <div>
              <h4 className="mb-1">{alert.title}</h4>
              <p className="text-muted-foreground">{alert.description}</p>
            </div>
            <Badge variant={config.badge}>{alert.severity}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>{formatTimestamp(alert.timestamp)}</span>
              <span>•</span>
              <span className="capitalize">{alert.section.replace('-', ' ')}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onNavigate} className="gap-2">
              View Details
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function AlertsPage({ onNavigateToSection }: AlertsPageProps) {
  const unreadAlerts = mockAlerts.filter((a) => !a.isRead);
  const readAlerts = mockAlerts.filter((a) => a.isRead);
  const highSeverity = mockAlerts.filter((a) => a.severity === 'high');
  const mediumSeverity = mockAlerts.filter((a) => a.severity === 'medium');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="mb-2">Alerts Center</h2>
        <p className="text-muted-foreground">
          Policy-based alerts triggered by threshold violations and anomalies
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="mb-2 text-muted-foreground">Total Active</div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{mockAlerts.length}</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="mb-2 text-muted-foreground">Unread</div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{unreadAlerts.length}</span>
            <Badge variant="destructive">New</Badge>
          </div>
        </Card>
        <Card className="p-4">
          <div className="mb-2 text-muted-foreground">High Severity</div>
          <div className="flex items-center gap-2">
            <span className="text-3xl text-red-500">{highSeverity.length}</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="mb-2 text-muted-foreground">Medium Severity</div>
          <div className="flex items-center gap-2">
            <span className="text-3xl text-yellow-500">{mediumSeverity.length}</span>
          </div>
        </Card>
      </div>

      {/* Alerts List */}
      <Tabs defaultValue="unread">
        <TabsList>
          <TabsTrigger value="unread">
            Unread ({unreadAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({mockAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="high">
            High Severity ({highSeverity.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unread" className="space-y-3">
          {unreadAlerts.length > 0 ? (
            unreadAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onNavigate={() => onNavigateToSection(alert.section)}
              />
            ))
          ) : (
            <Card className="p-12 text-center">
              <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
              <h3 className="mb-2">All caught up!</h3>
              <p className="text-muted-foreground">No unread alerts</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-3">
          {mockAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onNavigate={() => onNavigateToSection(alert.section)}
            />
          ))}
        </TabsContent>

        <TabsContent value="high" className="space-y-3">
          {highSeverity.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onNavigate={() => onNavigateToSection(alert.section)}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
