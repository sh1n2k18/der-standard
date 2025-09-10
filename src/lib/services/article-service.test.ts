import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as articleService from './article-service.js';
import type { Article } from '../types/index.js';

// Mock the mock data
vi.mock('../data/mock-articles.js', () => ({
	mockArticles: [
		{
			id: 'test-1',
			headline: 'Test Article 1',
			author: 'Test Author 1',
			publicationDate: '2024-01-15T10:00:00Z',
			categories: ['Test'],
			headerImageUrl: 'https://example.com/image1.jpg',
			text: 'Test content 1'
		},
		{
			id: 'test-2',
			headline: 'Test Article 2',
			author: 'Test Author 2',
			publicationDate: '2024-01-16T11:00:00Z',
			categories: ['Sport', 'Test'],
			headerImageUrl: 'https://example.com/image2.jpg',
			text: 'Test content 2 with different text'
		},
		{
			id: 'test-3',
			headline: 'Politik Article',
			author: 'Politik Author',
			publicationDate: '2024-01-17T12:00:00Z',
			categories: ['Politik'],
			headerImageUrl: 'https://example.com/image3.jpg',
			text: 'Politics content'
		}
	]
}));

describe('ArticleService (Functional)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('fetchArticles', () => {
		it('should return all articles successfully', async () => {
			const articles = await articleService.fetchArticles();

			expect(articles).toBeDefined();
			expect(articles).toHaveLength(3);
			expect(articles[0]).toHaveProperty('id');
			expect(articles[0]).toHaveProperty('headline');
		});

		it('should execute without delay in production', async () => {
			const startTime = Date.now();
			await articleService.fetchArticles();
			const endTime = Date.now();

			// Should be fast without delay simulation
			expect(endTime - startTime).toBeLessThan(100);
		});
	});

	describe('fetchArticleById', () => {
		it('should return specific article by id', async () => {
			const article = await articleService.fetchArticleById('test-1');

			expect(article).toBeDefined();
			expect(article.id).toBe('test-1');
			expect(article.headline).toBe('Test Article 1');
		});

		it('should throw 404 error for non-existent article', async () => {
			await expect(articleService.fetchArticleById('non-existent')).rejects.toThrow(
				'Article with ID non-existent not found'
			);
		});
	});

	describe('searchArticles', () => {
		it('should find articles by headline', async () => {
			const results = await articleService.searchArticles('Politik');

			expect(results).toHaveLength(1);
			expect(results[0].headline).toContain('Politik');
		});

		it('should find articles by author', async () => {
			const results = await articleService.searchArticles('Politik Author');

			expect(results).toHaveLength(1);
			expect(results[0].author).toBe('Politik Author');
		});

		it('should find articles by content text', async () => {
			const results = await articleService.searchArticles('different text');

			expect(results).toHaveLength(1);
			expect(results[0].text).toContain('different text');
		});

		it('should find articles by category', async () => {
			const results = await articleService.searchArticles('Sport');

			expect(results).toHaveLength(1);
			expect(results[0].categories).toContain('Sport');
		});

		it('should be case insensitive', async () => {
			const results = await articleService.searchArticles('POLITIK');

			expect(results).toHaveLength(1);
			expect(results[0].headline.toLowerCase()).toContain('politik');
		});

		it('should return empty array for no matches', async () => {
			const results = await articleService.searchArticles('nonexistent');

			expect(results).toHaveLength(0);
		});
	});

	describe('fetchArticlesByCategory', () => {
		it('should return articles for specific category', async () => {
			const results = await articleService.fetchArticlesByCategory('Politik');

			expect(results).toHaveLength(1);
			expect(results.every((article: Article) => article.categories.includes('Politik'))).toBe(
				true
			);
		});

		it('should be case insensitive', async () => {
			const results = await articleService.fetchArticlesByCategory('politik');

			expect(results).toHaveLength(1);
		});

		it('should return empty array for non-existent category', async () => {
			const results = await articleService.fetchArticlesByCategory('Nonexistent');

			expect(results).toHaveLength(0);
		});
	});
});
