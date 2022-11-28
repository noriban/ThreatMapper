import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Typography } from '../typography/Typography';
import { Card } from './Card';

export default {
  title: 'Components/Card',
  component: Card,
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />;

const Content = () => (
  <div className="dfc-w-[300px] dfc-p-4">
    <h5 className={`${Typography.size.lg} dark:dfc-text-white`}>
      Northworthy technology acquisitions 2021
    </h5>
    <p
      className={`${Typography.size.sm} dfc-mt-2 dfc-text-gray-500 dark:dfc-text-gray-400`}
    >
      Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse
      chronological order.
    </p>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  children: <Content />,
};
