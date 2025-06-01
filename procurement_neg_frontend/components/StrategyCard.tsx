"use client";

import React from "react";

interface CounterOfferRow {
  sku: string | null;
  item: string;
  counter_price: number;
}

interface CounterOfferData {
  supplier_name: string;
  email_subject: string;
  counter_offer_rows: CounterOfferRow[];
  concession_plan: string[];
  recommended_email_body: string;
}

interface CounterOfferProps {
  quote: CounterOfferData;
}

const StrategyCard = ({ quote }: CounterOfferProps) => {

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-2xl mt-10 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Supplier: {quote.supplier_name}</h2>
        <p className="text-gray-700">Subject: {quote.email_subject}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Counter Offer</h3>
        <table className="w-full table-fixed border border-gray-300 text-sm">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="text-left p-3">Item</th>
              <th className="text-left p-3">Counter Price (USD)</th>
            </tr>
          </thead>
          <tbody>
            {quote.counter_offer_rows.map((row, i) => (
              <tr key={i} className="border-t border-gray-200">
                <td className="p-3">{row.item}</td>
                <td className="p-3">${row.counter_price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Concession Plan</h3>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          {quote.concession_plan
            .filter((line) => line.trim() !== "")
            .map((line, i) => (
              <li key={i}>{line}</li>
            ))}
        </ul>
      </div>

      <div>
        {/* <h3 className="text-lg font-semibold mb-2">Recommended Email</h3>
        <div
          className="email-html prose max-w-none border border-gray-200 p-4 rounded-md bg-gray-50"
          dangerouslySetInnerHTML={{ __html: quote.recommended_email_body }}
        /> */}
      </div>
    </div>
  );
};

export default StrategyCard;
