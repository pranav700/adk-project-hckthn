'use client';
import { useRouter } from 'next/navigation';
import { FileText, ArrowRightCircle } from 'lucide-react';

const statusColors: Record<RequestStatus, string> = {
  Accepted: 'text-green-600',
  Countered: 'text-yellow-600',
  Pending: 'text-blue-600',
};

export type RequestStatus = 'Accepted' | 'Countered' | 'Pending';

export default function RequestCard({ id, status }: { id: string; status: RequestStatus }) {
  const router = useRouter();

  return (
    <li
      onClick={() => router.push(`/request/${id}`)}
      className="flex items-center justify-between p-4 bg-white border rounded-lg shadow hover:shadow-md transition cursor-pointer"
    >
      <div className="flex items-center space-x-3">
        <FileText className="w-6 h-6 text-blue-500" />
        <div>
          <p className="text-lg font-medium text-blue-700 hover:underline">{id}</p>
          <p className={`text-sm ${statusColors[status]}`}>Status: {status}</p>
        </div>
      </div>
      <ArrowRightCircle className="text-gray-400 w-5 h-5" />
    </li>
  );
}
