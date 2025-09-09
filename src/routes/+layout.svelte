<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.ico';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import OfflineDetector from '$lib/components/OfflineDetector.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="theme-color" content="#3b82f6" />
	<meta name="color-scheme" content="light" />
	<title>Der Standard - News App</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Skip to content link for accessibility -->
	<a
		href="#main-content"
		class="sr-only absolute top-0 left-0 z-50 bg-blue-600 px-4 py-2 text-white focus:not-sr-only focus:block"
	>
		Zum Hauptinhalt springen
	</a>

	<main id="main-content" class="mx-auto max-w-lg pb-20">
		{@render children?.()}
	</main>

	<BottomNav />
	<OfflineDetector />
</div>
