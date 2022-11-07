import { ComponentMeta, ComponentStory } from '@storybook/react';
import { HiChevronDoubleRight } from 'react-icons/hi';
import { Route, Routes } from 'react-router-dom';
import { withRouter } from 'storybook-addon-react-router-v6';

import { BreadCrumb } from './BreadCrumb';

export default {
  title: 'Components/BreadCrumb',
  component: BreadCrumb,
  decorators: [withRouter],
} as ComponentMeta<typeof BreadCrumb>;

const crumbs = [
  {
    path: '/one',
    label: 'Path One',
    onClick: (path: string) => {
      console.log('breadcrumb at: ', path);
    },
  },
  {
    path: '/two',
    label: 'Path two',
    onClick: (path: string) => {
      console.log('breadcrumb at: ', path);
    },
  },
  {
    path: '/three',
    label: 'Path three',
    onClick: (path: string) => {
      console.log('breadcrumb at: ', path);
    },
  },
];

const Template: ComponentStory<typeof BreadCrumb> = (args) => (
  <Routes>
    <Route path={'/'} element={<BreadCrumb {...args} />} />
    <Route path="/one" element={<OneComponent />} />
    <Route path="/two" element={<TwoComponent />} />
    <Route path="/three" element={<BreadCrumb {...args} />} />
  </Routes>
);

export const BreadCrumbComponent = Template.bind({});

BreadCrumbComponent.args = {
  separator: <HiChevronDoubleRight />,
  crumbs,
};

const OneComponent = () => (
  <BreadCrumb
    crumbs={[
      {
        path: '/one',
        label: 'Path One',
        onClick: (path: string) => {
          console.log('breadcrumb at: ', path);
        },
      },
    ]}
  />
);
const TwoComponent = () => (
  <BreadCrumb
    crumbs={[
      {
        path: '/one',
        label: 'Path One',
        onClick: (path: string) => {
          console.log('breadcrumb at: ', path);
        },
      },
      {
        path: '/two',
        label: 'Path Two',
        onClick: (path: string) => {
          console.log('breadcrumb at: ', path);
        },
      },
    ]}
    separator={<HiChevronDoubleRight />}
  />
);
