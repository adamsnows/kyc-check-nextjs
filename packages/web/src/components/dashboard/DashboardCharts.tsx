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
    <div className="space-y-6 mt-6">
      <Card>
        <Title>Validações por Dia</Title>
        <LineChart
          data={lineChartData}
          index="date"
          categories={['Total', 'Match', 'Sem Match']}
          colors={['blue', 'green', 'red']}
          valueFormatter={(value) => `${value} validações`}
          yAxisWidth={40}
          className="h-72 mt-4"
        />
      </Card>

      <Card>
        <Title>Taxa Média de Similaridade (%)</Title>
        <div className="h-72 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Similaridade']} />
              <Legend />
              <Bar dataKey="Taxa de Similaridade" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
