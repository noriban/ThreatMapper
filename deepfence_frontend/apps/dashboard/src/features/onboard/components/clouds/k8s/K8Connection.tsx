import cx from 'classnames';
import { memo, useEffect, useMemo, useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Card,
  Select,
  SelectItem,
  TextInput,
  Typography,
} from 'ui-components';

import { CopyToClipboardIcon } from '../../../../../components/CopyToClipboardIcon';
import { isInvalidInput } from '../../../../../utils/validator';

const containerRuntimeDropdown = [
  {
    name: 'containerd',
    value: `--set mountContainerRuntimeSocket.containerdSock=true \\ 
--set mountContainerRuntimeSocket.dockerSock=false \\ 
--set mountContainerRuntimeSocket.crioSock=false`,
  },
  {
    name: 'docker',
    value: `--set mountContainerRuntimeSocket.containerdSock=false \\ 
--set mountContainerRuntimeSocket.dockerSock=true \\ 
--set mountContainerRuntimeSocket.crioSock=false`,
  },
  {
    name: 'cri-o',
    value: `--set mountContainerRuntimeSocket.containerdSock=false 
\\ --set mountContainerRuntimeSocket.dockerSock=false 
\\ --set mountContainerRuntimeSocket.crioSock=true`,
  },
];

const socketMap: {
  [k: string]: {
    path: string;
    command: string;
  };
} = {
  containerd: {
    path: '/run/containerd/containerd.sock',
    command: `--set mountContainerRuntimeSocket.containerdSockPath`,
  },
  docker: {
    path: '/var/run/docker.sock',
    command: `--set mountContainerRuntimeSocket.dockerSockPath`,
  },
  'cri-o': {
    path: '/var/run/crio/crio.sock',
    command: `--set mountContainerRuntimeSocket.crioSockPath`,
  },
};

const defaultCluster = 'prod-cluster';
const defaultNamespace = 'deepfence';
const defaultRuntime = containerRuntimeDropdown[0].name;
const defaultSocketPath = socketMap.containerd.path;

const InformationForm = memo(
  ({
    setInstruction,
  }: {
    setInstruction: React.Dispatch<React.SetStateAction<string>>;
  }) => {
    const [clusterName, setClusterName] = useState(defaultCluster);
    const [namespace, setNamespace] = useState(defaultNamespace);
    const [containerRuntime, setContainerRuntime] = useState(defaultRuntime);
    const [socketPath, setSocketPath] = useState(defaultSocketPath);

    const [command, setCommand] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
      if (isInvalidInput(clusterName)) {
        setError('Spaces are not allowed in cluster name.');
      } else if (isInvalidInput(namespace)) {
        setError('Spaces are not allowed in namespace.');
      } else if (isInvalidInput(socketPath)) {
        setError('Spaces are not allowed in socket path.');
      } else {
        setError('');
      }
    }, [clusterName, namespace, socketPath]);

    useEffect(() => {
      setInstruction(command);
    }, [command]);

    const onClusterNameChange = (event: React.FormEvent<HTMLInputElement>) => {
      setClusterName(event.currentTarget.value);
    };

    const onNamespaceChange = (event: React.FormEvent<HTMLInputElement>) => {
      setNamespace(event.currentTarget.value);
    };

    const onSocketPathChange = (event: React.FormEvent<HTMLInputElement>) => {
      setSocketPath(event.currentTarget.value);
    };

    useMemo(() => {
      const _clusterName = isInvalidInput(clusterName) ? defaultCluster : clusterName;
      const _namespace = isInvalidInput(namespace) ? defaultNamespace : namespace;

      const _socketPath = isInvalidInput(socketPath)
        ? socketMap[containerRuntime].path
        : socketPath;

      const runtime = containerRuntimeDropdown.find(
        (runtime) => runtime.name === containerRuntime,
      );
      const runtimeCommand = runtime?.value || '';
      const sockCommand = socketMap[containerRuntime].command || '';

      const code = `helm repo add deepfence https://deepfence-helm-charts.s3.amazonaws.com/threatmapper
helm repo update

helm install deepfence-agent deepfence/deepfence-agent \\
--set managementConsoleUrl=${window.location.host ?? '---CONSOLE-IP---'} \\
--set deepfenceKey=${localStorage.getItem('dfApiKey') ?? '---DEEPFENCE-API-KEY---'} \\
--set image.tag=${''} \\
--set image.clusterAgentImageTag=${''} \\
--set clusterName=${_clusterName} \\
${runtimeCommand} \\
${sockCommand}="${_socketPath}" \\
--namespace ${_namespace} \\
--create-namespace`;

      setCommand(code);
    }, [clusterName, namespace, socketPath, containerRuntime]);

    return (
      <div className="p-5">
        <div className="flex gap-2 mb-4">
          <div className="w-1/2">
            <TextInput
              className="w-3/4"
              label="Enter Cluster Name"
              type={'text'}
              sizing="sm"
              name="clusterName"
              onChange={onClusterNameChange}
              value={clusterName}
            />
          </div>
          <div className="w-1/2">
            <TextInput
              className="w-3/4"
              label="Enter Namespace"
              type={'text'}
              sizing="sm"
              name="namespace"
              onChange={onNamespaceChange}
              value={namespace}
            />
          </div>
        </div>
        <div className="flex mb-4">
          <div className="w-1/2">
            <Select
              value={containerRuntime}
              name="region"
              onChange={(value) => {
                setContainerRuntime(value);
                setSocketPath(socketMap[value].path || '');
              }}
              label="Select Container Runtime"
              className="w-40"
            >
              {containerRuntimeDropdown.map((runtime) => (
                <SelectItem value={runtime.name} key={runtime.name} />
              ))}
            </Select>
          </div>
          <div className="w-1/2">
            <TextInput
              className="w-3/4"
              label="Enter Socket Path"
              type={'text'}
              sizing="sm"
              name="socketPath"
              value={socketPath}
              onChange={onSocketPathChange}
            />
          </div>
        </div>
        <div>{error && <span>{error}</span>}</div>
      </div>
    );
  },
);

