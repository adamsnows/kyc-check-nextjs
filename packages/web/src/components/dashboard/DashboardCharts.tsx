import React from 'react';
import { Card, Title, LineChart } from '@tremor/react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface DailyStats {
  _id: string;
  count: number;
  matches: number;
  notMatches: number;
  avgSimilarity: number;
}

interface DashboardChartsProps {
  dailyStats: DailyStats[];
}

export default function DashboardCharts({ dailyStats }: DashboardChartsProps) {
  // Formatar dados para o gráfico de linha
  const lineChartData = dailyStats.map((day) => ({
    date: day._id,
    'Total': day.count,
    'Match': day.matches,
    'Sem Match': day.notMatches,
  }));

  // Formatar dados para o gráfico de barras
  const barChartData = dailyStats.map((day) => ({
    date: day._id.substring(5), // Exibe apenas MM-DD
    'Taxa de Similaridade': Math.round(day.avgSimilarity * 100),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
        <Title className="text-base font-medium text-gray-700 dark:text-gray-300">Validações por Dia</Title>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4">Distribuição de validações ao longo do tempo</p>
        <LineChart
          data={lineChartData}
          index="date"
          categories={['Total', 'Match', 'Sem Match']}
          colors={['blue', 'green', 'red']}
          valueFormatter={(value) => `${value} validações`}
          yAxisWidth={40}
          showAnimation={true}
          showLegend={true}
          className="h-72 mt-2"
        />
      </Card>

      <Card className="shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
        <Title className="text-base font-medium text-gray-700 dark:text-gray-300">Taxa Média de Similaridade (%)</Title>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4">Média diária de similaridade em análises faciais</p>
        <div className="h-72 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Similaridade']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Taxa de Similaridade" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
