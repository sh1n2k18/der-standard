import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/svelte';
import ArticleCard from './ArticleCard.svelte';
import type { Article } from '$lib/types/index.js';

const mockArticle: Article = {
	id: 'unique-test-1',
	headline: 'Unique Test Article Headline',
	author: 'Unique Test Author',
	publicationDate: '2024-01-01T10:00:00Z',
	categories: ['Politik', 'International'],
	headerImageUrl: 'https://example.com/unique-image.jpg',
	text: 'This is unique test article content.'
};

describe('ArticleCard Component', () => {
	let onClickMock: () => void;

	beforeEach(() => {
		onClickMock = vi.fn();
	});

	afterEach(() => {
		cleanup();
	});

	it('renders article information correctly', () => {
		const { getByText, getByRole } = render(ArticleCard, {
			article: mockArticle
		});

		expect(getByText('Unique Test Article Headline')).toBeTruthy();
		expect(getByText('Unique Test Author')).toBeTruthy();
		expect(getByText('Politik')).toBeTruthy();
		expect(getByText('International')).toBeTruthy();

		const img = getByRole('img') as HTMLImageElement;
		expect(img.src).toBe('https://example.com/unique-image.jpg');
	});

	it('handles click events properly', () => {
		const { container } = render(ArticleCard, {
			article: mockArticle,
			onclick: onClickMock
		});

		const card = container.querySelector('[role="article"]') as HTMLElement;
		expect(card).toBeTruthy();
		card.click();

		expect(onClickMock).toHaveBeenCalledTimes(1);
	});

	it('has proper accessibility attributes', () => {
		const { container } = render(ArticleCard, {
			article: mockArticle,
			onclick: onClickMock
		});

		const card = container.querySelector('[role="article"]') as HTMLElement;
		expect(card.getAttribute('tabindex')).toBe('0');
		expect(card.getAttribute('aria-label')).toContain('Unique Test Article Headline');
	});

	it('handles keyboard navigation properly', () => {
		const { container } = render(ArticleCard, {
			article: mockArticle,
			onclick: onClickMock
		});

		const card = container.querySelector('[role="article"]') as HTMLElement;
		card.dispatchEvent(new KeyboardEvent('keydown', { 
			key: 'Enter', 
			bubbles: true,
			cancelable: true 
		}));

		expect(onClickMock).toHaveBeenCalledTimes(1);
	});
});
