import type { Meta, StoryObj } from '@storybook/react';
import StatusChip from './StatusChip';

const meta = {
  title: 'UI/StatusChip',
  component: StatusChip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['operational', 'alert', 'pending', 'maintenance', 'inactive', 'info'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    dot: { control: 'boolean' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof StatusChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Operational: Story = {
  args: {
    status: 'operational',
  },
};

export const Alert: Story = {
  args: {
    status: 'alert',
  },
};

export const Pending: Story = {
  args: {
    status: 'pending',
  },
};

export const Maintenance: Story = {
  args: {
    status: 'maintenance',
  },
};

export const Inactive: Story = {
  args: {
    status: 'inactive',
  },
};

export const Info: Story = {
  args: {
    status: 'info',
  },
};

export const Small: Story = {
  args: {
    status: 'operational',
    size: 'sm',
  },
};

export const WithoutDot: Story = {
  args: {
    status: 'alert',
    dot: false,
  },
};

export const CustomLabel: Story = {
  args: {
    status: 'info',
    label: 'Custom Status Message',
  },
};
