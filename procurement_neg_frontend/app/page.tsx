'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashboardEntry, fetchDashboardData } from '@/lib/api/rest/dashboard';
import { Icons } from '@/components/Icons';
import { statusMap } from '@/lib/constants';


console.log("API from ENV:", process.env.NEXT_PUBLIC_BACKEND_API);


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
        <h3 className="text-2xl font-semibold text-gray-800">Dashboard</h3>
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
                  <Icons.spinner className="h-10 w-10 animate-spin" />

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
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusMap[req.quote_status].color}`}
                    >
                      {statusMap[req.quote_status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{new Date(req.last_updated).toLocaleString("en-GB", {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}</td>
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
