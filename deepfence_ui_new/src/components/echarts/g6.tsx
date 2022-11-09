import G6 from '@antv/g6';
import { useState } from 'react';

export const Graph = () => {
  // const graph = new G6.Graph({
  //     container: 'mountNode',
  //     width: 800,
  //     height: 600,
  //     // Set groupByTypes to false to get rendering result with reasonable visual zIndex for combos
  //     groupByTypes: false,
  //     defaultCombo: {
  //       // ... Other properties for combos
  //       labelCfg: {
  //         position: 'top',
  //         offset: [10, 10, 10, 10],
  //         style: {
  //           fill: '#666',
  //         },
  //       },
  //     },
  //   });
  const div = document.getElementById('graph');

  const [container, setContainer] = useState(null);

  const data = {
    nodes: [
      {
        id: '0',
        label: '0',
        comboId: 'a',
        x: 100,
        y: 100,
      },
      {
        id: '1',
        label: '1',
        comboId: 'a',
        x: 150,
        y: 140,
      },
      {
        id: '2',
        label: '2',
        comboId: 'b',
        x: 300,
        y: 200,
      },
      {
        id: '3',
        label: '3',
        comboId: 'b',
        x: 370,
        y: 260,
      },
      {
        id: '5',
        label: '5',
        comboId: 'e',
        x: 220,
        y: 240,
      },
      {
        id: '6',
        label: '6',
        comboId: 'e',
        x: 250,
        y: 250,
      },
      {
        id: '4',
        label: '4',
        comboId: 'c',
        x: 360,
        y: 510,
      },
    ],
    edges: [
      {
        source: '0',
        target: '1',
      },
      {
        source: '1',
        target: '2',
      },
      {
        source: '0',
        target: '2',
      },
      {
        source: '3',
        target: '0',
      },
      {
        source: '4',
        target: '1',
      },
      {
        id: '5-6',
        source: '5',
        target: '6',
      },
      {
        id: '4-6',
        source: '4',
        target: '6',
      },
    ],
    combos: [
      {
        id: 'a',
        label: 'combo a',
      },
      {
        id: 'b',
        label: 'combo b',
      },
      {
        id: 'c',
        label: 'combo c',
      },
      {
        id: 'e',
        label: 'combo e',
        parentId: 'b',
      },
    ],
  };

  const graph = new G6.Graph({
    container: div,
    width: 1000,
    height: 800,
    modes: {
      default: ['collapse-expand-combo'],
    },
    defaultCombo: {
      type: 'circle',
      style: {
        fill: '#b5f5ec',
      },
    },
    nodeStateStyles: {
      selected: {
        fill: 'red',
      },
    },
    comboStateStyles: {
      active: {
        stroke: 'red',
      },
      selected: {
        'text-shape': {
          fill: '#f00',
          fontSize: 20,
        },
        fill: '#36cfc9',
      },
      state2: {
        stroke: '#0f0',
      },
    },
  });

  graph.data(data);
  graph.render();
  return <div></div>;
};
