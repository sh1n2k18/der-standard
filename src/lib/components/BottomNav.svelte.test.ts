import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import BottomNav from './BottomNav.svelte';

describe('BottomNav Component', () => {
	it('renders all navigation items', () => {
		const { getByText, getByLabelText } = render(BottomNav);

		// Check navigation labels
		expect(getByText('Home')).toBeTruthy();
		expect(getByText('Suche')).toBeTruthy();
		expect(getByText('Bookmarks')).toBeTruthy();
		expect(getByText('Profil')).toBeTruthy();

		// Check accessibility labels
		expect(getByLabelText('Home - Navigation')).toBeTruthy();
		expect(getByLabelText('Suche - Navigation')).toBeTruthy();
		expect(getByLabelText('Bookmarks - Navigation')).toBeTruthy();
		expect(getByLabelText('Profil - Navigation')).toBeTruthy();
	});

	it('renders SVG icons for each navigation item', () => {
		const { container } = render(BottomNav);

		// Check that SVG icons are present
		const icons = container.querySelectorAll('svg');
		expect(icons.length).toBe(4);
	});

	it('has proper navigation structure', () => {
		const { container } = render(BottomNav);

		const nav = container.querySelector('nav');
		expect(nav).toBeTruthy();
		expect(nav?.getAttribute('aria-label')).toBe('Hauptnavigation');
	});

	it('has fixed positioning and z-index', () => {
		const { container } = render(BottomNav);

		const nav = container.querySelector('nav');
		expect(nav?.className).toMatch(/fixed/);
		expect(nav?.className).toMatch(/z-50/);
	});

	it('has accessible button structure', () => {
		const { container } = render(BottomNav);

		const buttons = container.querySelectorAll('button');
		const firstButton = buttons[0];

		expect(buttons.length).toBe(4);
		expect(firstButton).toBeTruthy();
		expect(firstButton?.getAttribute('aria-label')).toContain('Navigation');
	});
});
