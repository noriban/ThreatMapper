// Import the echarts core module, which provides the necessary interfaces for using echarts.
import { EChartsOption } from 'echarts';
// Import charts, all with Chart suffix
import { SunburstChart } from 'echarts/charts';
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

const data = [
  {
    name: 'Flora',
    itemStyle: {
      color: '#da0d68',
    },
    children: [
      {
        name: 'Black Tea',
        value: 1,
        itemStyle: {
          color: '#975e6d',
        },
      },
      {
        name: 'Floral',
        itemStyle: {
          color: '#e0719c',
        },
        children: [
          {
            name: 'Chamomile',
            value: 1,
            itemStyle: {
              color: '#f99e1c',
            },
          },
          {
            name: 'Rose',
            value: 1,
            itemStyle: {
              color: '#ef5a78',
            },
          },
          {
            name: 'Jasmine',
            value: 1,
            itemStyle: {
              color: '#f7f1bd',
            },
          },
        ],
      },
    ],
  },

  {
    name: 'Other',
    itemStyle: {
      color: '#0aa3b5',
    },
    children: [
      {
        name: 'Papery/Musty',
        itemStyle: {
          color: '#9db2b7',
        },
        children: [
          {
            name: 'Stale',
            value: 1,
            itemStyle: {
              color: '#8b8c90',
            },
          },
          {
            name: 'Cardboard',
            value: 1,
            itemStyle: {
              color: '#beb276',
            },
          },
          {
            name: 'Papery',
            value: 1,
            itemStyle: {
              color: '#fefef4',
            },
          },
          {
            name: 'Woody',
            value: 1,
            itemStyle: {
              color: '#744e03',
            },
          },
          {
            name: 'Moldy/Damp',
            value: 1,
            itemStyle: {
              color: '#a3a36f',
            },
          },
          {
            name: 'Musty/Dusty',
            value: 1,
            itemStyle: {
              color: '#c9b583',
            },
          },
          {
            name: 'Musty/Earthy',
            value: 1,
            itemStyle: {
              color: '#978847',
            },
          },
          {
            name: 'Animalic',
            value: 1,
            itemStyle: {
              color: '#9d977f',
            },
          },
          {
            name: 'Meaty Brothy',
            value: 1,
            itemStyle: {
              color: '#cc7b6a',
            },
          },
          {
            name: 'Phenolic',
            value: 1,
            itemStyle: {
              color: '#db646a',
            },
          },
        ],
      },
      {
        name: 'Chemical',
        itemStyle: {
          color: '#76c0cb',
        },
        children: [
          {
            name: 'Bitter',
            value: 1,
            itemStyle: {
              color: '#80a89d',
            },
          },
          {
            name: 'Salty',
            value: 1,
            itemStyle: {
              color: '#def2fd',
            },
          },
          {
            name: 'Medicinal',
            value: 1,
            itemStyle: {
              color: '#7a9bae',
            },
          },
          {
            name: 'Petroleum',
            value: 1,
            itemStyle: {
              color: '#039fb8',
            },
          },
          {
            name: 'Skunky',
            value: 1,
            itemStyle: {
              color: '#5e777b',
            },
          },
          {
            name: 'Rubber',
            value: 1,
            itemStyle: {
              color: '#120c0c',
            },
          },
        ],
      },
    ],
  },
  {
    name: 'Nutty/\nCocoa',
    itemStyle: {
      color: '#a87b64',
    },
    children: [
      {
        name: 'Nutty',
        itemStyle: {
          color: '#c78869',
        },
        children: [
          {
            name: 'Peanuts',
            value: 1,
            itemStyle: {
              color: '#d4ad12',
            },
          },
          {
            name: 'Hazelnut',
            value: 1,
            itemStyle: {
              color: '#9d5433',
            },
          },
          {
            name: 'Almond',
            value: 1,
            itemStyle: {
              color: '#c89f83',
            },
          },
        ],
      },
      {
        name: 'Cocoa',
        itemStyle: {
          color: '#bb764c',
        },
        children: [
          {
            name: 'Chocolate',
            value: 1,
            itemStyle: {
              color: '#692a19',
            },
          },
          {
            name: 'Dark Chocolate',
            value: 1,
            itemStyle: {
              color: '#470604',
            },
          },
        ],
      },
    ],
  },
  {
    name: 'Sweet',
    itemStyle: {
      color: '#e65832',
    },
    children: [
      {
        name: 'Brown Sugar',
        itemStyle: {
          color: '#d45a59',
        },
        children: [
          {
            name: 'Molasses',
            value: 1,
            itemStyle: {
              color: '#310d0f',
            },
          },
          {
            name: 'Maple Syrup',
            value: 1,
            itemStyle: {
              color: '#ae341f',
            },
          },
          {
            name: 'Caramelized',
            value: 1,
            itemStyle: {
              color: '#d78823',
            },
          },
          {
            name: 'Honey',
            value: 1,
            itemStyle: {
              color: '#da5c1f',
            },
          },
        ],
      },
      {
        name: 'Vanilla',
        value: 1,
        itemStyle: {
          color: '#f89a80',
        },
      },
      {
        name: 'Vanillin',
        value: 1,
        itemStyle: {
          color: '#f37674',
        },
      },
      {
        name: 'Overall Sweet',
        value: 1,
        itemStyle: {
          color: '#e75b68',
        },
      },
      {
        name: 'Sweet Aromatics',
        value: 1,
        itemStyle: {
          color: '#d0545f',
        },
      },
    ],
  },
];

export const Echart2: FC = () => {
  const option: EChartsOption = {
    title: {
      text: 'WORLD COFFEE RESEARCH SENSORY LEXICON',
      subtext: 'Source: https://worldcoffeeresearch.org/work/sensory-lexicon/',
      textStyle: {
        fontSize: 14,
        align: 'center',
      },
      subtextStyle: {
        align: 'center',
      },
      sublink: 'https://worldcoffeeresearch.org/work/sensory-lexicon/',
    },

    series: {
      type: 'sunburst',
      data: data,
      radius: [0, '95%'],
      sort: undefined,
      levels: [
        {},
        {
          r0: '15%',
          r: '35%',
          itemStyle: {
            borderWidth: 2,
          },
          label: {
            rotate: 'tangential',
          },
        },
        {
          r0: '35%',
          r: '70%',
          label: {
            align: 'right',
          },
        },
        {
          r0: '70%',
          r: '72%',
          label: {
            position: 'outside',
            padding: 3,
            silent: false,
          },
          itemStyle: {
            borderWidth: 3,
          },
        },
      ],
    },
  };
  // Register the required components
  use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    SunburstChart,
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
