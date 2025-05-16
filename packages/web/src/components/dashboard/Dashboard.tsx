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
      <div className="p-6">
        <Card className="mx-auto text-center py-6 border-t-4 border-red-500 shadow-md">
          <Title className="text-red-500 text-xl">Erro</Title>
          <Text className="mt-3">{error}</Text>
          <Button onClick={handleRefresh} className="mt-4" size="sm">
            Tentar novamente
          </Button>
        </Card>
      </div>
    );
  }

  if (loading && !dashboardData) {
    return (
      <div className="p-6">
        <Card className="mx-auto text-center py-12 shadow-md">
          <div className="flex items-center justify-center flex-col">
            <div className="spinner mb-4"></div>
            <Text>Carregando dados do dashboard...</Text>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Header com título e botões de ação */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <div className="flex justify-between items-center">
          <div>
            <Title className="text-2xl font-bold">Dashboard KYC</Title>
            <Text className="text-gray-500 dark:text-gray-400 mt-1">
              Visão geral de validações e estatísticas
            </Text>
          </div>
          <Button onClick={handleRefresh} loading={loading} size="sm" color="blue" variant="secondary">
            {loading ? 'Atualizando...' : 'Atualizar dados'}
          </Button>
        </div>
      </div>

      {dashboardData ? (
        <div className="p-6">
          <div className="mb-8">
            <DashboardStats
              totalValidations={dashboardData.totalValidations}
              matchValidations={dashboardData.matchValidations}
              notMatchValidations={dashboardData.notMatchValidations}
              matchRate={dashboardData.matchRate}
              averageSimilarity={dashboardData.averageSimilarity}
            />
          </div>

          <div className="mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">
              <Title className="text-xl">Gráficos e Tendências</Title>
            </div>
            {dashboardData.dailyStats && dashboardData.dailyStats.length > 0 ? (
              <DashboardCharts dailyStats={dashboardData.dailyStats} />
            ) : (
              <Card className="text-center py-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <Text>Dados históricos insuficientes para exibir gráficos</Text>
              </Card>
            )}
          </div>

          <div>
            <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">
              <Title className="text-xl">Histórico de Validações</Title>
            </div>
            <ValidationHistory
              validations={validationHistory}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      ) : (
        <div className="p-6">
          <Card className="mx-auto text-center py-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <Text>Nenhum dado disponível</Text>
          </Card>
        </div>
      )}
    </div>
  );
}
