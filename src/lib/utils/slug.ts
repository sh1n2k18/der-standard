/**
 * Creates a SEO-friendly URL slug from a headline
 * Follows German URL conventions like Der Standard uses
 */
export function createSlug(text: string): string {
	return (
		text
			.toLowerCase()
			// Replace German umlauts
			.replace(/[äöüß]/g, (match) => {
				const map: Record<string, string> = {
					ä: 'ae',
					ö: 'oe',
					ü: 'ue',
					ß: 'ss'
				};
				return map[match] || match;
			})
			// Replace special characters and quotes
			.replace(/["""''„"]/g, '')
			.replace(/[:]/g, '-')
			.replace(/[&]/g, 'und')
			.replace(/[%]/g, 'prozent')
			.replace(/[€]/g, 'euro')
			.replace(/[.,!?;]/g, '')
			// Remove all non-alphanumeric characters except spaces and dashes
			.replace(/[^a-z0-9\s-]/g, '')
			.trim()
			// Replace multiple spaces with single dash
			.replace(/\s+/g, '-')
			// Replace multiple dashes with single dash
			.replace(/-+/g, '-')
			// Remove leading/trailing dashes
			.replace(/^-+|-+$/g, '')
			// Limit length to reasonable URL length
			.substring(0, 100)
			.replace(/-+$/g, '')
	); // Remove trailing dash if substring cut off
}

/**
 * Generates a complete SEO-friendly URL for an article
 */
export function createArticleUrl(id: string, headline: string): string {
	const slug = createSlug(headline);
	return `/story/${id}/${slug}`;
}

/**
 * Extracts article ID from a Der Standard-style story URL
 */
export function extractArticleId(url: string): string | null {
	const match = url.match(/\/story\/([^/]+)/);
	return match ? match[1] : null;
}
