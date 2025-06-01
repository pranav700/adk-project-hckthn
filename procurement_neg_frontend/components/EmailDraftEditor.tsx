"use client";

import React, { useRef, useState } from "react";

interface EmailDraftData {
  action: string;
  to: string | null;
  subject: string;
  html_body: string;
}

interface EmailDraftEditorProps {
  quote: EmailDraftData;
}


const EmailDraftEditor = ({ quote }: EmailDraftEditorProps) => {
  const [toEmail, setToEmail] = useState(quote.to ?? "");
  const [subject, setSubject] = useState(quote.subject);
  const [notification, setNotification] = useState("");
  const emailRef = useRef<HTMLDivElement>(null);
  const canSend = toEmail.trim() !== "" &&
    subject.trim() !== "" &&
    emailRef.current?.innerText.trim() !== "";

  const styledHtmlBody = quote.html_body
    .replace(/<table/g, `<table style="border-collapse: collapse; width: 100%; border: 1px solid #ccc;"`)
    .replace(/<th/g, `<th style="border: 1px solid #ccc; padding: 8px; background-color: #f9f9f9;"`)
    .replace(/<td/g, `<td style="border: 1px solid #ccc; padding: 8px;"`);


  const handleCopy = async () => {
    const el = emailRef.current;
    if (el) {
      await navigator.clipboard.writeText(el.innerHTML);
      setNotification("Copied to clipboard!");
      setTimeout(() => setNotification(""), 2000);
    }
  };

  const handleSend = () => {
    // Simulated send action
    setNotification("Email sent successfully!");
    setTimeout(() => setNotification(""), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10 space-y-6">
      <h2 className="text-2xl font-bold">Email Draft Editor</h2>

      <div>
        <label className="block mb-1 font-medium text-gray-700">To</label>
        <input
          type="email"
          value={toEmail}
          onChange={(e) => setToEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="supplier@example.com"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">Subject</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">Email Body</label>
        <div
          ref={emailRef}
          contentEditable
          className="prose max-w-none min-h-[300px] border border-gray-300 bg-gray-50 p-4 rounded-md focus:outline-none"
          dangerouslySetInnerHTML={{ __html: styledHtmlBody }}
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`px-4 py-2 rounded-md transition ${canSend
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
        >
          Send Email
        </button>
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
        >
          Copy Text
        </button>
      </div>

      {notification && (
        <div className="mt-4 text-green-600 font-medium">{notification}</div>
      )}
    </div>
  );
};

export default EmailDraftEditor;
