export type Article = {
	id: string;
	headline: string;
	author: string;
	text: string;
	publicationDate: string;
	categories: string[];
	headerImageUrl: string;
};

export type ArticleApiResponse = {
	data: Article[];
	status: 'success' | 'error';
	message?: string;
};

export type ApiError = {
	status: number;
	message: string;
	code?: string;
};

export type LoadingState = {
	isLoading: boolean;
	error: ApiError | null;
};

export type ArticleStore = {
	articles: Article[];
	selectedArticle: Article | null;
	loading: LoadingState;
};

export type ArticleId = string;
