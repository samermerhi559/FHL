import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  FileText,
  Download,
  Eye,
  Star,
  Calendar,
  FileBarChart,
  FileSpreadsheet,
  Plus,
} from 'lucide-react';

const boardPackReports = [
  {
    id: '1',
    name: 'October 2024 Board Pack',
    date: '2024-11-01',
    size: '4.2 MB',
    status: 'ready',
  },
  {
    id: '2',
    name: 'Q3 2024 Board Pack',
    date: '2024-10-01',
    size: '8.6 MB',
    status: 'ready',
  },
  {
    id: '3',
    name: 'September 2024 Board Pack',
    date: '2024-10-01',
    size: '4.1 MB',
    status: 'ready',
  },
];

const savedViews = [
  {
    id: '1',
    name: 'AR Deep Dive - Enterprise Customers',
    section: 'Accounts Receivable',
    filters: 'Entity: US | Segment: Enterprise | Period: Oct 2024',
    starred: true,
  },
  {
    id: '2',
    name: 'Cash Projection Analysis',
    section: 'Liquidity',
    filters: 'Entity: Consolidated | Period: TTM',
    starred: true,
  },
  {
    id: '3',
    name: 'Top 10 Overdue Invoices',
    section: 'Accounts Receivable',
    filters: 'Entity: All | Aging: >60 days',
    starred: false,
  },
  {
    id: '4',
    name: 'Profitability by BU',
    section: 'Profitability',
    filters: 'Entity: Consolidated | Segment: By BU',
    starred: false,
  },
];

const exportTemplates = [
  {
    id: '1',
    name: 'Executive Dashboard Export',
    format: 'PDF',
    sections: ['Overview', 'Cash', 'AR', 'P&L'],
  },
  {
    id: '2',
    name: 'AR Aging Detail',
    format: 'Excel',
    sections: ['AR'],
  },
  {
    id: '3',
    name: 'Complete Financial Package',
    format: 'PDF',
    sections: ['All Sections'],
  },
];

export function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="mb-2">Reports</h2>
        <p className="text-muted-foreground">
          Board packs, saved views, and export templates
        </p>
      </div>

      {/* Board Pack Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3>Board Pack PDFs</h3>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Generate New Pack
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {boardPackReports.map((report) => (
            <Card key={report.id} className="p-4">
              <div className="mb-4 flex items-start justify-between">
                <div className="rounded-lg bg-primary/10 p-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <Badge>PDF</Badge>
              </div>
              <h4 className="mb-2">{report.name}</h4>
              <div className="mb-4 flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(report.date).toLocaleDateString()}
                </div>
                <span>•</span>
                <span>{report.size}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Eye className="h-3 w-3" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Download className="h-3 w-3" />
                  Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Saved Views */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3>Saved Views</h3>
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Save Current View
          </Button>
        </div>
        <Card className="p-6">
          <div className="space-y-3">
            {savedViews.map((view) => (
              <div
                key={view.id}
                className="flex items-start justify-between rounded-lg border p-4 transition-all hover:bg-muted/50"
              >
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                  >
                    <Star
                      className={`h-4 w-4 ${
                        view.starred ? 'fill-yellow-500 text-yellow-500' : ''
                      }`}
                    />
                  </Button>
                  <div>
                    <h4 className="mb-1">{view.name}</h4>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Badge variant="outline">{view.section}</Badge>
                      <span>•</span>
                      <span>{view.filters}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Load View
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Export Templates */}
      <div>
        <div className="mb-4">
          <h3>Export Templates</h3>
          <p className="text-muted-foreground">
            Pre-configured export templates for common reporting needs
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {exportTemplates.map((template) => (
            <Card key={template.id} className="p-4">
              <div className="mb-4 flex items-start justify-between">
                <div className="rounded-lg bg-blue-500/10 p-3">
                  {template.format === 'PDF' ? (
                    <FileBarChart className="h-6 w-6 text-blue-500" />
                  ) : (
                    <FileSpreadsheet className="h-6 w-6 text-green-500" />
                  )}
                </div>
                <Badge variant="outline">{template.format}</Badge>
              </div>
              <h4 className="mb-2">{template.name}</h4>
              <p className="mb-4 text-muted-foreground">
                Includes: {template.sections.join(', ')}
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Download className="h-4 w-4" />
                Export Now
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Exports */}
      <Card className="p-6">
        <h3 className="mb-4">Recent Exports</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p>AR_Aging_Detail_2024-11-07.xlsx</p>
                <p className="text-muted-foreground">Exported 2 hours ago</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <Download className="h-3 w-3" />
              Re-download
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p>Cash_Projection_13Week_2024-11-07.pdf</p>
                <p className="text-muted-foreground">Exported 5 hours ago</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <Download className="h-3 w-3" />
              Re-download
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p>Board_Pack_October_2024.pdf</p>
                <p className="text-muted-foreground">Exported 1 day ago</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <Download className="h-3 w-3" />
              Re-download
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
