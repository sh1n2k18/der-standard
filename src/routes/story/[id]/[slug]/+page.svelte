<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { ArrowLeft, Calendar, User, AlertCircle, RefreshCw } from 'lucide-svelte';
	import { articleStore } from '$lib/stores/article-store.js';
	import { formatFullDate } from '$lib/utils/date.js';
	import type { Article } from '$lib/types/index.js';
	import DerStandardLogo from '$lib/assets/DER_STANDARD.svg';
	import { handleImageError } from '$lib/utils/image.js';

	let articleId = $derived($page.params.id);
	let slug = $derived($page.params.slug);
	let article: Article | null = $state(null);
	let loading = $state(false);
	let loadError: string | null = $state(null);

	// Derived computed values
	let currentUrl = $derived(
		article && articleId && slug ? `${$page.url.origin}/story/${articleId}/${slug}` : ''
	);
	let metaDescription = $derived.by(() => {
		if (!article?.text) return '';
		return article.text.substring(0, 160) + '...';
	});

	onMount(async () => {
		if (articleId) {
			await loadArticle(articleId);
		}
	});

	async function loadArticle(id: string) {
		loading = true;
		loadError = null;

		try {
			article = await articleStore.fetchArticleById(id);

			// Verify slug matches (optional - for proper SEO)
			if (article && slug) {
				const { createSlug } = await import('$lib/utils/slug.js');
				const expectedSlug = createSlug(article.headline);
				if (slug !== expectedSlug) {
					// Redirect to correct URL
					goto(`/story/${id}/${expectedSlug}`, { replaceState: true });
				}
			}
		} catch (err: unknown) {
			const error = err as { status?: number; message?: string };
			if (error.status === 404) {
				loadError = 'Artikel wurde nicht gefunden';
			} else {
				loadError = error.message || 'Fehler beim Laden des Artikels';
			}
		} finally {
			loading = false;
		}
	}

	function goBack() {
		goto('/');
	}
</script>

<svelte:head>
	{#if article}
		<title>{article.headline} - Der Standard</title>
		<meta name="description" content={metaDescription} />
		<meta property="og:title" content={article.headline} />
		<meta property="og:description" content={metaDescription} />
		<meta property="og:image" content={article.headerImageUrl} />
		<meta property="og:url" content={currentUrl} />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:title" content={article.headline} />
		<meta name="twitter:description" content={metaDescription} />
		<meta name="twitter:image" content={article.headerImageUrl} />
		<link rel="canonical" href={currentUrl} />
	{:else}
		<title>Artikel laden... - Der Standard</title>
	{/if}
</svelte:head>

<div class="min-h-screen">
	<!-- Fixed Header -->
	<header class="sticky top-0 z-10 border-b border-gray-200 bg-white">
		<div class="flex items-center justify-between p-4">
			<div class="flex items-center">
				<Button variant="ghost" size="sm" onclick={goBack} class="mr-3">
					<ArrowLeft size={20} />
				</Button>
			</div>
			<img src={DerStandardLogo} alt="DER STANDARD" class="h-6 w-auto" />
			<div class="w-12"></div>
			<!-- Spacer for centering -->
		</div>
	</header>

	<main class="p-4">
		{#if loading}
			<!-- Loading Skeleton -->
			<div class="animate-pulse space-y-4">
				<div class="aspect-[2/1] rounded-lg bg-gray-300"></div>
				<div class="space-y-3">
					<div class="h-8 w-3/4 rounded bg-gray-300"></div>
					<div class="h-6 w-1/2 rounded bg-gray-300"></div>
					<div class="space-y-2">
						<div class="h-4 rounded bg-gray-300"></div>
						<div class="h-4 rounded bg-gray-300"></div>
						<div class="h-4 w-5/6 rounded bg-gray-300"></div>
					</div>
				</div>
			</div>
		{:else if loadError}
			<!-- Error State -->
			<div class="py-12 text-center">
				<AlertCircle size={48} class="mx-auto mb-4 text-red-500" />
				<h2 class="mb-2 font-title text-xl font-bold text-gray-900">Artikel nicht gefunden</h2>
				<p class="mb-4 text-gray-600">{loadError}</p>
				<div class="space-y-2">
					<Button onclick={() => articleId && loadArticle(articleId)} class="mr-2">
						<RefreshCw size={16} class="mr-2" />
						Erneut versuchen
					</Button>
					<Button variant="outline" onclick={goBack}>Zurück zur Übersicht</Button>
				</div>
			</div>
		{:else if article}
			<!-- Article Content -->
			<article class="mx-auto max-w-4xl">
				<!-- Header Image -->
				<div class="mb-6 aspect-[2/1] overflow-hidden rounded-lg">
					<img
						src={article.headerImageUrl}
						alt={article.headline}
						class="h-full w-full object-cover"
						onerror={handleImageError}
					/>
				</div>

				<!-- Article Header -->
				<header class="mb-6">
					<h1 class="mb-4 font-title text-2xl leading-tight font-bold text-gray-900 md:text-3xl">
						{article.headline}
					</h1>

					<div class="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
						<div class="flex items-center gap-1">
							<User size={16} />
							<span class="font-medium">{article.author}</span>
						</div>
						<div class="flex items-center gap-1">
							<Calendar size={16} />
							<span>{formatFullDate(article.publicationDate)}</span>
						</div>
					</div>

					<div class="flex flex-wrap gap-2">
						{#each article.categories as category (category)}
							<Badge variant="secondary">
								{category}
							</Badge>
						{/each}
					</div>
				</header>

				<!-- Article Content -->
				<div class="prose prose-lg max-w-none">
					<div class="leading-relaxed whitespace-pre-line text-gray-800">
						{article.text}
					</div>
				</div>
			</article>
		{:else}
			<!-- Empty State -->
			<div class="py-12 text-center">
				<p class="mb-4 text-gray-600">Artikel konnte nicht geladen werden</p>
				<Button variant="outline" onclick={goBack}>Zurück zur Übersicht</Button>
			</div>
		{/if}
	</main>
</div>
