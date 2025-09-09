<script lang="ts">
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { goto } from '$app/navigation';
	import type { Article } from '$lib/types/index.js';
	import { formatDate } from '$lib/utils/date.js';
	import { createArticleUrl } from '$lib/utils/slug.js';
	import { handleImageError } from '$lib/utils/image.js';

	interface Props {
		article: Article;
		onclick?: () => void;
	}

	let { article, onclick }: Props = $props();

	function handleClick() {
		if (onclick) {
			onclick();
		} else {
			// Navigate to SEO-friendly URL
			const url = createArticleUrl(article.id, article.headline);
			goto(url);
		}
	}
</script>

<Card
	class="cursor-pointer transition-shadow duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
	onclick={handleClick}
	role="article"
	tabindex={0}
	aria-label={`Artikel: ${article.headline} von ${article.author}`}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleClick();
		}
	}}
>
	<CardHeader class="p-0">
		<div class="aspect-[2/1] overflow-hidden rounded-t-lg">
			<img
				src={article.headerImageUrl}
				alt={`Titelbild für Artikel: ${article.headline}`}
				class="h-full w-full object-cover"
				loading="lazy"
				onerror={handleImageError}
			/>
		</div>
	</CardHeader>
	<CardContent class="p-4">
		<h2 class="mb-2 font-title text-lg leading-tight font-bold text-gray-900">
			{article.headline}
		</h2>
		<div class="mb-3 flex items-center gap-2 text-sm text-gray-600">
			<span class="font-medium" aria-label={`Autor: ${article.author}`}>{article.author}</span>
			<span class="text-gray-400" aria-hidden="true">•</span>
			<time
				datetime={article.publicationDate}
				aria-label={`Veröffentlicht am ${formatDate(article.publicationDate)}`}
			>
				{formatDate(article.publicationDate)}
			</time>
		</div>
		<div class="flex flex-wrap gap-1" role="list" aria-label="Kategorien">
			{#each article.categories as category (category)}
				<Badge variant="secondary" class="text-xs" role="listitem">
					{category}
				</Badge>
			{/each}
		</div>
	</CardContent>
</Card>
