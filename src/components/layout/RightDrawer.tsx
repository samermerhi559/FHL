import { X, Sparkles, Share2, GitBranch } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

interface RightDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  section?: string;
  context?: string;
}

export function RightDrawer({ isOpen, onClose, section, context }: RightDrawerProps) {
  if (!isOpen) return null;

  const narratives: Record<string, string> = {
    overview: 'Overall business health is strong with 9 of 12 sections showing healthy status. Key concerns: AR days sales outstanding has increased to 42 days (up 3 days MoM), and customer concentration risk now exceeds policy thresholds at 58% from top 5 customers. FX exposure hedge ratio has dropped to 62%, below the 70% target. Cash position remains solid at $24.3M with projected growth to $30.1M over the next 13 weeks.',
    ar: 'Accounts Receivable DSO has increased to 42 days, 7 days above target. Open AR stands at $8.2M with 15 invoices totaling $680K now over 60 days overdue. Top 3 customers represent $4.2M (51% of total AR). Collection efficiency has declined 8% this month. Recommend immediate focus on overdue accounts, particularly Enterprise Account #1247 ($380K, 72 days overdue).',
    liquidity: 'Cash position is healthy at $24.3M, up 8.2% from last month. Quick ratio improved to 2.4x from 2.1x. 13-week cash projection shows steady growth to $30.1M driven by expected Q4 collections and new contract advances. No liquidity concerns identified. Cash concentration: 62% in operating accounts, 38% in treasury instruments yielding 4.8%.',
  };

  const apiSources: Record<string, string[]> = {
    overview: ['api_board_pack', 'api_ai_bundle', 'api_health_summary'],
    ar: ['api_ar_aging_summary', 'api_ar_overdue_list', 'api_ar_top_customers', 'api_ar_soa'],
    liquidity: ['api_cash_position', 'api_cash_projection_13w', 'api_liquidity_ratios'],
  };

  const narrative = narratives[section || 'overview'] || 'AI analysis will appear here based on the current view and filters.';
  const sources = apiSources[section || 'overview'] || ['api_generic'];

  return (
    <div className="fixed right-0 top-0 z-50 h-full w-96 border-l bg-card shadow-lg">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>AI Insights</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100%-4rem)]">
        <div className="space-y-6 p-4">
          {/* Narrative */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Explain This</span>
            </div>
            <p className="leading-relaxed">{narrative}</p>
          </div>

          <Separator />

          {/* Data Sources */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Data Sources</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sources.map((source) => (
                <Badge key={source} variant="outline">
                  {source}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Why Different from ERP */}
          <div>
            <h4 className="mb-2 text-muted-foreground">Why Different from ERP?</h4>
            <p className="leading-relaxed text-muted-foreground">
              This dashboard applies normalization rules, consolidation logic, and FX adjustments
              that may differ from raw ERP outputs. Data lineage includes ETL transformations
              applied on {new Date().toLocaleDateString()}.
            </p>
          </div>

          <Separator />

          {/* Share View */}
          <div>
            <Button variant="outline" className="w-full gap-2">
              <Share2 className="h-4 w-4" />
              Share This View
            </Button>
            <p className="mt-2 text-muted-foreground">
              Generate a deep link with current filters locked
            </p>
          </div>

          {/* Last Refresh */}
          <div className="rounded-lg bg-muted p-3">
            <p className="text-muted-foreground">
              Last refresh: <span className="text-foreground">2 minutes ago</span>
            </p>
            <p className="mt-1 text-muted-foreground">
              Next scheduled: <span className="text-foreground">in 28 minutes</span>
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
