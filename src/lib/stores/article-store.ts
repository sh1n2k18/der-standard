import { writable, derived, type Readable } from 'svelte/store';
import type { Article, ApiError, ArticleId, LoadingState } from '../types/index.js';
import { articleService } from '../services/article-service.js';

interface ArticleStoreState {
	articles: Article[];
	selectedArticle: Article | null;
	loading: LoadingState;
}

const initialState: ArticleStoreState = {
	articles: [],
	selectedArticle: null,
	loading: {
		isLoading: false,
		error: null
	}
};

function createArticleStore() {
	const { subscribe, set, update } = writable<ArticleStoreState>(initialState);

	return {
		subscribe,

		async fetchArticles() {
			update((state) => ({
				...state,
				loading: { isLoading: true, error: null }
			}));

			try {
				const articles = await articleService.fetchArticles();
				update((state) => ({
					...state,
					articles,
					loading: { isLoading: false, error: null }
				}));
			} catch (error) {
				const apiError = error as ApiError;
				update((state) => ({
					...state,
					loading: { isLoading: false, error: apiError }
				}));
			}
		},

		async fetchArticleById(id: ArticleId) {
			update((state) => ({
				...state,
				loading: { isLoading: true, error: null }
			}));

			try {
				const article = await articleService.fetchArticleById(id);
				update((state) => ({
					...state,
					selectedArticle: article,
					loading: { isLoading: false, error: null }
				}));
				return article;
			} catch (error) {
				const apiError = error as ApiError;
				update((state) => ({
					...state,
					selectedArticle: null,
					loading: { isLoading: false, error: apiError }
				}));
				throw apiError;
			}
		},

		async searchArticles(query: string) {
			update((state) => ({
				...state,
				loading: { isLoading: true, error: null }
			}));

			try {
				const articles = await articleService.searchArticles(query);
				update((state) => ({
					...state,
					articles,
					loading: { isLoading: false, error: null }
				}));
			} catch (error) {
				const apiError = error as ApiError;
				update((state) => ({
					...state,
					loading: { isLoading: false, error: apiError }
				}));
			}
		},

		async fetchArticlesByCategory(category: string) {
			update((state) => ({
				...state,
				loading: { isLoading: true, error: null }
			}));

			try {
				const articles = await articleService.fetchArticlesByCategory(category);
				update((state) => ({
					...state,
					articles,
					loading: { isLoading: false, error: null }
				}));
			} catch (error) {
				const apiError = error as ApiError;
				update((state) => ({
					...state,
					loading: { isLoading: false, error: apiError }
				}));
			}
		},

		clearSelectedArticle() {
			update((state) => ({
				...state,
				selectedArticle: null
			}));
		},

		clearError() {
			update((state) => ({
				...state,
				loading: { ...state.loading, error: null }
			}));
		},

		reset() {
			set(initialState);
		}
	};
}

export const articleStore = createArticleStore();

// Derived stores for easier access
export const articles: Readable<Article[]> = derived(
	articleStore,
	($articleStore) => $articleStore.articles
);

export const selectedArticle: Readable<Article | null> = derived(
	articleStore,
	($articleStore) => $articleStore.selectedArticle
);

export const loading: Readable<LoadingState> = derived(
	articleStore,
	($articleStore) => $articleStore.loading
);

export const isLoading: Readable<boolean> = derived(loading, ($loading) => $loading.isLoading);

export const error: Readable<ApiError | null> = derived(loading, ($loading) => $loading.error);
