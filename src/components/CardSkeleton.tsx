import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <div className=" flex-col space-y-3 w-full flex items-center justify-center mt-14">
      <Skeleton className="h-[125px] w-[250px] rounded-xl bg-slate-400" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}
