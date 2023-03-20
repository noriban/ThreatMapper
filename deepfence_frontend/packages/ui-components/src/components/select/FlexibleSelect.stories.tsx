import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';

import { FlexibleSelect, FlexibleSelectItem } from '@/components/select/FlexibleSelect';
import { Button } from '@/main';

export default {
  title: 'Components/FlexibleSelect',
  component: FlexibleSelect,
} as ComponentMeta<typeof FlexibleSelect>;

const Template: ComponentStory = (args) => {
  const [value, setValue] = useState<string | undefined>('');

  // TODO problem. somehow first value always gets selected.
  return (
    <FlexibleSelect
      value={value}
      name="fruit"
      triggerAsChild
      // onChange={(value) => {
      //   setValue(value);
      // }}
      content={
        <>
          <FlexibleSelectItem value="Apple">Apple</FlexibleSelectItem>
          <FlexibleSelectItem value="Banana"> Mangao</FlexibleSelectItem>
          <FlexibleSelectItem value="Grape">Grape</FlexibleSelectItem>
          <FlexibleSelectItem value="Orange"> Orange</FlexibleSelectItem>
        </>
      }
    >
      <Button>Hi</Button>
    </FlexibleSelect>
  );
};

export const Default = Template.bind({});
Default.args = {};
