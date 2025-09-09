import { goto } from '$app/navigation';

/**
 * Navigation utility functions
 */
export const navigation = {
	/**
	 * Navigate back to home page
	 */
	goHome() {
		goto('/');
	},

	/**
	 * Navigate to article with SEO-friendly URL
	 * @param id - Article ID
	 * @param headline - Article headline for slug generation
	 */
	async goToArticle(id: string, headline: string) {
		const { createArticleUrl } = await import('$lib/utils/slug.js');
		const url = createArticleUrl(id, headline);
		goto(url);
	}
};
