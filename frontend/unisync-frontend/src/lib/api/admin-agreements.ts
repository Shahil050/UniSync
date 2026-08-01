import { api } from "../api-client";

export type ContractStatus = "DRAFT" | "ACTIVE" | "COMPLETED" | "BREACHED";

export type AdminAgreement = {
  id: string;
  projectId: string;
  project: string;
  status: ContractStatus;
  totalMembers: number;
  signed: number;
  dueDate: string | null;
  createdAt: string;
};

export type AdminAgreementMember = {
  userId: string;
  name: string;
  roleTitle: string;
  responsibilities: string | null;
  signedAt: string | null;
};

export type AdminAgreementDetail = {
  id: string;
  project: string;
  projectId: string;
  status: ContractStatus;
  content: any;
  dueDate: string | null;
  createdAt: string;
  finalizedAt: string | null;
  members: AdminAgreementMember[];
};

export type AdminAgreementsFilters = {
  search?: string;
  status?: ContractStatus;
  cursor?: string;
};

function buildQuery(filters: AdminAgreementsFilters) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.cursor) params.set("cursor", filters.cursor);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const adminAgreementsApi = {
  list: (filters: AdminAgreementsFilters = {}) =>
    api.get<{ success: boolean; agreements: AdminAgreement[] }>(`/api/admin/agreements${buildQuery(filters)}`),

  detail: (id: string) =>
    api.get<{ success: boolean; agreement: AdminAgreementDetail }>(`/api/admin/agreements/${id}`),

  void: (id: string) =>
    api.post<{ success: boolean; message: string }>(`/api/admin/agreements/${id}/void`),
};