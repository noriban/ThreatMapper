import type { EChartsOption } from 'echarts';
import { IconContext } from 'react-icons';
import { HiOutlineExclamationCircle, HiOutlineStatusOffline } from 'react-icons/hi';
import { generatePath } from 'react-router-dom';

import { ModelScanListResp } from '@/api/generated';
import { DFLink } from '@/components/DFLink';
import { SEVERITY_COLORS } from '@/constants/charts';
import { ScanResultChart } from '@/features/topology/components/scan-results/ScanResultChart';
import { LoaderData } from '@/features/topology/data-components/node-details/Host';
import { Mode, useTheme } from '@/theme/ThemeContext';

const getSeriesOption = (counts: {
  critical: number;
  high: number;
  low: number;
  medium: number;
  unknown: number;
}): EChartsOption['series'] => {
  return [
    {
      name: 'Critical',
      type: 'bar',
      barWidth: '100%',
      stack: 'total',
      label: { show: false },
      data: [counts.critical],
      color: SEVERITY_COLORS['critical'],
    },
    {
      name: 'High',
      type: 'bar',
      barWidth: '100%',
      stack: 'total',
      label: { show: false },
      data: [counts.high],
      color: SEVERITY_COLORS['high'],
    },
    {
      name: 'Medium',
      type: 'bar',
      barWidth: '100%',
      stack: 'total',
      label: { show: false },
      data: [counts.medium],
      color: SEVERITY_COLORS['medium'],
    },
    {
      name: 'Low',
      type: 'bar',
      barWidth: '100%',
      stack: 'total',
      label: { show: false },
      data: [counts.low],
      color: SEVERITY_COLORS['low'],
    },
    {
      name: 'Unknown',
      type: 'bar',
      barWidth: '100%',
      stack: 'total',
      label: { show: false },
      data: [counts.unknown],
      color: SEVERITY_COLORS['unknown'],
    },
  ];
};

const isScanNeverRun = (scanResult: ModelScanListResp | null) => {
  const scanStatus = scanResult?.scans_info?.[0]?.status;
  return scanResult?.scans_info?.length === 0 || !scanStatus;
};

const isScanRunAnError = (scanResult: ModelScanListResp | null) => {
  const scanStatus = scanResult?.scans_info?.[0]?.status;
  return scanStatus && scanStatus === 'ERROR';
};

const isScanCompleted = (scanResult: ModelScanListResp | null) => {
  const scanStatus = scanResult?.scans_info?.[0]?.status;
  return scanStatus && scanStatus === 'COMPLETE';
};

const MalwareScanComponent = ({
  malwareResult,
  mode,
}: {
  malwareResult: ModelScanListResp | null;
  mode: Mode;
}) => {
  const malwareCounts = {
    critical: 0,
    high: 0,
    low: 0,
    medium: 0,
    unknown: 0,
    ...(malwareResult?.scans_info?.[0]?.severity_counts ?? {}),
  };
  return (
    <div>
      <>
        <div className="flex items-center pb-2 gap-x-3">
          <h3 className="text-gray-900 dark:text-gray-400 text-sm">
            Latest malware scan result
          </h3>
          {isScanCompleted(malwareResult) && malwareResult?.scans_info?.[0]?.scan_id && (
            <DFLink
              to={generatePath('/malware/scan-results/:scanId', {
                scanId: malwareResult.scans_info[0].scan_id,
              })}
              className="text-xs underline"
            >
              See details
            </DFLink>
          )}
        </div>

        {isScanCompleted(malwareResult) && (
          <div className="h-[40px]">
            <ScanResultChart seriesOption={getSeriesOption(malwareCounts)} theme={mode} />
          </div>
        )}

        {isScanRunAnError(malwareResult) && (
          <div className="flex flex-col items-center">
            <IconContext.Provider
              value={{
                className: 'dark:text-red-600 text-red-400 w-[40px] h-[40px]',
              }}
            >
              <HiOutlineExclamationCircle />
            </IconContext.Provider>
            <p className="text-red-500 text-xs pt-2">Scan run an error</p>
          </div>
        )}

        {isScanNeverRun(malwareResult) && (
          <div className="flex flex-col items-center">
            <IconContext.Provider
              value={{
                className: 'dark:text-gray-600 text-gray-400 w-[40px] h-[40px]',
              }}
            >
              <HiOutlineStatusOffline />
            </IconContext.Provider>
            <p className="dark:text-gray-400 text-gray-400 text-xs py-3">
              Scan has never run
            </p>
          </div>
        )}
      </>
    </div>
  );
};

const SecretScanComponent = ({
  secretResult,
  mode,
}: {
  secretResult: ModelScanListResp | null;
  mode: Mode;
}) => {
  const secretCounts = {
    critical: 0,
    high: 0,
    low: 0,
    medium: 0,
    unknown: 0,
    ...(secretResult?.scans_info?.[0]?.severity_counts ?? {}),
  };
  return (
    <div>
      <>
        <div className="flex items-center pb-2 gap-x-3">
          <h3 className="text-gray-900 dark:text-gray-400 text-sm">
            Latest secret scan result
          </h3>
          {isScanCompleted(secretResult) && secretResult?.scans_info?.[0]?.scan_id && (
            <DFLink
              to={generatePath('/secret/scan-results/:scanId', {
                scanId: secretResult.scans_info[0].scan_id,
              })}
              className="text-xs underline"
            >
              See details
            </DFLink>
          )}
        </div>

        {isScanCompleted(secretResult) && (
          <div className="h-[40px]">
            <ScanResultChart seriesOption={getSeriesOption(secretCounts)} theme={mode} />
          </div>
        )}

        {isScanRunAnError(secretResult) && (
          <div className="flex flex-col items-center">
            <IconContext.Provider
              value={{
                className: 'dark:text-red-600 text-red-400 w-[40px] h-[40px]',
              }}
            >
              <HiOutlineExclamationCircle />
            </IconContext.Provider>
            <p className="text-red-500 text-xs pt-2">Scan run an error</p>
          </div>
        )}

        {isScanNeverRun(secretResult) && (
          <div className="flex flex-col items-center">
            <IconContext.Provider
              value={{
                className: 'dark:text-gray-600 text-gray-400 w-[40px] h-[40px]',
              }}
            >
              <HiOutlineStatusOffline />
            </IconContext.Provider>
            <p className="dark:text-gray-400 text-gray-400 text-xs py-3">
              Scan has never run
            </p>
          </div>
        )}
      </>
    </div>
  );
};

