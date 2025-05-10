import React from 'react';
import {
  Card,
  Metric,
  Text,
  Flex,
  BadgeDelta,
  DeltaType,
  Grid,
} from '@tremor/react';

interface StatsCardProps {
  title: string;
  metric: string | number;
  metricPrev?: string | number;
  delta?: string;
  deltaType?: DeltaType;
}

export function StatsCard({ title, metric, metricPrev, delta, deltaType }: StatsCardProps) {
  return (
    <Card className="mx-auto shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
      <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{title}</Text>
      <Metric className="mt-2 font-bold">{metric}</Metric>
      {delta && (
        <Flex className="mt-4 items-center">
          <Text className="text-xs">Comparado com {metricPrev}</Text>
          <BadgeDelta deltaType={deltaType || 'unchanged'} size="xs">{delta}</BadgeDelta>
        </Flex>
      )}
    </Card>
  );
}

interface DashboardStatsProps {
  totalValidations: number;
  matchValidations: number;
  notMatchValidations: number;
  matchRate: number;
  averageSimilarity: number;
}

export default function DashboardStats({
  totalValidations,
  matchValidations,
  notMatchValidations,
  matchRate,
  averageSimilarity,
}: DashboardStatsProps) {
  return (
    <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
      <StatsCard
        title="Validações Totais"
        metric={totalValidations}
      />
      <StatsCard
        title="Validações com Match"
        metric={matchValidations}
        metricPrev={totalValidations}
        delta={`${(matchValidations / totalValidations * 100).toFixed(1)}%`}
        deltaType="moderateIncrease"
      />
      <StatsCard
        title="Validações sem Match"
        metric={notMatchValidations}
        metricPrev={totalValidations}
        delta={`${(notMatchValidations / totalValidations * 100).toFixed(1)}%`}
        deltaType="moderateDecrease"
      />
      <StatsCard
        title="Taxa de Match"
        metric={`${matchRate.toFixed(1)}%`}
        deltaType="unchanged"
      />
      <StatsCard
        title="Similaridade Média"
        metric={`${(averageSimilarity * 100).toFixed(1)}%`}
        deltaType={averageSimilarity > 0.7 ? "increase" : "decrease"}
      />
    </Grid>
  );
}
