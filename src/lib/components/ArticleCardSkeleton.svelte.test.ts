import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ArticleCardSkeleton from './ArticleCardSkeleton.svelte';

describe('ArticleCardSkeleton Component', () => {
	it('renders loading skeleton with proper accessibility', () => {
		const { container, getByText } = render(ArticleCardSkeleton);

		// Should have animate-pulse class for loading animation
		const skeletonElement = container.querySelector('.animate-pulse');
		expect(skeletonElement).toBeTruthy();

		// Should have screen reader text
		expect(getByText('Artikel wird geladen...')).toBeTruthy();
	});

	it('has proper structural elements', () => {
		const { container } = render(ArticleCardSkeleton);

		// Should have image placeholder with aspect ratio
		const imagePlaceholder = container.querySelector('.aspect-\\[2\\/1\\]');
		expect(imagePlaceholder).toBeTruthy();

		// Should have multiple loading bars for text content
		const textPlaceholders = container.querySelectorAll('.h-4.bg-gray-300');
		expect(textPlaceholders.length).toBeGreaterThan(0);
	});

	it('uses Card component structure', () => {
		const { container } = render(ArticleCardSkeleton);

		// Should use Card component structure
		const cardElement = container.querySelector('[class*="border"]');
		expect(cardElement).toBeTruthy();

		// Should have padding
		const contentArea = container.querySelector('.p-4');
		expect(contentArea).toBeTruthy();
	});
});
