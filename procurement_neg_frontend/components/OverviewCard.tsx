// components/OverviewCard.tsx
import React from 'react';

interface SkuRow {
  item: string;
  sku: string | null;
  description: string;
  quantity: number;
  unit_of_measure: string;
  unit_price: number;
  incoterms?: string | null;
}

interface Quote {
  supplier_name: string;
  supplier_email: string | null;
  quote_date: string;
  currency: string;
  sku_rows: SkuRow[];
}

interface OverviewCardProps {
  quote: Quote;
}

export default function OverviewCard({ quote }: OverviewCardProps) {
  return (
    <div className="border rounded p-4 bg-white shadow-sm">
      <h3 className="font-semibold text-lg mb-2">{quote.supplier_name}</h3>
      <p className="mb-1">Quote Date: {quote.quote_date}</p>
      <p className="mb-4">Currency: {quote.currency}</p>

      <table className="w-full  text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b py-1">Item</th>
            <th className="border-b py-1">Description</th>
            <th className="border-b py-1">Quantity</th>
            <th className="border-b py-1">Unit</th>
            <th className="border-b py-1">Price</th>
          </tr>
        </thead>
        <tbody>
          {quote?.sku_rows?.map((row, idx) => (
            <tr key={idx} className="odd:bg-gray-50">
              <td className="py-1">{row.item}</td>
              <td className="py-1">{row.description}</td>
              <td className="py-1">{row.quantity}</td>
              <td className="py-1">{row.unit_of_measure}</td>
              <td className="py-1">{row.unit_price?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
