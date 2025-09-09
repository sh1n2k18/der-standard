export interface Article {
	id: string;
	headline: string;
	author: string;
	text: string;
	publicationDate: string;
	categories: string[];
	headerImageUrl: string;
}

export interface ArticleApiResponse {
	data: Article[];
	status: 'success' | 'error';
	message?: string;
}

export interface ApiError {
	status: number;
	message: string;
	code?: string;
}

export interface LoadingState {
	isLoading: boolean;
	error: ApiError | null;
}

export interface ArticleStore {
	articles: Article[];
	selectedArticle: Article | null;
	loading: LoadingState;
}

export type ArticleId = string;
