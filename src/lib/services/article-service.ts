import type { Article, ArticleId } from '../types/index.js';
import { mockArticles } from '../data/mock-articles.js';
import { validateArticles, createApiError } from '../utils/validation.js';

class ArticleService {
	private simulateNetworkDelay(): Promise<void> {
		// No delay for production
		return Promise.resolve();
	}

	private simulateError(): boolean {
		// Disable error simulation in production
		return false;
	}

	async fetchArticles(): Promise<Article[]> {
		await this.simulateNetworkDelay();

		if (this.simulateError()) {
			throw createApiError('Failed to fetch articles from server', 500, 'FETCH_ERROR');
		}

		try {
			const validatedArticles = validateArticles(mockArticles);
			return validatedArticles;
		} catch (error) {
			throw createApiError(
				error instanceof Error ? error.message : 'Invalid article data',
				422,
				'VALIDATION_ERROR'
			);
		}
	}

	async fetchArticleById(id: ArticleId): Promise<Article> {
		await this.simulateNetworkDelay();

		if (this.simulateError()) {
			throw createApiError('Failed to fetch article from server', 500, 'FETCH_ERROR');
		}

		const article = mockArticles.find((article) => article.id === id);

		if (!article) {
			throw createApiError(`Article with ID ${id} not found`, 404, 'NOT_FOUND');
		}

		return article;
	}

	async searchArticles(query: string): Promise<Article[]> {
		await this.simulateNetworkDelay();

		if (this.simulateError()) {
			throw createApiError('Failed to search articles', 500, 'SEARCH_ERROR');
		}

		const searchTerm = query.toLowerCase();
		const filteredArticles = mockArticles.filter(
			(article) =>
				article.headline.toLowerCase().includes(searchTerm) ||
				article.author.toLowerCase().includes(searchTerm) ||
				article.text.toLowerCase().includes(searchTerm) ||
				article.categories.some((category) => category.toLowerCase().includes(searchTerm))
		);

		return filteredArticles;
	}

	async fetchArticlesByCategory(category: string): Promise<Article[]> {
		await this.simulateNetworkDelay();

		if (this.simulateError()) {
			throw createApiError('Failed to fetch articles by category', 500, 'CATEGORY_ERROR');
		}

		const filteredArticles = mockArticles.filter((article) =>
			article.categories.some((cat) => cat.toLowerCase() === category.toLowerCase())
		);

		return filteredArticles;
	}
}

export const articleService = new ArticleService();
