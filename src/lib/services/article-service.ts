import type { Article, ArticleId } from '../types/index.js';
import { mockArticles } from '../data/mock-articles.js';
import { validateArticles, createApiError } from '../utils/validation.js';

// Modern functional approach - no classes needed
export async function fetchArticles(): Promise<Article[]> {
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

export async function fetchArticleById(id: ArticleId): Promise<Article> {
	const article = mockArticles.find((article) => article.id === id);

	if (!article) {
		throw createApiError(`Article with ID ${id} not found`, 404, 'NOT_FOUND');
	}

	return article;
}

export async function searchArticles(query: string): Promise<Article[]> {
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

export async function fetchArticlesByCategory(category: string): Promise<Article[]> {
	const filteredArticles = mockArticles.filter((article) =>
		article.categories.some((cat) => cat.toLowerCase() === category.toLowerCase())
	);

	return filteredArticles;
}
