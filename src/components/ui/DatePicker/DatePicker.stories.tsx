import type { Meta, StoryObj } from '@storybook/react';
import DatePicker from './DatePicker';

const meta: Meta<typeof DatePicker> = {
	title: 'UI/DatePicker',
	component: DatePicker,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		mode: {
			control: 'radio',
			options: ['date', 'datetime'],
		},
		selectionType: {
			control: 'radio',
			options: ['single', 'range'],
		},
	},
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const SingleDate: Story = {
	args: {
		mode: 'date',
		selectionType: 'single',
	},
};

export const DateRange: Story = {
	args: {
		mode: 'date',
		selectionType: 'range',
	},
};

export const SingleDateTime: Story = {
	args: {
		mode: 'datetime',
		selectionType: 'single',
	},
};

export const DateTimeRange: Story = {
	args: {
		mode: 'datetime',
		selectionType: 'range',
	},
};
