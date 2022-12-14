import cx from 'classnames';
import { useCopyToClipboard } from 'react-use';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Card,
  Typography,
} from 'ui-components';

import { CopyToClipboardIcon } from '../../../../../components/CopyToClipboardIcon';

export const DockerConnectorForm = () => {
  const [clipboardCopied, copyToClipboard] = useCopyToClipboard();

  const code = `docker run -dit --cpus=".5" --ulimit core=0 --name=deepfence-agent --restart on-failure --pid=host --net=host \\
  --uts=host --privileged=true -v /sys/kernel/debug:/sys/kernel/debug:rw -v /var/log/fenced -v /var/run/docker.sock:/var/run/docker.sock \\
  -v /var/lib/docker/:/fenced/mnt/host/var/lib/docker/:rw -v /:/fenced/mnt/host/:ro -e DF_FIM_ON="Y" -e DF_TRAFFIC_ANALYSIS_ON="" \\
  -e DF_ENABLE_PROCESS_REPORT="true" -e DF_ENABLE_CONNECTIONS_REPORT="true" -e INSTANCE_ID_SUFFIX="N" -e DF_PKT_CAPTURE_PERCENTAGE="100"\\
  -e USER_DEFINED_TAGS= -e DF_PKT_CAPTURE_SNAP_LENGTH="65535" -e DF_CAPTURE_INTF="any" \\
  -e MGMT_CONSOLE_URL="${
    window.location.host ?? '---CONSOLE-IP---'
  }" -e MGMT_CONSOLE_PORT="443" -e SCOPE_HOSTNAME="$(hostname)" \\
  -e DEEPFENCE_KEY="${localStorage.getItem(
    'dfApiKey',
  )}" -e DF_TRAFFIC_ANALYSIS_PROCESSES="" -e DF_TRAFFIC_ANALYSIS_MODE="all" \\
  quay.io/deepfenceio/deepfence_agent:${''}
`;

  return (
    <Accordion type="multiple">
      <AccordionItem value="Connect Cloud Formation">
        <AccordionTrigger>Connect Cloud Formation</AccordionTrigger>
        <AccordionContent className={`${Typography.size.base}`}>
          <p className="px-5 pt-5">Connect to your Docker container.</p>
          <p className="px-5 pb-5">
            Find out more information by{' '}
            <a
              href="https://docs.deepfence.io/threatstryker/docs/sensors/docker/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              reading our documentation
            </a>
            .
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Docker Login">
        <AccordionTrigger>Docker Login</AccordionTrigger>
        <AccordionContent>
          <div className="p-5">
            <Card className="w-full relative">
              <pre
                className={cx(
                  'p-4',
                  `${Typography.weight.normal} ${Typography.size.sm} `,
                )}
              >
                <pre>docker login --username ######## quay.io</pre>
                <pre># (Enter password: ######)</pre>
              </pre>
              <CopyToClipboardIcon
                onClick={() => {
                  copyToClipboard(code);
                }}
              />
            </Card>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Copy Code">
        <AccordionTrigger>Copy Code</AccordionTrigger>
        <AccordionContent>
          <div className="p-5">
            <Card className="w-full relative">
              <pre
                className={cx(
                  'p-4',
                  `${Typography.weight.normal} ${Typography.size.sm} `,
                )}
              >
                {code}
              </pre>
              <CopyToClipboardIcon
                onClick={() => {
                  copyToClipboard(code);
                }}
              />
            </Card>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
