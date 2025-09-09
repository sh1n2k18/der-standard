import type { Article, ApiError } from '../types/index.js';

export function isValidArticle(obj: unknown): obj is Article {
	if (!obj || typeof obj !== 'object') return false;

	const article = obj as Record<string, unknown>;

	return (
		typeof article.id === 'string' &&
		typeof article.headline === 'string' &&
		typeof article.author === 'string' &&
		typeof article.text === 'string' &&
		typeof article.publicationDate === 'string' &&
		Array.isArray(article.categories) &&
		article.categories.every((cat) => typeof cat === 'string') &&
		typeof article.headerImageUrl === 'string'
	);
}

export function validateArticles(data: unknown): Article[] {
	if (!Array.isArray(data)) {
		throw new Error('Expected array of articles');
	}

	const validArticles = data.filter(isValidArticle);

	if (validArticles.length === 0) {
		throw new Error('No valid articles found in response');
	}

	return validArticles;
}

export function createApiError(message: string, status = 500, code?: string): ApiError {
	return {
		status,
		message,
		code
	};
}

export function isValidDate(dateString: string): boolean {
	const date = new Date(dateString);
	return !isNaN(date.getTime());
}
