import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardSection } from './Card';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'flat', 'outlined'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    hoverable: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    children: (
      <>
        <CardHeader title="Card Title" subtitle="Card Subtitle" />
        <CardSection>
          This is the content of the card. It can contain text, images, or other components.
        </CardSection>
      </>
    ),
  },
};

export const Flat: Story = {
  args: {
    variant: 'flat',
    children: (
      <>
        <CardHeader title="Flat Card" subtitle="Without shadow" />
        <CardSection>
          Flat cards are useful for secondary content or nested cards.
        </CardSection>
      </>
    ),
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: (
      <>
        <CardHeader title="Outlined Card" />
        <CardSection>
          Outlined cards have a border instead of a shadow.
        </CardSection>
      </>
    ),
  },
};

export const Hoverable: Story = {
  args: {
    hoverable: true,
    children: (
      <>
        <CardHeader title="Hoverable Card" subtitle="Move your mouse over me" />
        <CardSection>
          Hoverable cards can be used as clickable elements or links.
        </CardSection>
      </>
    ),
  },
};
