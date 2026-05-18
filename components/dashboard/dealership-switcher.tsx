"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Building2, Check, ChevronsUpDown, MapPin } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

import { switchDealership } from "@/actions/session";
import { cn } from "@/lib/utils";
import type { DealershipRecord } from "@/lib/data/types";

interface Props {
  active: DealershipRecord;
  dealerships: DealershipRecord[];
}

export function DealershipSwitcher({ active, dealerships }: Props) {
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const router = useRouter();

  const select = (d: DealershipRecord) => {
    if (d.id === active.id) {
      setOpen(false);
      return;
    }
    startTransition(async () => {
      await switchDealership(d.id);
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={pending}
          className={cn(
            "group inline-flex items-center gap-3 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-left transition-colors",
            "hover:border-brand hover:bg-stone-50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
          )}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand/15 text-brand">
            <Building2 className="h-3.5 w-3.5" />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
              Active dealership
            </span>
            <span className="block truncate font-display text-[14px] font-bold text-charcoal">
              {active.name}
            </span>
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-stone transition-transform group-data-[state=open]:rotate-180" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-50 w-80 rounded-xl border border-stone-200 bg-white p-1 shadow-raised"
        >
          <div className="px-3 py-2 font-display text-[10px] font-bold uppercase tracking-[0.15em] text-stone">
            Switch dealership
          </div>
          <ul className="max-h-[360px] overflow-y-auto">
            {dealerships.map((d) => {
              const isActive = d.id === active.id;
              return (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => select(d)}
                    disabled={pending}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] transition-colors",
                      isActive
                        ? "bg-brand/10 text-charcoal"
                        : "text-charcoal hover:bg-stone-50",
                    )}
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-stone-100 text-brand">
                      <Building2 className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-[14px] font-bold text-charcoal">
                        {d.name}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-stone">
                        <MapPin className="h-3 w-3" />
                        {d.city}, {d.state} · {d.tier}
                      </span>
                    </span>
                    {isActive ? (
                      <Check className="mt-1 h-4 w-4 shrink-0 text-brand" />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
