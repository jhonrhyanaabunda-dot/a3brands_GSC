import Link from "next/link";
import { CalendarDays, ChevronDown, Menu, Search } from "lucide-react";

import { DealershipSwitcher } from "@/components/dashboard/dealership-switcher";
import { NotificationsPopover } from "@/components/dashboard/notifications-popover";
import { UserMenu } from "@/components/dashboard/user-menu";
import type { DealershipRecord, NotificationRecord } from "@/lib/data/types";

interface Props {
  dealerships: DealershipRecord[];
  active: DealershipRecord;
  notifications: NotificationRecord[];
  user: {
    name: string;
    email: string;
    role: string;
    title: string;
    initials: string;
  };
}

export function Topbar({ dealerships, active, notifications, user }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <Link
          href="/dashboard"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone hover:text-charcoal lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </Link>

        <DealershipSwitcher active={active} dealerships={dealerships} />

        <div className="ml-3 hidden flex-1 max-w-md md:flex">
          <label className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              placeholder="Search keywords, pages, dealerships…"
              className="h-9 w-full rounded-lg border border-stone-200 bg-white pl-9 pr-3 text-[14px] text-charcoal placeholder:text-stone-400 transition-colors focus:border-brand focus:outline-none focus:shadow-input-focus"
            />
          </label>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="hidden h-9 items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 font-display text-[12px] font-medium text-charcoal transition-colors hover:border-brand hover:bg-stone-50 md:inline-flex"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Last 30 days
            <ChevronDown className="h-3.5 w-3.5 text-stone" />
          </button>

          <NotificationsPopover notifications={notifications} />

          <UserMenu
            name={user.name}
            email={user.email}
            role={user.role}
            title={user.title}
            initials={user.initials}
          />
        </div>
      </div>
    </header>
  );
}
