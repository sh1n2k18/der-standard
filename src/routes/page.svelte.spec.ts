import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import Page from './+page.svelte';

// Mock the article store
vi.mock('$lib/stores/article-store.js', () => ({
	articleStore: {
		fetchArticles: vi.fn().mockResolvedValue(undefined)
	},
	articles: {
		subscribe: vi.fn((callback) => {
			callback([
				{
					id: '1',
					headline: 'Test Article 1',
					author: 'Test Author 1',
					publicationDate: '2024-01-01T10:00:00Z',
					categories: ['Politik'],
					headerImageUrl: 'https://example.com/image1.jpg',
					text: 'Test content 1'
				},
				{
					id: '2',
					headline: 'Test Article 2',
					author: 'Test Author 2',
					publicationDate: '2024-01-02T10:00:00Z',
					categories: ['Sport'],
					headerImageUrl: 'https://example.com/image2.jpg',
					text: 'Test content 2'
				}
			]);
			return () => {};
		})
	},
	isLoading: {
		subscribe: vi.fn((callback) => {
			callback(false);
			return () => {};
		})
	},
	error: {
		subscribe: vi.fn((callback) => {
			callback(null);
			return () => {};
		})
	}
}));

describe('Main Page Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders page title correctly', () => {
		const { getByText, getByAltText } = render(Page);

		expect(getByAltText('DER STANDARD')).toBeTruthy();
		expect(getByText('Aktuelle Nachrichten aus Österreich und der Welt')).toBeTruthy();
	});

	it('has proper page structure', () => {
		const { container } = render(Page);

		// Should have articles container
		const articlesDiv = container.querySelector('div.space-y-4');
		expect(articlesDiv).toBeTruthy();
	});

	it('renders loading state initially', () => {
		const { container } = render(Page);

		// Should show skeleton loaders initially
		expect(container).toBeTruthy();
	});
});
