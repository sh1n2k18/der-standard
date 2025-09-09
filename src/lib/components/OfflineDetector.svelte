<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Alert, AlertDescription } from '$lib/components/ui/alert/index.js';
	import { WifiOff, Wifi } from 'lucide-svelte';

	let isOnline = $state(true);
	let showOfflineMessage = $state(false);

	function updateOnlineStatus() {
		const online = navigator.onLine;

		if (!online && isOnline) {
			// Just went offline
			showOfflineMessage = true;
		} else if (online && !isOnline) {
			// Just came back online
			showOfflineMessage = false;
		}

		isOnline = online;
	}

	onMount(() => {
		isOnline = navigator.onLine;

		window.addEventListener('online', updateOnlineStatus);
		window.addEventListener('offline', updateOnlineStatus);
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('online', updateOnlineStatus);
			window.removeEventListener('offline', updateOnlineStatus);
		}
	});
</script>

{#if showOfflineMessage}
	<div class="fixed top-4 right-4 left-4 z-50">
		{#if !isOnline}
			<Alert variant="destructive" class="border-red-200 bg-red-50">
				<WifiOff class="h-4 w-4" />
				<AlertDescription>
					Sie sind offline. Einige Funktionen sind möglicherweise nicht verfügbar.
				</AlertDescription>
			</Alert>
		{:else}
			<Alert class="border-green-200 bg-green-50">
				<Wifi class="h-4 w-4 text-green-600" />
				<AlertDescription class="text-green-800">Verbindung wiederhergestellt!</AlertDescription>
			</Alert>
		{/if}
	</div>
{/if}
