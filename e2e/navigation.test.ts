import { expect, test } from '@playwright/test';

test.describe('Navigation Integration Tests', () => {
	test.beforeEach(async ({ page }) => {
		// Start at the home page
		await page.goto('/');
	});

	test('should navigate from article list to article detail and back', async ({ page }) => {
		// Wait for articles to load
		await page.waitForLoadState('networkidle');

		// Should be on homepage
		await expect(page.locator('h1')).toContainText('Der Standard');

		// Wait for articles to appear (skip loading state)
		await page.waitForSelector('h2', { timeout: 10000 }); // Wait for article headlines

		// Click on first article
		const firstArticle = page.locator('h2').first();
		const articleTitle = await firstArticle.textContent();
		await firstArticle.click();

		// Should navigate to article detail page
		await page.waitForURL(/\/article\/.+/);
		await expect(page.url()).toMatch(/\/article\/.+/);

		// Should show the article title
		await expect(page.locator('h1')).toContainText(articleTitle || '');

		// Should have back button
		const backButton = page.getByRole('button').first();
		await expect(backButton).toBeVisible();

		// Click back button
		await backButton.click();

		// Should return to homepage
		await page.waitForURL('/');
		await expect(page.locator('h1')).toContainText('Der Standard');
	});

	test('should handle browser back/forward navigation', async ({ page }) => {
		// Wait for articles to load
		await page.waitForLoadState('networkidle');
		await page.waitForSelector('h2', { timeout: 10000 });

		// Click on first article
		await page.locator('h2').first().click();
		await page.waitForURL(/\/article\/.+/);

		// Use browser back button
		await page.goBack();
		await expect(page.url()).toBe(page.url().split('/article')[0] + '/');

		// Use browser forward button
		await page.goForward();
		await expect(page.url()).toMatch(/\/article\/.+/);
	});

	test('should handle direct URL navigation to article', async ({ page }) => {
		// First get an article ID by loading the homepage
		await page.waitForLoadState('networkidle');
		await page.waitForSelector('h2', { timeout: 10000 });

		// Click first article to get URL
		await page.locator('h2').first().click();
		await page.waitForURL(/\/article\/.+/);

		const articleUrl = page.url();

		// Navigate directly to article URL
		await page.goto(articleUrl);

		// Should load article detail page directly
		await expect(page.locator('h1')).not.toContainText('Der Standard');
		await expect(page.getByRole('button').first()).toBeVisible(); // Back button
	});

	test('should handle non-existent article IDs gracefully', async ({ page }) => {
		// Navigate to non-existent article URL (should result in 404)
		await page.goto('/story/non-existent-id/test-slug');

		// Should show error message
		await expect(page.locator('text=Artikel nicht gefunden')).toBeVisible();

		// Should have back to overview button
		await expect(page.locator('text=Zurück zur Übersicht')).toBeVisible();

		// Click back to overview
		await page.getByText('Zurück zur Übersicht').click();
		await page.waitForURL('/');
		await expect(page.locator('h1')).toContainText('Der Standard');
	});

	test('should preserve scroll position when navigating back', async ({ page }) => {
		// Wait for articles and scroll down
		await page.waitForLoadState('networkidle');
		await page.waitForSelector('h2', { timeout: 10000 });

		// Scroll down to see more articles
		await page.evaluate(() => window.scrollTo(0, 500));

		// Click on an article after scrolling
		const articleInMiddle = page.locator('h2').nth(2);
		await articleInMiddle.click();
		await page.waitForURL(/\/article\/.+/);

		// Go back
		await page.getByRole('button').first().click();
		await page.waitForURL('/');

		// Check that we're still scrolled (approximately)
		const scrollY = await page.evaluate(() => window.scrollY);
		expect(scrollY).toBeGreaterThan(200); // Should maintain some scroll position
	});

	test('should handle rapid navigation clicks gracefully', async ({ page }) => {
		await page.waitForLoadState('networkidle');
		await page.waitForSelector('h2', { timeout: 10000 });

		// Rapidly click multiple articles (tests race conditions)
		const articles = page.locator('h2').first();
		await articles.click();
		await articles.click(); // Double click

		// Should still navigate to article page
		await page.waitForURL(/\/article\/.+/);
		await expect(page.getByRole('button').first()).toBeVisible();

		// Navigate back and try rapid back clicks
		await page.getByRole('button').first().click();
		await page.getByRole('button').first().click();

		// Should end up back at homepage
		await page.waitForURL('/');
		await expect(page.locator('h1')).toContainText('Der Standard');
	});
});
