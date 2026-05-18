"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, LogOut, Settings, Shield, UserCircle } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

interface Props {
  name: string;
  email: string;
  role: string;
  title: string;
  initials: string;
}

export function UserMenu({ name, email, role, title, initials }: Props) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "group inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white py-1 pr-3 pl-1 transition-colors",
            "hover:border-brand hover:bg-stone-50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
          )}
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-md bg-brand font-display text-[12px] font-bold text-charcoal"
            aria-hidden
          >
            {initials}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block truncate font-display text-[12px] font-bold text-charcoal">
              {name}
            </span>
            <span className="block truncate font-display text-[10px] font-bold uppercase tracking-wider text-stone">
              {title}
            </span>
          </span>
          <ChevronDown className="hidden h-3.5 w-3.5 text-stone sm:inline" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-50 w-64 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-raised"
        >
          <div className="border-b border-stone-200 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand font-display text-[13px] font-bold text-charcoal">
                {initials}
              </span>
              <div className="min-w-0">
                <div className="truncate font-display text-[14px] font-bold text-charcoal">
                  {name}
                </div>
                <div className="truncate text-[12px] text-stone">
                  {email}
                </div>
              </div>
            </div>
            <div className="mt-3 inline-flex items-center gap-1 rounded-[4px] border border-brand bg-brand/10 px-2 py-0.5 font-display text-[10px] font-semibold text-brand">
              <Shield className="h-3 w-3" />
              {role}
            </div>
          </div>
          <ul className="p-1">
            <UserMenuItem href="/settings" icon={UserCircle} label="Profile" />
            <UserMenuItem href="/settings" icon={Settings} label="Settings" />
            <UserMenuItem href="/admin" icon={Shield} label="Admin panel" />
            <li className="my-1 h-px bg-stone-200" />
            <UserMenuItem href="/login" icon={LogOut} label="Sign out" />
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function UserMenuItem({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[14px] text-charcoal transition-colors hover:bg-stone-50 hover:text-brand"
      >
        <Icon className="h-4 w-4 text-stone" />
        {label}
      </Link>
    </li>
  );
}
