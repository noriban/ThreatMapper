// Import the echarts core module, which provides the necessary interfaces for using echarts.
import { EChartsOption } from 'echarts';
// Import charts, all with Chart suffix
import { PieChart } from 'echarts/charts';
// import components, all suffixed with Component
import {
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
  // TimelineComponent,
  // MarkPointComponent,
  // MarkLineComponent,
  // MarkAreaComponent,
  LegendComponent,
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
  ToolboxComponent,
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

import Modal from '../modal/Modal';
import Switch from '../switch/Switch';

export const Echart: FC = () => {
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
      show: true,
      feature: {
        myTool1: {
          show: true,
          title: 'custom extension method 1',
          icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
          onclick: function () {
            setZoom(true);
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
  // Register the required components
  use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    PieChart,
    CanvasRenderer,
    ToolboxComponent,
    LegendComponent,
  ]);
  const instance = useRef(null);
  const [theme, setTheme] = useState('light');
  const [zoom, setZoom] = useState(false);
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
      {zoom && (
        <Modal open={zoom} onOpenChange={() => setZoom(false)} width="w-full">
          <ReactEChartsCore
            style={{
              height: '80vh',
            }}
            ref={instance}
            echarts={echarts}
            option={{ ...option, toolbox: option.toolbox.feature.myTool1 }}
            notMerge={true}
            lazyUpdate={true}
            theme={theme}
            onChartReady={() => console.log('chart is ready')}
            onEvents={{
              click: onChartClick,
            }}
            // opts={}
          />
        </Modal>
      )}
    </div>
  );
};
