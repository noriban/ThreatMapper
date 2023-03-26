import { ComponentMeta, ComponentStory } from '@storybook/react';

import { SearchableSelect } from '@/components/select/SearchableSelect';

export default {
  title: 'Components/SearchableSelect',
  component: SearchableSelect,
} as ComponentMeta<typeof SearchableSelect>;

const Template: ComponentStory = (args) => {
  return <SearchableSelect selectedItems={[]} name="books" asMulti />;
};

export const Default = Template.bind({});
Default.args = {};
