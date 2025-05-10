import React, { useContext, useEffect, useState } from 'react';
import { DashboardContext } from '@/contexts/DashboardContext';
import DashboardStats from './DashboardStats';
import DashboardCharts from './DashboardCharts';
import ValidationHistory from './ValidationHistory';
import { Card, Text, Title, Button } from '@tremor/react';

export default function Dashboard() {
  const {
    dashboardData,
    validationHistory,
    pagination,
    loading,
    error,
    fetchDashboardData,
    fetchValidationHistory,
  } = useContext(DashboardContext);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchDashboardData();
    fetchValidationHistory(currentPage, 10);
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
    fetchValidationHistory(currentPage, 10);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchValidationHistory(page, 10);
  };

  if (error) {
    return (
      <Card className="mx-auto text-center py-4">
        <Title className="text-red-500">Erro</Title>
        <Text className="mt-2">{error}</Text>
        <Button onClick={handleRefresh} className="mt-4">
          Tentar novamente
        </Button>
      </Card>
    );
  }

  if (loading && !dashboardData) {
    return (
      <Card className="mx-auto text-center py-10">
        <Text>Carregando dados do dashboard...</Text>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title>Dashboard KYC</Title>
        <Button onClick={handleRefresh} loading={loading}>
          {loading ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>

      {dashboardData ? (
        <>
          <DashboardStats
            totalValidations={dashboardData.totalValidations}
            matchValidations={dashboardData.matchValidations}
            notMatchValidations={dashboardData.notMatchValidations}
            matchRate={dashboardData.matchRate}
            averageSimilarity={dashboardData.averageSimilarity}
          />

          {dashboardData.dailyStats && dashboardData.dailyStats.length > 0 ? (
            <DashboardCharts dailyStats={dashboardData.dailyStats} />
          ) : (
            <Card className="mx-auto text-center py-4 mt-6">
              <Text>Dados históricos insuficientes para exibir gráficos</Text>
            </Card>
          )}

          <ValidationHistory
            validations={validationHistory}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <Card className="mx-auto text-center py-4">
          <Text>Nenhum dado disponível</Text>
        </Card>
      )}
    </div>
  );
}
