<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Home, Search, BookmarkIcon, User } from 'lucide-svelte';
	import type { NavigationItem } from '$lib/types/index.js';

	const navItems: NavigationItem[] = [
		{ id: 'home', label: 'Home', icon: 'Home', href: '/' },
		{ id: 'search', label: 'Suche', icon: 'Search', href: '/search' },
		{ id: 'bookmarks', label: 'Bookmarks', icon: 'BookmarkIcon', href: '/bookmarks' },
		{ id: 'profile', label: 'Profil', icon: 'User', href: '/profile' }
	];

	const iconComponents = {
		Home,
		Search,
		BookmarkIcon,
		User
	};

	function getIconComponent(iconName: string) {
		return iconComponents[iconName as keyof typeof iconComponents] || Home;
	}
</script>

<nav
	class="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white"
	aria-label="Hauptnavigation"
>
	<div class="mx-auto flex max-w-lg items-center justify-around px-4 py-2">
		{#each navItems as item (item.id)}
			<Button
				variant="ghost"
				size="sm"
				class="flex min-h-[60px] flex-col items-center gap-1 text-gray-600 hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
				aria-label={`${item.label} - Navigation`}
				aria-describedby={`nav-desc-${item.id}`}
			>
				<svelte:component this={getIconComponent(item.icon)} size={20} aria-hidden="true" />
				<span class="text-xs font-medium" id={`nav-desc-${item.id}`}>{item.label}</span>
			</Button>
		{/each}
	</div>
</nav>
