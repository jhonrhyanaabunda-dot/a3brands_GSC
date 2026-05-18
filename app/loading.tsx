import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="relative min-h-screen bg-white">
      <div className="container pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <Skeleton className="mx-auto h-7 w-44" />
          <Skeleton className="mx-auto mt-6 h-16 w-full max-w-2xl" />
          <Skeleton className="mx-auto mt-3 h-5 w-3/4" />
          <div className="mt-8 flex justify-center gap-3">
            <Skeleton className="h-12 w-44 rounded-pill" />
            <Skeleton className="h-12 w-36 rounded-pill" />
          </div>
        </div>
        <div className="mx-auto mt-16 grid max-w-6xl gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="mx-auto mt-6 h-80 w-full max-w-6xl rounded-3xl" />
      </div>
    </div>
  );
}
