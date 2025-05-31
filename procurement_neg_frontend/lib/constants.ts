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
