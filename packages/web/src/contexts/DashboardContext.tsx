import { createContext, useState, useEffect, ReactNode } from 'react';

interface DashboardData {
  totalValidations: number;
  matchValidations: number;
  notMatchValidations: number;
  matchRate: number;
  averageSimilarity: number;
  dailyStats: {
    _id: string;
    count: number;
    matches: number;
    notMatches: number;
    avgSimilarity: number;
  }[];
}

interface ValidationHistoryItem {
  _id: string;
  isMatch: boolean;
  similarity: number;
  userName?: string;
  documentType?: string;
  createdAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface DashboardContextType {
  dashboardData: DashboardData | null;
  validationHistory: ValidationHistoryItem[];
  pagination: PaginationData | null;
  loading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
  fetchValidationHistory: (page: number, limit: number) => Promise<void>;
}

export const DashboardContext = createContext<DashboardContextType>({
  dashboardData: null,
  validationHistory: [],
  pagination: null,
  loading: false,
  error: null,
  fetchDashboardData: async () => {},
  fetchValidationHistory: async () => {},
});

interface DashboardProviderProps {
  children: ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [validationHistory, setValidationHistory] = useState<ValidationHistoryItem[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/dashboard/stats`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados do dashboard: ${response.status}`);
      }

      const responseData = await response.json();
      if (responseData.success && responseData.data) {
        setDashboardData(responseData.data);
      } else {
        throw new Error('Dados do dashboard não disponíveis');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar dados do dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchValidationHistory = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/dashboard/history?page=${page}&limit=${limit}`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar histórico de validações: ${response.status}`);
      }

      const responseData = await response.json();
      if (responseData.success && responseData.data) {
        setValidationHistory(responseData.data.validations);
        setPagination(responseData.data.pagination);
      } else {
        throw new Error('Histórico de validações não disponível');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar histórico de validações:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        dashboardData,
        validationHistory,
        pagination,
        loading,
        error,
        fetchDashboardData,
        fetchValidationHistory,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export default DashboardProvider;
