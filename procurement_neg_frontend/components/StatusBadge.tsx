import { statusMap } from "@/lib/constants";

interface StatusBadgeProps {
  status: keyof typeof statusMap;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const { label, color } = statusMap[status] || { label: status, color: "" };
  return (
    <span className={`inline-block px-2 py-1 rounded font-semibold ${color}`}>
      {label}
    </span>
  );
}
export default StatusBadge;