// Import the echarts core module, which provides the necessary interfaces for using echarts.
import { EChartsOption } from 'echarts';
// Import charts, all with Chart suffix
import { PieChart } from 'echarts/charts';
// import components, all suffixed with Component
import {
  // TimelineComponent,
  // MarkPointComponent,
  // MarkLineComponent,
  // MarkAreaComponent,
  // LegendComponent,
  // LegendScrollComponent,
  // LegendPlainComponent,
  // DataZoomComponent,
  // DataZoomInsideComponent,
  // DataZoomSliderComponent,
  // VisualMapComponent,
  // VisualMapContinuousComponent,
  // VisualMapPiecewiseComponent,
  // AriaComponent,
  // TransformComponent,
  DatasetComponent,
  // GridSimpleComponent,
  GridComponent,
  // AxisPointerComponent,
  // BrushComponent,
  TitleComponent,
  // PolarComponent,
  // RadarComponent,
  // GeoComponent,
  // SingleAxisComponent,
  // ParallelComponent,
  // CalendarComponent,
  // GraphicComponent,
  // ToolboxComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { registerTheme, use } from 'echarts/core';
// Import renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
import {
  CanvasRenderer,
  // SVGRenderer,
} from 'echarts/renderers';
// import the core library.
import ReactEChartsCore from 'echarts-for-react/lib/core';
// import ReactEChartsCore from 'echarts-for-react/lib/core';
import { FC, useRef, useState } from 'react';

import Switch from '../switch/Switch';

const option: EChartsOption = {
  title: {
    text: 'Vulnerable',
    left: 'center',
    top: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c}%',
  },
  toolbox: {
    feature: {
      myTool: {
        show: true,
        title: 'Full screen',
        icon: 'image://img/fullscr.png',
        onclick: function () {
          console.log('======');
        },
      },
    },
  },
  legend: {
    data: ['Critical', 'High', 'Medium', 'Low'],
  },
  color: ['#ff4570', '#f90', '#F8CD39', '#0080ff'],
  series: [
    {
      name: 'Secret',
      avoidLabelOverlap: false,
      type: 'pie',
      radius: ['40%', '70%'],
      left: '10%',
      width: '80%',
      label: {
        // show: false,
        position: 'inner',
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
          fontSize: '16',
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

export const Echart: FC = () => {
  // Register the required components
  use([TitleComponent, TooltipComponent, GridComponent, PieChart, CanvasRenderer]);
  const instance = useRef(null);
  const [theme, setTheme] = useState('light');
  const onChartClick = (e: any) => {
    console.log(e);
  };
  console.log(registerTheme('wow', {}));
  return (
    <div>
      <ReactEChartsCore
        style={{
          height: '80vh',
        }}
        ref={instance}
        echarts={echarts}
        option={option}
        notMerge={true}
        lazyUpdate={true}
        theme={theme}
        onChartReady={() => console.log('chart is ready')}
        onEvents={{
          click: onChartClick,
        }}
        // opts={}
      />

      <div className="mt-10 flex justify-center">
        <Switch
          label="Theme-Mode"
          onCheckedChange={(v) => {
            console.log(v);
            if (v) {
              setTheme('dark');
            } else {
              setTheme('light');
            }
          }}
        />
      </div>
    </div>
  );
};
