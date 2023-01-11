import { useState } from 'react';
import { HiOutlineChevronRight } from 'react-icons/hi';
import { Button, Card, Separator, Tabs, Typography } from 'ui-components';

import IconTopRisks from '../../../../assets/icon-top-risks.svg';
import { TopRiskEchart } from '../TopRiskEchart';

const tabs = [
  {
    label: 'Vulnerabilities',
    value: 'vulnerability',
  },
  {
    label: 'Secrets',
    value: 'secret',
  },
  {
    label: 'Malwares',
    value: 'malware',
  },
];

const color_critical = '#ff4570';
const color_high = '#f90';
const color_medium = '#F8CD39';
const color_low = '#0080ff';
const color_total = '#1A56DB';

const SEVERITY_COLOR = {
  critical: '#ff4570',
  high: '#f90',
  medium: '#F8CD39',
  low: '#0080ff',
  total: '#1A56DB',
};

const VULNERABLE_COUNTS = [
  {
    label: 'Total',
    count: 897,
    color: color_total,
  },
  {
    label: 'Critical',
    count: 183,
    color: color_critical,
  },
  {
    label: 'High',
    count: 371,
    color: color_high,
  },
  {
    label: 'Medium',
    count: 290,
    color: color_medium,
  },
  {
    label: 'Low',
    count: 53,
    color: color_low,
  },
];
const MOST_VULNERABLES = [
  {
    label: 'k8s.gcr.io/echoserver:1.10',
    counts: {
      critical: 4,
      high: 6,
      low: 2,
    },
  },
  {
    label: 'k8s.gcr.io/echoserver:1.10',
    counts: {
      critical: 3,
      high: 0,
      low: 4,
    },
  },
  {
    label: 'k8s.gcr.io/echoserver:1.10',
    counts: {
      critical: 4,
      high: 8,
      low: 1,
    },
  },
  {
    label: 'k8s.gcr.io/echoserver:1.10',
    counts: {
      critical: 2,
      high: 1,
      low: 20,
    },
  },
  {
    label: 'k8s.gcr.io/echoserver:1.10',
    counts: {
      critical: 20,
      high: 20,
      low: 20,
    },
  },
];
export const TopRisks = () => {
  const [tab, setTab] = useState('vulnerability');
  return (
    <Card className="p-2">
      <div className="flex flex-row items-center gap-x-2 pb-2">
        <img src={IconTopRisks} alt="Deefence Logo" width="20" height="20" />
        <span className={`${Typography.size.base} ${Typography.weight.semibold}`}>
          Top Risks
        </span>
        <div className="flex justify-end ml-auto">
          <Button color="normal" size="xs">
            View Details&nbsp;
            <HiOutlineChevronRight />
          </Button>
        </div>
      </div>
      <Separator />
      <div className="mt-4">
        <Tabs
          value={tab}
          defaultValue={tab}
          tabs={tabs}
          onValueChange={(v) => setTab(v)}
          size="sm"
        >
          <div className="h-full dark:text-white">
            <div className={`flex gap-4 justify-center my-4`}>
              {VULNERABLE_COUNTS.map((data) => {
                return (
                  <div
                    key={data.count}
                    className={`flex flex-col ${Typography.weight.medium} border-r last:border-0 pr-8`}
                  >
                    <span className={`${Typography.size.lg}`}>{data.count}</span>
                    <span
                      className={`${Typography.size.xs}`}
                      style={{
                        color: data.color,
                      }}
                    >
                      {data.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <Separator />
            <h6
              className={`ml-2 mt-2 ${Typography.size.base} ${Typography.weight.medium}`}
            >
              Most Vulnerable Running Assets{' '}
            </h6>
            <div className="grid grid-cols-[1fr_2fr] mt-2 items-center gap-4">
              <div>
                <TopRiskEchart />
              </div>
              <div className="flex flex-col gap-y-2">
                {MOST_VULNERABLES.map((vulnerable) => {
                  return (
                    <div key={vulnerable.label} className="flex gap-x-2">
                      <div
                        className={`flex items-center gap-1 ${Typography.weight.semibold} ${Typography.size.xs}`}
                      >
                        <div
                          className="h-2 w-2"
                          style={{
                            backgroundColor: color_critical,
                          }}
                        ></div>
                        {vulnerable.counts.critical}
                      </div>
                      <div
                        className={`flex items-center gap-1 ${Typography.weight.semibold} ${Typography.size.xs}`}
                      >
                        <div
                          className="h-2 w-2"
                          style={{
                            backgroundColor: color_high,
                          }}
                        ></div>
                        {vulnerable.counts.high}
                      </div>
                      <div
                        className={`flex items-center gap-1 ${Typography.weight.semibold} ${Typography.size.xs}`}
                      >
                        <div
                          className="h-2 w-2"
                          style={{
                            backgroundColor: color_low,
                          }}
                        ></div>
                        <span>{vulnerable.counts.low}</span>
                      </div>
                      <span className={`${Typography.size.xs}`}>{vulnerable.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={`flex justify-center gap-4 mt-4 mb-4 ${Typography.size.xs}`}>
              <div className="flex items-center gap-1">
                <div
                  className="h-2 w-2"
                  style={{
                    backgroundColor: color_critical,
                  }}
                ></div>
                <span>Critical</span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className="h-2 w-2"
                  style={{
                    backgroundColor: color_high,
                  }}
                ></div>
                <span>High</span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className="h-2 w-2"
                  style={{
                    backgroundColor: color_medium,
                  }}
                ></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className="h-2 w-2"
                  style={{
                    backgroundColor: color_low,
                  }}
                ></div>
                <span>Low</span>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </Card>
  );
};
