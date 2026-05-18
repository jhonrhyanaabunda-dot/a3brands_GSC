import { DemoBanner } from "@/components/dashboard/demo-banner";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import {
  getNotifications,
  getSessionContext,
  listSwitchableDealerships,
} from "@/lib/data";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, dealerships, notifications] = await Promise.all([
    getSessionContext(),
    listSwitchableDealerships(),
    getNotifications(),
  ]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="min-w-0 flex-1">
        {session.isDemo ? <DemoBanner /> : null}
        <Topbar
          dealerships={dealerships}
          active={session.dealership}
          notifications={notifications}
          user={{
            name: session.user.name,
            email: session.user.email,
            role: session.user.role,
            title: session.user.title,
            initials: session.user.avatarInitials,
          }}
        />
        <main className="px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
