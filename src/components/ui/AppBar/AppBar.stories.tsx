import type { Meta, StoryObj } from "@storybook/react"
import AppBar from "./AppBar"

const meta = {
    title: 'AppBar',
    component: AppBar,
    tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {},
} satisfies Meta<typeof AppBar>;

export default meta;

type Story = StoryObj<typeof AppBar>;

export const Default = {
    args: {
        // props
    },
} satisfies Story;