export const K8Connection = () => {
  const [instruction, setInstruction] =
    useState(`helm repo add deepfence https://deepfence-helm-charts.s3.amazonaws.com/threatmapper
helm repo update

helm install deepfence-agent deepfence/deepfence-agent \\
--set managementConsoleUrl=${window.location.host ?? '---CONSOLE-IP---'} \\
--set deepfenceKey=${localStorage.getItem('dfApiKey') ?? '---DEEPFENCE-API-KEY---'} \\
--set image.tag=${''} \\
--set image.clusterAgentImageTag=${''} \\
--set clusterName=${defaultCluster} \\
${containerRuntimeDropdown[0].value} \\
${socketMap.containerd.command}="${defaultSocketPath}" \\
--namespace ${defaultNamespace} \\
--create-namespace`);

  const [clipboardCopied, copyToClipboard] = useCopyToClipboard();

  return (
    <div className="w-full sm:w-1/2">
      <Accordion type="multiple">
        <AccordionItem value={'Connect via Kubernetes Scanner'}>
          <AccordionTrigger>Connect via Kubernetes Scanner</AccordionTrigger>
          <AccordionContent
            className={`${Typography.size.base} ${Typography.weight.normal}`}
          >
            <p className="px-5 pt-5">
              Connect to your Kubernetes Account via Kubernetes Scanner.
            </p>
            <p className="px-5 pb-5">
              Find out more information by{' '}
              <a
                href="https://docs.deepfence.io/threatstryker/docs/sensors/kubernetes"
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
        <AccordionItem value={'Select a Region'}>
          <AccordionTrigger>Enter Information</AccordionTrigger>
          <AccordionContent>
            <InformationForm setInstruction={setInstruction} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value={'Copy Code'}>
          <AccordionTrigger>Copy Code</AccordionTrigger>
          <AccordionContent>
            <div className="p-5">
              <Card className="w-full relative">
                <div className="p-4 pr-10">
                  <pre
                    className={cx(
                      'overflow-scroll',
                      `${Typography.weight.normal} ${Typography.size.sm} `,
                    )}
                  >
                    {instruction}
                  </pre>
                  <CopyToClipboardIcon
                    onClick={() => {
                      copyToClipboard(instruction);
                    }}
                  />
                </div>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
