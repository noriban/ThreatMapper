import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';

import { FlexibleSelect, FlexibleSelectItem } from '@/components/select/FlexibleSelect';

export default {
  title: 'Components/Select',
  component: FlexibleSelect,
} as ComponentMeta<typeof FlexibleSelect>;

const Template: ComponentStory = (args) => {
  const [value, setValue] = useState<string | undefined>();
  // TODO problem. somehow first value always gets selected.
  return (
    <FlexibleSelect
      value={value}
      name="fruit"
      // onChange={(value) => {
      //   setValue(value);
      // }}
    >
      <FlexibleSelectItem value="Apple" />
      <FlexibleSelectItem value="Banana" />
      <FlexibleSelectItem value="Grape" />
      <FlexibleSelectItem value="Orange" />
    </FlexibleSelect>
  );
};

export const Default = Template.bind({});
Default.args = {};

const PreCompItem = () => {
  return <div>Citrus</div>;
};