const ComplianceScanComponent = ({
  complianceResult,
  mode,
}: {
  complianceResult: ModelScanListResp | null;
  mode: Mode;
}) => {
  const complianceCounts = {
    critical: 0,
    high: 0,
    low: 0,
    medium: 0,
    unknown: 0,
    ...(complianceResult?.scans_info?.[0]?.severity_counts ?? {}),
  };
  return (
    <div>
      <>
        <div className="flex items-center pb-2 gap-x-3">
          <h3 className="text-gray-900 dark:text-gray-400 text-sm">
            Latest compliance scan result
          </h3>
          {isScanCompleted(complianceResult) &&
            complianceResult?.scans_info?.[0]?.scan_id && (
              <DFLink
                to={generatePath('/posture/scan-results/:nodeType/:scanId', {
                  scanId: complianceResult.scans_info[0].scan_id,
                  nodeType: 'host',
                })}
                className="text-xs underline"
              >
                See details
              </DFLink>
            )}
        </div>

        {isScanCompleted(complianceResult) && (
          <div className="h-[40px]">
            <ScanResultChart
              seriesOption={getSeriesOption(complianceCounts)}
              theme={mode}
            />
          </div>
        )}

        {isScanRunAnError(complianceResult) && (
          <div className="flex flex-col items-center">
            <IconContext.Provider
              value={{
                className: 'dark:text-red-600 text-red-400 w-[40px] h-[40px]',
              }}
            >
              <HiOutlineExclamationCircle />
            </IconContext.Provider>
            <p className="text-red-500 text-xs pt-2">Scan run an error</p>
          </div>
        )}

        {isScanNeverRun(complianceResult) && (
          <div className="flex flex-col items-center">
            <IconContext.Provider
              value={{
                className: 'dark:text-gray-600 text-gray-400 w-[40px] h-[40px]',
              }}
            >
              <HiOutlineStatusOffline />
            </IconContext.Provider>
            <p className="dark:text-gray-400 text-gray-400 text-xs py-3">
              Scan has never run
            </p>
          </div>
        )}
      </>
    </div>
  );
};

const VulnerabilityScanComponent = ({
  vulnerabilityResult,
  mode,
}: {
  vulnerabilityResult: ModelScanListResp | null;
  mode: Mode;
}) => {
  const vulnerabilityCounts = {
    critical: 0,
    high: 0,
    low: 0,
    medium: 0,
    unknown: 0,
    ...(vulnerabilityResult?.scans_info?.[0]?.severity_counts ?? {}),
  };
  return (
    <div>
      <>
        <div className="flex items-center pb-2 gap-x-3">
          <h3 className="text-gray-900 dark:text-gray-400 text-sm">
            Latest vulnerability scan result
          </h3>
          {isScanCompleted(vulnerabilityResult) &&
            vulnerabilityResult?.scans_info?.[0]?.scan_id && (
              <DFLink
                to={generatePath('/vulnerability/scan-results/:scanId', {
                  scanId: vulnerabilityResult.scans_info[0].scan_id,
                })}
                className="text-xs underline"
              >
                See details
              </DFLink>
            )}
        </div>

        {isScanCompleted(vulnerabilityResult) && (
          <div className="h-[40px]">
            <ScanResultChart
              seriesOption={getSeriesOption(vulnerabilityCounts)}
              theme={mode}
            />
          </div>
        )}

        {isScanRunAnError(vulnerabilityResult) && (
          <div className="flex flex-col items-center">
            <IconContext.Provider
              value={{
                className: 'dark:text-red-600 text-red-400 w-[40px] h-[40px]',
              }}
            >
              <HiOutlineExclamationCircle />
            </IconContext.Provider>
            <p className="text-red-500 text-xs pt-2">Scan run an error</p>
          </div>
        )}

        {isScanNeverRun(vulnerabilityResult) && (
          <div className="flex flex-col items-center">
            <IconContext.Provider
              value={{
                className: 'dark:text-gray-600 text-gray-400 w-[40px] h-[40px]',
              }}
            >
              <HiOutlineStatusOffline />
            </IconContext.Provider>
            <p className="dark:text-gray-400 text-gray-400 text-xs py-3">
              Scan has never run
            </p>
          </div>
        )}
      </>
    </div>
  );
};

export const ScanResult = ({
  scanResults,
}: {
  scanResults: LoaderData['scanResults'] | undefined;
}) => {
  if (!scanResults) {
    return null;
  }
  const { mode } = useTheme();
  const { vulnerabilityResult, secretResult, malwareResult, complianceResult } =
    scanResults;

  return (
    <div className="flex flex-col space-y-8">
      <VulnerabilityScanComponent vulnerabilityResult={vulnerabilityResult} mode={mode} />
      <SecretScanComponent secretResult={secretResult} mode={mode} />
      <MalwareScanComponent malwareResult={malwareResult} mode={mode} />
      <ComplianceScanComponent complianceResult={complianceResult} mode={mode} />
    </div>
  );
};
