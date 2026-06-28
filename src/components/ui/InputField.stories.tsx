import type { Meta, StoryObj } from '@storybook/react';
import InputField from './InputField';

const meta = {
	title: 'UI/InputField',
	component: InputField,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		as: {
			control: 'select',
			options: ['input', 'textarea'],
		},
		label: { control: 'text' },
		hint: { control: 'text' },
		error: { control: 'text' },
		fullWidth: { control: 'boolean' },
		disabled: { control: 'boolean' },
	},
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '400px' }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		as: 'input',
		label: 'Email',
		placeholder: 'Enter your email',
	},
};

export const WithHint: Story = {
	args: {
		as: 'input',
		label: 'Username',
		placeholder: 'Enter username',
		hint: 'This will be your public name.',
	},
};

export const WithError: Story = {
	args: {
		as: 'input',
		label: 'Password',
		type: 'password',
		error: 'Password must be at least 8 characters long.',
	},
};

export const Textarea: Story = {
	args: {
		as: 'textarea',
		label: 'Description',
		placeholder: 'Tell us about yourself...',
		rows: 4,
	},
};

export const Disabled: Story = {
	args: {
		as: 'input',
		label: 'Disabled Input',
		placeholder: 'You cannot type here',
		disabled: true,
	},
};

export const WithIcons: Story = {
	args: {
		as: 'input',
		label: 'Search',
		placeholder: 'Search...',
		prefixIcon: (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width='16'
				height='16'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'>
				<circle cx='11' cy='11' r='8'></circle>
				<line x1='21' y1='21' x2='16.65' y2='16.65'></line>
			</svg>
		),
	},
};
