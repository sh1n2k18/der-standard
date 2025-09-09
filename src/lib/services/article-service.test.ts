import { describe, expect, it, vi, beforeEach } from 'vitest';
import { articleService } from './article-service.js';

// Mock the mock data
vi.mock('../data/mock-articles.js', () => ({
	mockArticles: [
		{
			id: 'test-1',
			headline: 'Test Article 1',
			author: 'Test Author 1',
			text: 'Test content 1',
			publicationDate: '2024-01-15T10:00:00Z',
			categories: ['Test'],
			headerImageUrl: 'https://example.com/image1.jpg'
		},
		{
			id: 'test-2',
			headline: 'Test Article 2',
			author: 'Test Author 2',
			text: 'Test content 2 with different text',
			publicationDate: '2024-01-16T11:00:00Z',
			categories: ['Sport', 'Test'],
			headerImageUrl: 'https://example.com/image2.jpg'
		},
		{
			id: 'test-3',
			headline: 'Politik Article',
			author: 'Politik Author',
			text: 'Politics content',
			publicationDate: '2024-01-17T12:00:00Z',
			categories: ['Politik'],
			headerImageUrl: 'https://example.com/image3.jpg'
		}
	]
}));

// Mock validation utils
vi.mock('../utils/validation.js', () => ({
	validateArticles: vi.fn((articles) => articles),
	createApiError: vi.fn((message: string, status: number, code?: string) => {
		const error = new Error(message) as Error & { status: number; code?: string };
		error.status = status;
		error.code = code;
		return error;
	})
}));

describe('ArticleService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Reset random to ensure predictable behavior
		vi.spyOn(Math, 'random').mockReturnValue(0.5); // Above error threshold
	});

	describe('fetchArticles', () => {
		it('should return all articles successfully', async () => {
			const articles = await articleService.fetchArticles();

			expect(articles).toHaveLength(3);
			expect(articles[0]).toHaveProperty('id', 'test-1');
			expect(articles[0]).toHaveProperty('headline', 'Test Article 1');
		});

		it('should simulate network delay', async () => {
			const startTime = Date.now();
			await articleService.fetchArticles();
			const endTime = Date.now();

			// Should take some time due to delay simulation
			expect(endTime - startTime).toBeGreaterThan(400); // Should be at least ~500ms
		});

		it('should throw error when simulated error occurs', async () => {
			// Mock random to trigger error (< 0.1)
			vi.spyOn(Math, 'random').mockReturnValue(0.05);

			await expect(articleService.fetchArticles()).rejects.toThrow(
				'Failed to fetch articles from server'
			);
		});

		it('should call validation on fetched articles', async () => {
			const { validateArticles } = await import('../utils/validation.js');

			await articleService.fetchArticles();

			expect(validateArticles).toHaveBeenCalledOnce();
		});

		it('should handle validation errors', async () => {
			const { validateArticles, createApiError } = await import('../utils/validation.js');
			vi.mocked(validateArticles).mockImplementation(() => {
				throw new Error('Invalid article format');
			});

			await expect(articleService.fetchArticles()).rejects.toThrow();
			expect(createApiError).toHaveBeenCalledWith(
				'Invalid article format',
				422,
				'VALIDATION_ERROR'
			);
		});
	});

	describe('fetchArticleById', () => {
		it('should return specific article by id', async () => {
			const article = await articleService.fetchArticleById('test-1');

			expect(article).toHaveProperty('id', 'test-1');
			expect(article).toHaveProperty('headline', 'Test Article 1');
		});

		it('should throw 404 error for non-existent article', async () => {
			await expect(articleService.fetchArticleById('non-existent')).rejects.toThrow(
				'Article with ID non-existent not found'
			);
		});

		it('should throw error when simulated error occurs', async () => {
			// Mock random to trigger error
			vi.spyOn(Math, 'random').mockReturnValue(0.05);

			await expect(articleService.fetchArticleById('test-1')).rejects.toThrow(
				'Failed to fetch article from server'
			);
		});

		it('should simulate network delay', async () => {
			const startTime = Date.now();
			await articleService.fetchArticleById('test-1');
			const endTime = Date.now();

			expect(endTime - startTime).toBeGreaterThan(400);
		});
	});

	describe('searchArticles', () => {
		it('should find articles by headline', async () => {
			const results = await articleService.searchArticles('Politik');

			expect(results).toHaveLength(1);
			expect(results[0]).toHaveProperty('headline', 'Politik Article');
		});

		it('should find articles by author', async () => {
			const results = await articleService.searchArticles('Politik Author');

			expect(results).toHaveLength(1);
			expect(results[0]).toHaveProperty('author', 'Politik Author');
		});

		it('should find articles by content text', async () => {
			const results = await articleService.searchArticles('different text');

			expect(results).toHaveLength(1);
			expect(results[0]).toHaveProperty('id', 'test-2');
		});

		it('should find articles by category', async () => {
			const results = await articleService.searchArticles('Sport');

			expect(results).toHaveLength(1);
			expect(results[0]).toHaveProperty('id', 'test-2');
		});

		it('should be case insensitive', async () => {
			const results = await articleService.searchArticles('POLITIK');

			expect(results).toHaveLength(1);
			expect(results[0]).toHaveProperty('headline', 'Politik Article');
		});

		it('should return empty array for no matches', async () => {
			const results = await articleService.searchArticles('nonexistent');

			expect(results).toHaveLength(0);
		});

		it('should throw error when simulated error occurs', async () => {
			vi.spyOn(Math, 'random').mockReturnValue(0.05);

			await expect(articleService.searchArticles('test')).rejects.toThrow(
				'Failed to search articles'
			);
		});
	});

	describe('fetchArticlesByCategory', () => {
		it('should return articles for specific category', async () => {
			const results = await articleService.fetchArticlesByCategory('Politik');

			expect(results).toHaveLength(1); // Only test-3 has Politik category
			expect(results.every((article) => article.categories.includes('Politik'))).toBe(true);
		});

		it('should be case insensitive', async () => {
			const results = await articleService.fetchArticlesByCategory('politik');

			expect(results).toHaveLength(1);
		});

		it('should return empty array for non-existent category', async () => {
			const results = await articleService.fetchArticlesByCategory('Nonexistent');

			expect(results).toHaveLength(0);
		});

		it('should throw error when simulated error occurs', async () => {
			vi.spyOn(Math, 'random').mockReturnValue(0.05);

			await expect(articleService.fetchArticlesByCategory('Politik')).rejects.toThrow(
				'Failed to fetch articles by category'
			);
		});

		it('should simulate network delay', async () => {
			const startTime = Date.now();
			await articleService.fetchArticlesByCategory('Politik');
			const endTime = Date.now();

			expect(endTime - startTime).toBeGreaterThan(400);
		});
	});
});
