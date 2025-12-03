import VerifiedBadge from "../passport/VerifiedBadge";

export default function VerifiedBadgeExample() {
  return (
    <div className="flex items-center gap-4 p-4">
      <VerifiedBadge size="sm" />
      <VerifiedBadge size="md" />
      <VerifiedBadge size="lg" />
    </div>
  );
}
