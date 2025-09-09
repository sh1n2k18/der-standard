export interface NavigationItem {
	id: string;
	label: string;
	icon: string;
	href?: string;
	active?: boolean;
}

export interface RouteParams {
	id?: string;
}

export interface PageData {
	article?: Article | null;
	articles?: Article[];
	error?: ApiError | null;
}

import type { Article, ApiError } from './article.js';
