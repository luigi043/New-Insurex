/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import apiClient from '../api.service';
import {
  DEMO_AUTH_RESPONSE,
  DEMO_AUTH_EMPLOYEE,
  DEMO_AUTH_CLIENT,
  DEMO_USER,
  MOCK_POLICIES,
  MOCK_CLAIMS,
  MOCK_ASSETS,
  MOCK_PARTNERS,
  MOCK_INVOICES,
  MOCK_POLICY_STATS,
  MOCK_CLAIM_STATS,
  MOCK_ASSET_STATS,
  MOCK_EXPIRING_POLICIES,
} from './mockData';

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

function paginate<T>(items: T[], page = 1, limit = 10) {
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);
  return { data, total: items.length, page, limit, totalPages: Math.ceil(items.length / limit) };
}

function makeResponse(data: unknown, config: InternalAxiosRequestConfig): AxiosResponse {
  return { data, status: 200, statusText: 'OK', headers: {}, config };
}

function resolveUrl(url: string): string {
  // Strip query string for matching
  return url.split('?')[0];
}

function getParams(url: string): URLSearchParams {
  return new URLSearchParams(url.includes('?') ? url.split('?')[1] : '');
}

export function setupMockInterceptor() {
  const mockAdapter = async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
    await delay();

    const rawUrl = config.url || '';
    const method = (config.method || 'get').toLowerCase();
    const path = resolveUrl(rawUrl);
    const params = getParams(rawUrl);
    const page = parseInt(params.get('page') || '1');
    const limit = parseInt(params.get('limit') || '10');

    // ── Auth ────────────────────────────────────────────────────────────────
    if (path.includes('/auth/login') || path.includes('/auth/register')) {
      // Route to correct user based on email in request body
      let authResponse = DEMO_AUTH_RESPONSE;
      try {
        const body = config.data ? JSON.parse(config.data) : {};
        if (body.email === 'employee@insurex.co.za') authResponse = DEMO_AUTH_EMPLOYEE;
        else if (body.email === 'client@insurex.co.za') authResponse = DEMO_AUTH_CLIENT;
      } catch { /* use default */ }
      return makeResponse(authResponse, config);
    }
    if (path.includes('/auth/logout') || path.includes('/auth/forgot-password') ||
        path.includes('/auth/reset-password') || path.includes('/auth/change-password') ||
        path.includes('/auth/verify-email') || path.includes('/auth/resend-verification') ||
        path.includes('/auth/verify-2fa')) {
      return makeResponse({ success: true, message: 'Demo mode - operation simulated' }, config);
    }
    if (path.includes('/auth/refresh')) {
      return makeResponse({ accessToken: 'demo-access-token-refreshed', refreshToken: 'demo-refresh-token-refreshed' }, config);
    }
    if (path.includes('/auth/me') || path.includes('/auth/profile')) {
      // Return user based on token
      const token = (config.headers?.Authorization as string | undefined) || '';
      if (token.includes('employee')) return makeResponse(DEMO_AUTH_EMPLOYEE.user, config);
      if (token.includes('client')) return makeResponse(DEMO_AUTH_CLIENT.user, config);
      return makeResponse(DEMO_USER, config);
    }

    // ── Policies ─────────────────────────────────────────────────────────────
    if (path.includes('/policies/stats')) {
      return makeResponse(MOCK_POLICY_STATS, config);
    }
    if (path.includes('/policies/expiring')) {
      return makeResponse(MOCK_EXPIRING_POLICIES, config);
    }
    if (/\/policies\/[^/]+$/.test(path) && method === 'get') {
      const id = path.split('/').pop();
      return makeResponse(MOCK_POLICIES.find((p) => p.id === id) ?? MOCK_POLICIES[0], config);
    }
    if (path.includes('/policies') && method === 'get') {
      return makeResponse(paginate(MOCK_POLICIES, page, limit), config);
    }
    if (path.includes('/policies') && ['post', 'patch', 'put'].includes(method)) {
      const body = config.data ? JSON.parse(config.data) : {};
      return makeResponse({ ...MOCK_POLICIES[0], ...body, id: `pol-new-${Date.now()}` }, config);
    }
    if (path.includes('/policies') && method === 'delete') {
      return makeResponse({ success: true }, config);
    }

    // ── Claims ───────────────────────────────────────────────────────────────
    if (path.includes('/claims/summary') || path.includes('/claims/stats')) {
      return makeResponse(MOCK_CLAIM_STATS, config);
    }
    // Sub-resources: /claims/:id/notes, /claims/:id/documents, etc.
    if (/\/claims\/[^/]+\/notes\/[^/]+/.test(path) && method === 'delete') {
      return makeResponse({ success: true }, config);
    }
    if (/\/claims\/[^/]+\/notes/.test(path) && method === 'post') {
      const body = config.data ? JSON.parse(config.data) : {};
      return makeResponse({
        id: `note-${Date.now()}`,
        content: body.content || '',
        category: body.category || 'investigation',
        isInternal: body.isInternal ?? true,
        author: { id: 'demo-user-001', name: 'Alex Johnson' },
        createdAt: new Date().toISOString(),
      }, config);
    }
    if (/\/claims\/[^/]+\/notes/.test(path) && method === 'get') {
      return makeResponse([], config);
    }
    if (/\/claims\/[^/]+\/documents/.test(path)) {
      return makeResponse([], config);
    }
    if (/\/claims\/[^/]+\/[^/]+/.test(path) && method === 'get') {
      return makeResponse([], config);
    }
    if (/\/claims\/[^/]+$/.test(path) && method === 'get') {
      const id = path.split('/').pop();
      return makeResponse(MOCK_CLAIMS.find((c) => c.id === id) ?? MOCK_CLAIMS[0], config);
    }
    if (path.includes('/claims') && method === 'get') {
      return makeResponse(paginate(MOCK_CLAIMS, page, limit), config);
    }
    if (path.includes('/claims') && ['post', 'patch', 'put'].includes(method)) {
      const body = config.data ? JSON.parse(config.data) : {};
      return makeResponse({ ...MOCK_CLAIMS[0], ...body, id: `clm-new-${Date.now()}` }, config);
    }
    if (path.includes('/claims') && method === 'delete') {
      return makeResponse({ success: true }, config);
    }

    // ── Assets ───────────────────────────────────────────────────────────────
    if (path.includes('/assets/summary') || path.includes('/assets/stats') || path.includes('/assets/total-value')) {
      return makeResponse(MOCK_ASSET_STATS, config);
    }
    if (/\/assets\/[^/]+$/.test(path) && method === 'get') {
      const id = path.split('/').pop();
      return makeResponse(MOCK_ASSETS.find((a) => a.id === id) ?? MOCK_ASSETS[0], config);
    }
    if (path.includes('/assets') && method === 'get') {
      return makeResponse(paginate(MOCK_ASSETS, page, limit), config);
    }
    if (path.includes('/assets') && ['post', 'patch', 'put'].includes(method)) {
      const body = config.data ? JSON.parse(config.data) : {};
      return makeResponse({ ...MOCK_ASSETS[0], ...body, id: `ast-new-${Date.now()}` }, config);
    }
    if (path.includes('/assets') && method === 'delete') {
      return makeResponse({ success: true }, config);
    }

    // ── Partners ─────────────────────────────────────────────────────────────
    if (path.includes('/partners/stats')) {
      return makeResponse({ total: 4, active: 4, byType: { AGENCY: 1, BROKER: 2, SERVICE_PROVIDER: 1 } }, config);
    }
    if (/\/partners\/[^/]+$/.test(path) && method === 'get') {
      const id = path.split('/').pop();
      return makeResponse(MOCK_PARTNERS.find((p) => p.id === id) ?? MOCK_PARTNERS[0], config);
    }
    if (path.includes('/partners') && method === 'get') {
      return makeResponse(paginate(MOCK_PARTNERS, page, limit), config);
    }
    if (path.includes('/partners') && ['post', 'patch', 'put'].includes(method)) {
      const body = config.data ? JSON.parse(config.data) : {};
      return makeResponse({ ...MOCK_PARTNERS[0], ...body, id: `partner-new-${Date.now()}` }, config);
    }
    if (path.includes('/partners') && method === 'delete') {
      return makeResponse({ success: true }, config);
    }

    // ── Billing / Invoices ────────────────────────────────────────────────────
    if (path.includes('/invoices/summary') || path.includes('/invoices/totals') || path.includes('/billing/summary')) {
      return makeResponse({ totalInvoices: 5, totalAmount: 13284, totalPaid: 9072, totalPending: 972, totalOverdue: 3240 }, config);
    }
    if (/\/(invoices|billing)\/[^/]+$/.test(path) && method === 'get') {
      const id = path.split('/').pop();
      return makeResponse(MOCK_INVOICES.find((i) => i.id === id) ?? MOCK_INVOICES[0], config);
    }
    if ((path.includes('/invoices') || path.includes('/billing')) && method === 'get') {
      return makeResponse(paginate(MOCK_INVOICES, page, limit), config);
    }
    if ((path.includes('/invoices') || path.includes('/billing')) && ['post', 'patch', 'put'].includes(method)) {
      const body = config.data ? JSON.parse(config.data) : {};
      return makeResponse({ ...MOCK_INVOICES[0], ...body, id: `inv-new-${Date.now()}` }, config);
    }

    // ── Dashboard ─────────────────────────────────────────────────────────────
    if (path.includes('/dashboard/summary') || path.includes('/dashboard/kpi')) {
      return makeResponse({
        totalPolicies: 8, activePolicies: 6, totalClaims: 6, pendingClaims: 3,
        totalAssets: 5, totalAssetValue: 872500, totalInvoices: 5, overdueInvoices: 1,
        monthlyPremium: 2661, recentActivity: [],
      }, config);
    }
    if (path.includes('/dashboard/charts') || path.includes('/dashboard/claims-trend')) {
      return makeResponse({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{ label: 'Claims', data: [2, 1, 3, 1, 2, 2] }],
      }, config);
    }
    if (path.includes('/dashboard/activity') || path.includes('/dashboard/recent-activities')) {
      return makeResponse([
        { id: '1', type: 'claim', action: 'submitted', description: 'New claim CLM-2025-0003 submitted', timestamp: new Date().toISOString(), user: 'Robert Davis' },
        { id: '2', type: 'policy', action: 'created', description: 'Policy POL-2025-0007 created', timestamp: new Date(Date.now() - 3600000).toISOString(), user: 'Alex Johnson' },
        { id: '3', type: 'invoice', action: 'overdue', description: 'Invoice INV-2025-0004 is overdue', timestamp: new Date(Date.now() - 7200000).toISOString(), user: 'System' },
      ], config);
    }
    if (path.includes('/dashboard/revenue')) {
      return makeResponse({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{ label: 'Revenue', data: [12000, 15000, 18000, 14000, 22000, 19000] }],
      }, config);
    }

    // ── Reports / Fallback ────────────────────────────────────────────────────
    return makeResponse({ data: [], total: 0, message: 'Demo mode' }, config);
  };

  // Patch both the default axios instance AND the apiClient instance
  // (axios.create() copies the adapter by value, so we must patch both)
  axios.defaults.adapter = mockAdapter;
  apiClient.defaults.adapter = mockAdapter;
}
