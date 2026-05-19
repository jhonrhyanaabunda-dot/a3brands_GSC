import { CheckCircle2, MessageSquare, Plug, Sparkles } from "lucide-react";

import { DemoActionButton } from "@/components/demo/action-button";

export type IntegrationCategory =
  | "Data source"
  | "Notifications"
  | "CRM"
  | "Scheduling"
  | "Analytics";

export interface IntegrationDef {
  id: string;
  name: string;
  category: IntegrationCategory;
  description: string;
  connected: boolean;
  lastSync?: string;
  accountSummary?: string;
  logo: React.ReactNode;
}

export function IntegrationCard({ i }: { i: IntegrationDef }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-subtle">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-stone-100 bg-white">
            {i.logo}
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-display text-[14px] font-bold text-charcoal">
              {i.name}
            </h3>
            <p className="font-display text-[10px] font-semibold uppercase tracking-[0.08em] text-stone">
              {i.category}
            </p>
          </div>
        </div>

        {i.connected ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand/12 px-2 py-1 font-display text-[10px] font-bold uppercase tracking-[0.06em] text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Live
          </span>
        ) : (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-stone-100 px-2 py-1 font-display text-[10px] font-bold uppercase tracking-[0.06em] text-stone">
            Not connected
          </span>
        )}
      </div>

      <p className="mt-3 text-[12px] leading-[18px] text-stone">{i.description}</p>

      {i.connected ? (
        <div className="mt-4 rounded-lg bg-stone-50/70 px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-charcoal">
            <CheckCircle2 className="h-3 w-3 text-brand" />
            {i.accountSummary}
          </p>
          {i.lastSync ? (
            <p className="mt-0.5 text-[10px] text-stone">Last sync · {i.lastSync}</p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-auto pt-4">
        {i.connected ? (
          <DemoActionButton
            variant="ghost"
            size="sm"
            toastMessage={`${i.name} settings opened.`}
            toastDescription="Manage scopes, properties, and sync cadence here in production."
            className="w-full justify-center"
          >
            Manage
          </DemoActionButton>
        ) : (
          <DemoActionButton
            variant="secondary"
            size="sm"
            toastMessage={`${i.name} OAuth flow starts here.`}
            toastDescription="Configure provider credentials in your env to enable the live consent screen."
            className="w-full justify-center"
          >
            <Plug className="h-3.5 w-3.5" />
            Connect
          </DemoActionButton>
        )}
      </div>
    </article>
  );
}

export const SAMPLE_INTEGRATIONS: IntegrationDef[] = [
  {
    id: "ga4",
    name: "Google Analytics 4",
    category: "Analytics",
    description: "Pair GA4 with GSC to attribute organic clicks to conversions and leads.",
    connected: true,
    accountSummary: "5 properties connected",
    lastSync: "2 hours ago",
    logo: <Ga4Mark className="h-5 w-5" />,
  },
  {
    id: "gbp",
    name: "Google Business Profile",
    category: "Data source",
    description: "Pull map-pack rankings, review velocity, and NAP consistency across locations.",
    connected: true,
    accountSummary: "5 locations connected",
    lastSync: "this morning",
    logo: <GbpMark className="h-5 w-5" />,
  },
  {
    id: "slack",
    name: "Slack",
    category: "Notifications",
    description: "Post ranking changes, weekly digests, and AI insights to a channel.",
    connected: false,
    logo: <SlackMark className="h-5 w-5" />,
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "CRM",
    description: "Sync inbound /scan leads with HubSpot contacts and deal pipelines.",
    connected: false,
    logo: <HubspotMark className="h-5 w-5" />,
  },
  {
    id: "calendly",
    name: "Calendly",
    category: "Scheduling",
    description: "Auto-schedule dealer principal meetings from scan-tool conversions.",
    connected: false,
    logo: <CalendlyMark className="h-5 w-5" />,
  },
  {
    id: "looker",
    name: "Looker Studio",
    category: "Analytics",
    description: "Push aggregated KPIs into Looker Studio for executive dashboards.",
    connected: false,
    logo: <Sparkles className="h-5 w-5 text-violet-500" />,
  },
];

// Brand marks (simplified SVG, no external assets needed)

function Ga4Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="3" y="11" width="3.6" height="10" rx="1.8" fill="#F9AB00" />
      <rect x="10.2" y="6" width="3.6" height="15" rx="1.8" fill="#E37400" />
      <rect x="17.4" y="3" width="3.6" height="18" rx="1.8" fill="#FBBC04" />
    </svg>
  );
}

function GbpMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 2C7.6 2 4 5.6 4 10c0 5.8 8 12 8 12s8-6.2 8-12c0-4.4-3.6-8-8-8z"
        fill="#4285F4"
      />
      <circle cx="12" cy="10" r="3" fill="#fff" />
    </svg>
  );
}

function SlackMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="3" y="10" width="6" height="4" rx="2" fill="#36C5F0" />
      <rect x="10" y="3" width="4" height="6" rx="2" fill="#2EB67D" />
      <rect x="15" y="10" width="6" height="4" rx="2" fill="#ECB22E" />
      <rect x="10" y="15" width="4" height="6" rx="2" fill="#E01E5A" />
    </svg>
  );
}

function HubspotMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="16" cy="10" r="4" fill="none" stroke="#FF7A59" strokeWidth="2.2" />
      <path d="M6 6v14M6 13h6" stroke="#FF7A59" strokeWidth="2.2" fill="none" />
    </svg>
  );
}

function CalendlyMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2.5" fill="none" stroke="#006BFF" strokeWidth="2" />
      <path d="M3 9h18" stroke="#006BFF" strokeWidth="2" />
      <circle cx="8" cy="14" r="1.4" fill="#006BFF" />
      <circle cx="12" cy="14" r="1.4" fill="#006BFF" />
      <circle cx="16" cy="14" r="1.4" fill="#006BFF" />
    </svg>
  );
}
