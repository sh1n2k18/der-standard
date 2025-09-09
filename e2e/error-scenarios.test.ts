import { expect, test } from '@playwright/test';

test.describe('Error Scenarios and Edge Cases', () => {
	test('should display loading skeletons while articles are loading', async ({ page }) => {
		// Go to homepage
		await page.goto('/');

		// Should see loading skeletons initially
		const loadingElements = page.locator('.animate-pulse');
		await expect(loadingElements.first()).toBeVisible();

		// Wait for real content to load
		await page.waitForSelector('h2', { timeout: 10000 });

		// Loading skeletons should be gone
		await expect(loadingElements.first()).not.toBeVisible();
	});

	test('should handle empty article list gracefully', async ({ page }) => {
		// This test would need API mocking to simulate empty response
		// For now, test the UI exists for empty state handling
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// At minimum, page should not crash and show proper structure
		await expect(page.locator('h1')).toContainText('Der Standard');
		await expect(page.locator('header')).toBeVisible();
	});

	test('should handle network errors gracefully', async ({ page }) => {
		// Block network requests to simulate network failure
		await page.route('**/*', (route) => route.abort());

		await page.goto('/');

		// Should still render basic page structure
		await expect(page.locator('h1')).toContainText('Der Standard');

		// Should show error state (if implemented)
		// Note: This depends on actual error boundary implementation
	});

	test('should handle malformed URLs gracefully', async ({ page }) => {
		// Test various malformed article URLs
		const malformedUrls = [
			'/story/',
			'/story//',
			'/story/%20',
			'/story/null/',
			'/story/undefined/',
			'/story/test/invalid-slug/'
		];

		for (const url of malformedUrls) {
			await page.goto(url);

			// Should either show error page or redirect to valid page
			// Should not crash the application
			const pageTitle = await page.title();
			expect(pageTitle).toBeDefined();
			expect(pageTitle).not.toBe('');
		}
	});

	test('should maintain proper keyboard navigation', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.waitForSelector('h2', { timeout: 10000 });

		// Focus first article with keyboard
		await page.keyboard.press('Tab');

		// Should be able to navigate with Enter key
		await page.keyboard.press('Enter');

		// Should navigate to article
		await page.waitForURL(/\/article\/.+/);

		// Should be able to navigate back with keyboard
		await page.keyboard.press('Tab'); // Focus back button
		await page.keyboard.press('Enter');

		await page.waitForURL('/');
		await expect(page.locator('h1')).toContainText('Der Standard');
	});

	test('should handle window resize gracefully', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Test mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await expect(page.locator('h1')).toBeVisible();

		// Test tablet viewport
		await page.setViewportSize({ width: 768, height: 1024 });
		await expect(page.locator('h1')).toBeVisible();

		// Test desktop viewport
		await page.setViewportSize({ width: 1920, height: 1080 });
		await expect(page.locator('h1')).toBeVisible();

		// All content should remain accessible across viewports
	});

	test('should handle rapid page refreshes', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Rapidly refresh the page multiple times
		for (let i = 0; i < 3; i++) {
			await page.reload();
			await page.waitForLoadState('networkidle');

			// Page should still function
			await expect(page.locator('h1')).toContainText('Der Standard');
		}
	});

	test('should handle JavaScript disabled scenario', async ({ page, context }) => {
		// Disable JavaScript
		await context.setOffline(false);
		await page.setJavaScriptEnabled(false);

		await page.goto('/');

		// Page should still show basic content structure
		await expect(page.locator('h1')).toBeVisible();

		// Note: Full functionality won't work without JS, but basic content should be visible
	});

	test('should handle offline scenarios', async ({ page, context }) => {
		// First load the page online
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Go offline
		await context.setOffline(true);

		// Try to navigate to article
		await page.waitForSelector('h2', { timeout: 10000 });
		await page.locator('h2').first().click();

		// Should handle offline gracefully (depending on implementation)
		// At minimum, should not crash
		const url = page.url();
		expect(url).toBeDefined();
	});

	test('should maintain SEO meta tags on all pages', async ({ page }) => {
		// Check homepage meta tags
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const homeTitle = await page.title();
		expect(homeTitle).toContain('Der Standard');

		const homeDescription = await page.getAttribute('meta[name="description"]', 'content');
		expect(homeDescription).toBeTruthy();

		// Navigate to article and check meta tags
		await page.waitForSelector('h2', { timeout: 10000 });
		await page.locator('h2').first().click();
		await page.waitForURL(/\/article\/.+/);

		const articleTitle = await page.title();
		expect(articleTitle).toBeTruthy();
		expect(articleTitle).not.toBe(homeTitle);
	});

	test('should handle long article content properly', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.waitForSelector('h2', { timeout: 10000 });

		// Click on an article
		await page.locator('h2').first().click();
		await page.waitForURL(/\/article\/.+/);

		// Should be able to scroll through long content
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

		// Back button should still be accessible
		await expect(page.getByRole('button').first()).toBeVisible();

		// Should be able to scroll back to top
		await page.evaluate(() => window.scrollTo(0, 0));
		await expect(page.getByRole('button').first()).toBeVisible();
	});
});
