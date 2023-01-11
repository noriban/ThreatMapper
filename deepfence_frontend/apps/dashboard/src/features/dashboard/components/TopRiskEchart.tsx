import { Pie } from '@ant-design/plots';
import { EChartsOption } from 'echarts';
import { PieChart } from 'echarts/charts';
import { LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';

echarts.use([PieChart, SVGRenderer, TooltipComponent, LegendComponent]);

const data = [
  {
    type: '分类一',
    value: 27,
  },
  {
    type: '分类二',
    value: 25,
  },
  {
    type: '分类三',
    value: 18,
  },
  {
    type: '分类四',
    value: 15,
  },
  {
    type: '分类五',
    value: 10,
  },
  {
    type: '其他',
    value: 5,
  },
];
const config = {
  width: 140,
  height: 140,
  legend: false,
  appendPadding: 10,
  data,
  angleField: 'value',
  colorField: 'type',
  radius: 1,
  innerRadius: 0.7,
  label: {
    type: 'inner',
    offset: '-50%',
    content: '{value}',
    style: {
      textAlign: 'center',
      fontSize: 14,
    },
  },
  interactions: [
    {
      type: 'element-selected',
    },
    {
      type: 'element-active',
    },
  ],
  statistic: {
    title: false,
    content: false,
  },
};

const option: EChartsOption = {
  tooltip: {
    trigger: 'item',
  },
  legend: {
    data: ['Critical', 'High', 'Medium', 'Low'],
    bottom: 'left',
  },
  //   color: ['#ff4570', '#f90', '#F8CD39', '#0080ff'],
  series: [
    {
      name: 'Secret',
      avoidLabelOverlap: false,
      type: 'pie',
      radius: ['40%', '60%'],
      //   left: '10%',
      //   width: '80%',
      label: {
        show: false,
        position: 'center',
        // emphasis: {
        //   show: true,
        // },
        // normal: {
        formatter: '{b}: {c}%',
        // },
        // emphasis: {
        //   formatter: '{b}: {c}%',
        // },
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '14',
        },
      },
      labelLine: {
        // normal: {
        //   show: false,
        // },
      },
      itemStyle: {
        // normal: {
        //   opacity: 0.7,
        // },
      },
      data: [
        { value: 60, name: 'Critical' },
        { value: 40, name: 'High' },
        { value: 20, name: 'Medium' },
        { value: 80, name: 'Low' },
      ],
    },
  ],
};

export const TopRiskEchart = () => {
  return <Pie {...config} />;
};
