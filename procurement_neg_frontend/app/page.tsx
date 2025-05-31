'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

const history = [
  {
    id: 'REQ-1001',
    quote_id: 'Q-8723',
    company: 'Acme Supplies Ltd.',
    status: 'Accepted',
    updated: '2025-05-25',
  },
  {
    id: 'REQ-1002',
    quote_id: 'Q-8821',
    company: 'Global Trade Inc.',
    status: 'Countered',
    updated: '2025-05-24',
  },
  {
    id: 'REQ-1003',
    quote_id: 'Q-8899',
    company: 'SmartTech Partners',
    status: 'Pending',
    updated: '2025-05-23',
  },
  {
    id: 'REQ-1004',
    quote_id: 'Q-8934',
    company: 'Nova Procurement',
    status: 'Rejected',
    updated: '2025-05-22',
  },
];


const statusMap: Record<string, { label: string; color: string }> = {
  Accepted: { label: "Accepted", color: "bg-green-100 text-green-800" },
  Countered: { label: "Countered", color: "bg-yellow-100 text-yellow-800" },
  Pending: { label: "Pending", color: "bg-blue-100 text-blue-800" },
  Rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
};

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Procurement Dashboard</h1>
        <Button asChild>
          <Link href="/upload">New Request</Link>
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 text-left text-sm text-gray-700">
            <tr>
              <th className="px-4 py-3 font-medium">Request ID</th>
              <th className="px-4 py-3 font-medium">Quote ID</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last Updated</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((req) => (
              <tr key={req.id} className="border-t">
                <td className="px-4 py-3 text-blue-600 font-medium hover:underline">
                  <Link href={`/request/${req.id}`}>{req.id}</Link>
                </td>
                <td className="px-4 py-3 text-sm text-gray-800">{req.quote_id}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{req.company}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusMap[req.status].color}`}
                  >
                    {statusMap[req.status].label}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{req.updated}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/request/${req.id}`}>
                    <ArrowRight className="w-4 h-4 text-gray-500 hover:text-blue-600 transition" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>


      </div>
    </div>
  );
}
