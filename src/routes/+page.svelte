<script lang="ts">
	import { onMount } from 'svelte';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import ArticleCardSkeleton from '$lib/components/ArticleCardSkeleton.svelte';
	import { articleStore, articles, isLoading, error } from '$lib/stores/article-store.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { RefreshCw, AlertCircle } from 'lucide-svelte';
	import DerStandardLogo from '$lib/assets/DER_STANDARD.svg';

	onMount(async () => {
		await articleStore.fetchArticles();
	});

	async function refreshArticles() {
		await articleStore.fetchArticles();
	}
</script>

<svelte:head>
	<title>Der Standard - Aktuelle Nachrichten</title>
	<meta
		name="description"
		content="Aktuelle Nachrichten, Analysen und Meinungen aus Österreich und der Welt"
	/>
</svelte:head>

<div class="p-4">
	<header class="mb-6">
		<div class="mb-4 flex items-center">
			<img src={DerStandardLogo} alt="DER STANDARD" class="h-8 w-auto" />
		</div>
		<p class="text-gray-600">Aktuelle Nachrichten aus Österreich und der Welt</p>
	</header>

	{#if $error}
		<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
			<div class="mb-2 flex items-center gap-2 text-red-800">
				<AlertCircle size={20} />
				<h3 class="font-semibold">Fehler beim Laden</h3>
			</div>
			<p class="mb-3 text-red-700">{$error.message}</p>
			<Button variant="outline" size="sm" onclick={refreshArticles}>
				<RefreshCw size={16} class="mr-2" />
				Erneut versuchen
			</Button>
		</div>
	{/if}

	<div class="space-y-4">
		{#if $isLoading}
			{#each Array(6) as _, i (i)}
				<ArticleCardSkeleton />
			{/each}
		{:else if $articles.length > 0}
			{#each $articles as article (article.id)}
				<ArticleCard {article} />
			{/each}
		{:else}
			<div class="py-12 text-center">
				<p class="mb-4 text-gray-500">Keine Artikel gefunden</p>
				<Button variant="outline" onclick={refreshArticles}>
					<RefreshCw size={16} class="mr-2" />
					Aktualisieren
				</Button>
			</div>
		{/if}
	</div>
</div>
