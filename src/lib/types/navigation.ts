import type { Article, ApiError } from './article.js';

export type NavigationItem = {
	id: string;
	label: string;
	icon: string;
	href?: string;
	active?: boolean;
};

export type RouteParams = {
	id?: string;
};

export type PageData = {
	article?: Article | null;
	articles?: Article[];
	error?: ApiError | null;
};
