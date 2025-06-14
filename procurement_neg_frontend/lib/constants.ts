import EmailDraftEditor from '@/components/EmailDraftEditor';
import OverviewCard from '@/components/OverviewCard';
import StrategyCard from '@/components/StrategyCard';
import SupplierQuoteCard from '@/components/SupplierQuoteCard';
import { v4 as uuidv4 } from 'uuid';


export const PROCUREMENT_STEPS = ['Overview', 'Quote Analysis', 'Strategy', 'Draft'];

export const PROCUREMENT_AGENTS = ['doc_agent', 'analysis_agent', 'strategy_agent', 'comms_agent'];

export function getNextRequestId(): string {
  const lastId = localStorage.getItem('procurement-req-counter');
  const nextId = lastId ? parseInt(lastId) + 1 : 1001;
  localStorage.setItem('procurement-req-counter', nextId.toString());
  return `REQ-${nextId}`;
}

export const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

export const APP_NAME = 'procurement_agent';
export const USER_ID = 'u_123';
export const SESSION_ID = uuidv4();

export const agentToComponent = {
  doc_agent: OverviewCard,
  analysis_agent: SupplierQuoteCard,
  strategy_agent: StrategyCard,
  comms_agent: EmailDraftEditor,
};

export const statusMap: Record<string, { label: string; color: string }> = {
  accepted: { label: "Accepted", color: "bg-green-100 text-green-800" },
  countered: { label: "Countered", color: "bg-yellow-100 text-yellow-800" },
  pending: { label: "Pending", color: "bg-blue-100 text-blue-800" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
};
