import type { EChartsOption } from 'echarts';

import { ReactECharts } from '@/components/ReactEcharts';
import { Mode } from '@/theme/ThemeContext';

export const ScanResultChart = ({
  theme,
  seriesOption,
}: {
  theme: Mode;
  seriesOption: EChartsOption['series'];
}) => {
  if (!seriesOption) {
    return null;
  }

  return (
    <ReactECharts
      theme={theme === 'dark' ? 'dark' : 'light'}
      option={{
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          confine: true,
        },
        legend: {
          show: false,
        },
        grid: {
          left: 0,
          right: 0,
          width: '100%',
        },
        xAxis: {
          type: 'value',
          show: false,
        },

        yAxis: {
          type: 'category',
          data: ['Severity'],
        },
        series: seriesOption,
      }}
    />
  );
};
