import type { Meta, StoryObj } from '@storybook/react';
import DataTable, { Column } from './DataTable';
import StatusChip from './StatusChip';
import React from 'react';

const meta = {
  title: 'UI/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    loading: { control: 'boolean' },
    striped: { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'operational' | 'inactive' | 'pending';
}

const mockColumns: Column<User>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role', sortable: true },
  { 
    key: 'status', 
    header: 'Status',
    render: (value) => <StatusChip status={value as any} size="sm" />
  },
];

const mockData: User[] = [
  { id: '1', name: 'Alice Smith', email: 'alice@example.com', role: 'Admin', status: 'operational' },
  { id: '2', name: 'Bob Jones', email: 'bob@example.com', role: 'User', status: 'inactive' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Editor', status: 'pending' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', role: 'User', status: 'operational' },
];

export const Default: Story = {
  args: {
    columns: mockColumns as any, // Cast to avoid complex type errors in storybook config
    data: mockData,
    keyField: 'id',
    caption: 'List of users in the system',
  },
};

export const Loading: Story = {
  args: {
    columns: mockColumns as any,
    data: [],
    keyField: 'id',
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    columns: mockColumns as any,
    data: [],
    keyField: 'id',
    emptyMessage: 'No users found.',
  },
};

export const ClickableRows: Story = {
  args: {
    columns: mockColumns as any,
    data: mockData,
    keyField: 'id',
    onRowClick: (row) => alert(`Clicked on ${row.name}`),
  },
};
