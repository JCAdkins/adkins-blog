export default function SkeletonMessage() {
  return (
    <div className="border-muted animate-pulse space-y-3 rounded-lg border p-4">
      <div className="flex justify-between">
        <div className="h-5 w-1/3 rounded bg-gray-400" />
        <div className="h-5 w-1/5 rounded bg-gray-400" />
      </div>
      <div className="h-4 w-2/3 rounded bg-gray-400" />
    </div>
  );
}
