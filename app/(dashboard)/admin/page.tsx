import type { Metadata } from "next";
import {
  Building2,
  CheckCircle2,
  Plus,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { DemoActionButton } from "@/components/demo/action-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listDealerships, listUsers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin",
};

function relTime(iso: string) {
  const t = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(t / (60 * 60 * 1000));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  DEALER_GROUP: "Dealer Group",
  MARKETING_DIRECTOR: "Marketing Director",
  GENERAL_MANAGER: "General Manager",
};

const ROLE_TONE: Record<string, "critical" | "warning" | "default" | "muted"> = {
  ADMIN: "critical",
  DEALER_GROUP: "warning",
  MARKETING_DIRECTOR: "default",
  GENERAL_MANAGER: "muted",
};

export default async function AdminPage() {
  const [users, dealerships] = await Promise.all([listUsers(), listDealerships()]);

  const activeUsers = users.filter((u) => u.active).length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administration"
        title="Platform settings"
        description={`${activeUsers} active users across ${dealerships.length} dealerships. Manage access, ownership, and group-level configuration.`}
        actions={
          <DemoActionButton
            variant="default"
            size="sm"
            toastMessage="Invitation sent."
            toastDescription="They'll get an email with a one-time signup link."
          >
            <UserPlus className="h-4 w-4" />
            Invite user
          </DemoActionButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={Users} label="Active users" value={activeUsers} helper={`${users.length - activeUsers} paused`} />
        <StatTile icon={Building2} label="Dealerships" value={dealerships.length} helper={`${dealerships.filter((d) => d.tier === "FLAGSHIP").length} flagship`} />
        <StatTile icon={Shield} label="Admins" value={adminCount} helper="Privileged access" />
        <StatTile icon={CheckCircle2} label="SSO" value="Ready" helper="SAML available" />
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
              Users
            </p>
            <h2 className="mt-1 font-display text-[16px] font-bold text-charcoal">
              {users.length} accounts · {adminCount} admin
            </h2>
          </div>
          <DemoActionButton
            variant="secondary"
            size="sm"
            toastMessage="Add a user."
            toastDescription="Opens the invite flow - same as the topbar button."
          >
            <Plus className="h-4 w-4" />
            Add user
          </DemoActionButton>
        </div>
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-[14px]">
              <thead className="bg-stone-50 font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-right">Dealerships</th>
                  <th className="px-4 py-3 text-right">Last login</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {users.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-stone-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand font-display text-[12px] font-bold text-charcoal">
                          {u.name
                            .split(" ")
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                        <div className="min-w-0">
                          <div className="truncate text-[14px] font-medium text-charcoal">
                            {u.name}
                          </div>
                          <div className="truncate text-[11px] text-stone">
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={ROLE_TONE[u.role]}>{ROLE_LABEL[u.role]}</Badge>
                      <div className="mt-1 text-[11px] text-stone">{u.title}</div>
                    </td>
                    <td className="px-4 py-3 text-right text-charcoal">
                      {u.dealerships.length}
                      <span className="ml-1 text-stone">/ {dealerships.length}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-[12px] text-stone">
                      {relTime(u.lastLogin)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {u.active ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="muted">Paused</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
              Dealerships
            </p>
            <h2 className="mt-1 font-display text-[16px] font-bold text-charcoal">
              {dealerships.length} rooftops connected
            </h2>
          </div>
          <DemoActionButton
            variant="secondary"
            size="sm"
            toastMessage="Connect a new rooftop."
            toastDescription="Add a GSC property + dealership profile to start ingestion."
          >
            <Plus className="h-4 w-4" />
            Add rooftop
          </DemoActionButton>
        </div>
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {dealerships.map((d) => (
            <li key={d.id}>
              <article className="rounded-2xl border border-stone-200 bg-white p-5 transition-all duration-200 hover:border-brand hover:shadow-card-hover">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand/15 text-brand">
                    <Building2 className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-display text-[14px] font-bold text-charcoal">
                        {d.name}
                      </h3>
                      <Badge variant={d.tier === "FLAGSHIP" ? "default" : "muted"}>
                        {d.tier}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-[11px] text-stone">
                      {d.brand} · {d.city}, {d.state}
                    </p>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-stone-200 pt-3 text-[12px]">
                  <div>
                    <dt className="text-stone">SEO</dt>
                    <dd className="mt-0.5 font-mono text-[14px] text-charcoal">
                      {d.seoHealthScore}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-stone">Lead</dt>
                    <dd className="mt-0.5 font-mono text-[14px] text-charcoal">
                      {d.leadOpportunityScore}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-stone">Local</dt>
                    <dd className="mt-0.5 font-mono text-[14px] text-charcoal">
                      {d.localVisibilityScore}
                    </dd>
                  </div>
                </dl>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
          {label}
        </span>
        <Icon className="h-3.5 w-3.5 text-stone" />
      </div>
      <div className="mt-2 font-display text-[24px] font-bold text-charcoal">{value}</div>
      <div className="mt-1 text-[11px] text-stone">{helper}</div>
    </div>
  );
}
