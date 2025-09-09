/**
 * Fallback placeholder image for broken/missing images
 * Uses a base64 encoded SVG with German text
 */
export const IMAGE_FALLBACK =
	'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlmYTJhNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJpbGQgbmljaHQgdmVyZsO8Z2JhcjwvdGV4dD48L3N2Zz4=';

/**
 * Standard image error handler that sets fallback image
 * @param event - Image error event
 */
export function handleImageError(event: Event) {
	const img = event.target as HTMLImageElement;

	// Only set fallback if not already set to prevent infinite loops
	if (img.src !== IMAGE_FALLBACK) {
		img.src = IMAGE_FALLBACK;
	}
}

/**
 * Optimized image loading with lazy loading and error handling
 * @param src - Image source URL
 * @param alt - Alt text
 * @param className - CSS classes
 * @returns Image element with optimized attributes
 */
export function createOptimizedImage(src: string, alt: string, className: string = '') {
	const img = document.createElement('img');
	img.src = src;
	img.alt = alt;
	img.className = className;
	img.loading = 'lazy';
	img.decoding = 'async';
	img.addEventListener('error', handleImageError);
	return img;
}
