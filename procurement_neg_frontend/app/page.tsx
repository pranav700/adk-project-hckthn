'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashboardEntry, fetchDashboardData } from '@/lib/api/rest/dashboard';

type RequestRecord = {
  request_id: string;
  quote_id: string;
  company_name: string;
  status: string;
  last_updated: string;
};



const statusMap: Record<string, { label: string; color: string }> = {
  Accepted: { label: "Accepted", color: "bg-green-100 text-green-800" },
  Countered: { label: "Countered", color: "bg-yellow-100 text-yellow-800" },
  Pending: { label: "Pending", color: "bg-blue-100 text-blue-800" },
  Rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
};

export default function Dashboard() {

  const [history, setHistory] = useState<DashboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDashboardData();
        setHistory(data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);




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
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : history.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              history.map((req) => (
                <tr key={req.request_id} className="border-t">
                  <td className="px-4 py-3 text-blue-600 font-medium hover:underline">
                    <Link href={`/request/${req.request_id}`}>{req.request_id}</Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">{req.quote_id}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{req.company_name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusMap[req.status].color}`}
                    >
                      {statusMap[req.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{req.last_updated}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/request/${req.request_id}`}>
                      <ArrowRight className="w-4 h-4 text-gray-500 hover:text-blue-600 transition" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>


      </div>
    </div>
  );
}
