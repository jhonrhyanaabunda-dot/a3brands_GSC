import type { Metadata } from "next";
import { Bell, KeyRound, Link2, Settings2, Shield, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { DemoActionButton } from "@/components/demo/action-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getSessionContext } from "@/lib/data";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const session = await getSessionContext();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Manage your profile, notifications, integrations, and dealership preferences."
      />

      <SectionCard icon={Settings2} title="Profile" description="How you appear inside A3 Brands.">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" defaultValue={session.user.name} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" defaultValue={session.user.title} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={session.user.email} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <div className="mt-1.5">
              <Badge variant="default">
                <Shield className="h-3 w-3" />
                {session.user.role.replaceAll("_", " ")}
              </Badge>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <DemoActionButton
            variant="default"
            size="sm"
            toastMessage="Profile saved."
            toastDescription="Your profile updates are live across the workspace."
          >
            Save profile
          </DemoActionButton>
          <Button variant="secondary" size="sm">
            Cancel
          </Button>
        </div>
      </SectionCard>

      <SectionCard icon={Bell} title="Notifications" description="Choose what you want to hear about.">
        <ul className="space-y-3">
          {[
            { label: "Ranking gains & drops", on: true },
            { label: "Weekly executive summaries", on: true },
            { label: "AI insight updates", on: true },
            { label: "Competitor moves", on: false },
            { label: "Review velocity changes", on: false },
          ].map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between rounded-lg border border-stone-200 bg-stone-50 px-4 py-3"
            >
              <div className="text-[14px] text-charcoal">{row.label}</div>
              <Toggle on={row.on} />
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard icon={Link2} title="Integrations" description="Connect data sources and downstream systems.">
        <ul className="grid gap-3 md:grid-cols-2">
          {[
            { name: "Google Search Console", connected: true, helper: "5 properties · synced 2h ago" },
            { name: "Google Analytics 4", connected: true, helper: "5 properties · synced 2h ago" },
            { name: "Google Business Profile", connected: true, helper: "5 locations" },
            { name: "Slack", connected: false, helper: "Send weekly summaries to a channel" },
            { name: "HubSpot", connected: false, helper: "Sync leads from /scan" },
            { name: "Calendly", connected: false, helper: "Inbound demo scheduling" },
          ].map((i) => (
            <li
              key={i.name}
              className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-4"
            >
              <div className="min-w-0">
                <div className="truncate font-display text-[14px] font-bold text-charcoal">{i.name}</div>
                <div className="mt-0.5 truncate text-[12px] text-stone">{i.helper}</div>
              </div>
              {i.connected ? (
                <Badge variant="success">Connected</Badge>
              ) : (
                <DemoActionButton
                  variant="secondary"
                  size="sm"
                  toastMessage={`${i.name} connection started.`}
                  toastDescription="OAuth flow will open in a new tab once production credentials are configured."
                >
                  Connect
                </DemoActionButton>
              )}
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard icon={KeyRound} title="API & SSO" description="Long-lived credentials and identity provider.">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
            <div>
              <div className="text-[14px] font-medium text-charcoal">API key</div>
              <div className="mt-0.5 font-mono text-[11px] text-stone">
                a3b_••••••••••••••••••••••••a93f
              </div>
            </div>
            <div className="flex gap-2">
              <DemoActionButton
                variant="secondary"
                size="sm"
                toastMessage="API key rotated."
                toastDescription="The previous key is invalidated. Update integrations."
              >
                Rotate
              </DemoActionButton>
              <DemoActionButton
                variant="ghost"
                size="sm"
                toastMessage="Hold to reveal."
                toastDescription="Long-press for 2s in production to reveal the full key."
              >
                Reveal
              </DemoActionButton>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
            <div>
              <div className="text-[14px] font-medium text-charcoal">SAML SSO</div>
              <div className="mt-0.5 text-[12px] text-stone">
                Connect Okta, Azure AD, or Google Workspace
              </div>
            </div>
            <DemoActionButton
              variant="secondary"
              size="sm"
              toastMessage="SAML SSO setup opened."
              toastDescription="The IdP metadata exchange flow runs in production."
            >
              Configure
            </DemoActionButton>
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={Trash2} title="Danger zone" description="Irreversible actions. Proceed with care." tone="danger">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-[14px] text-charcoal">
            Delete this workspace and all associated data.
          </div>
          <Button variant="destructive" size="sm" disabled>
            Delete workspace
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
  tone?: "danger";
}) {
  return (
    <section
      className={
        "rounded-2xl border bg-white p-6 sm:p-7 " +
        (tone === "danger" ? "border-red-300" : "border-stone-200")
      }
    >
      <div className="mb-5 flex items-start gap-3">
        <span
          className={
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-md " +
            (tone === "danger" ? "bg-red-500/15 text-red-600" : "bg-brand/15 text-brand")
          }
        >
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h2 className="font-display text-[16px] font-bold text-charcoal">{title}</h2>
          <p className="mt-0.5 text-[14px] text-stone">{description}</p>
        </div>
      </div>
      <Separator className="mb-5" />
      {children}
    </section>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className={
        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors " +
        (on ? "bg-brand" : "bg-stone-200")
      }
    >
      <span
        className={
          "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform " +
          (on ? "translate-x-5" : "translate-x-1")
        }
      />
    </span>
  );
}
