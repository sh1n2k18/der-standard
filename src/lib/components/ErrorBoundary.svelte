<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert/index.js';
	import { AlertTriangle, RefreshCw } from 'lucide-svelte';

	interface Props {
		children: import('svelte').Snippet;
		fallback?: import('svelte').Snippet<
			[{ error: Error | null; reset: () => void; reload: () => void }]
		>;
		onError?: (error: Error) => void;
	}

	let { children, fallback, onError }: Props = $props();
	let hasError = $state(false);
	let error: Error | null = $state(null);

	function handleError(evt: ErrorEvent) {
		hasError = true;
		error = new Error(evt.message);
		onError?.(error);
		console.error('Error caught by boundary:', error);
	}

	function handleUnhandledRejection(evt: PromiseRejectionEvent) {
		hasError = true;
		error = new Error(evt.reason?.message || 'Unhandled promise rejection');
		onError?.(error);
		console.error('Promise rejection caught by boundary:', error);
	}

	function reset() {
		hasError = false;
		error = null;
	}

	function reload() {
		window.location.reload();
	}

	// Listen for global errors
	if (typeof window !== 'undefined') {
		window.addEventListener('error', handleError);
		window.addEventListener('unhandledrejection', handleUnhandledRejection);
	}

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('error', handleError);
			window.removeEventListener('unhandledrejection', handleUnhandledRejection);
		}
	});
</script>

{#if hasError}
	{#if fallback}
		{@render fallback({ error, reset, reload })}
	{:else}
		<div class="p-4">
			<Alert variant="destructive">
				<AlertTriangle class="h-4 w-4" />
				<AlertTitle>Ein Fehler ist aufgetreten</AlertTitle>
				<AlertDescription class="mt-2">
					<p class="mb-3">
						{error?.message ||
							'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'}
					</p>
					<div class="flex gap-2">
						<Button size="sm" onclick={reset}>
							<RefreshCw size={16} class="mr-2" />
							Erneut versuchen
						</Button>
						<Button variant="outline" size="sm" onclick={reload}>Seite neu laden</Button>
					</div>
				</AlertDescription>
			</Alert>
		</div>
	{/if}
{:else}
	{@render children()}
{/if}
