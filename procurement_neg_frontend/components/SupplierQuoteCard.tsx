"use client";

import React from "react";

interface SkuRow {
  item: string;
  sku: string | null;
  quote_price: number;
  last_price: number | null;
  market_price: number;
  target_price: number;
  analysis_note: string;
}

interface SupplierQuoteData {
  supplier_name: string;
  summary: string;
  sku_rows: SkuRow[];
}

interface SupplierQuoteProps {
  quote: SupplierQuoteData;
}

const formatPrice = (value: number | null): string =>
  value !== null ? `$${value.toFixed(2)}` : "—";

const SupplierQuoteCard = ({ quote }: SupplierQuoteProps) => {

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-2xl mt-10">
      <h2 className="text-2xl font-bold mb-1">{quote.supplier_name}</h2>
      <p className="text-gray-600 mb-6">{quote.summary}</p>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed border border-gray-300 text-sm">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="p-3 text-left">Item</th>
              <th className="p-3 text-left">Quote Price</th>
              <th className="p-3 text-left">Market Price</th>
              <th className="p-3 text-left">Target Price</th>
              <th className="p-3 text-left">Analysis Note</th>
            </tr>
          </thead>
          <tbody>
            {quote.sku_rows.map((row, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-200 text-sm hover:bg-gray-50"
              >
                <td className="p-3 font-medium">{row.item}</td>
                <td className="p-3">{formatPrice(row.quote_price)}</td>
                <td className="p-3">{formatPrice(row.market_price)}</td>
                <td className="p-3">{formatPrice(row.target_price)}</td>
                <td className="p-3 text-gray-600 italic">{row.analysis_note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierQuoteCard;
