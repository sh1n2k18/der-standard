<script lang="ts">
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card/index.js';
</script>

<Card class="animate-pulse overflow-hidden" aria-label="Artikel lädt...">
	<CardHeader class="p-0">
		<div
			class="aspect-[2/1] rounded-t-lg bg-gray-300 will-change-transform"
			aria-hidden="true"
		></div>
	</CardHeader>
	<CardContent class="p-4">
		<div class="space-y-3" aria-hidden="true">
			<!-- Title lines -->
			<div class="h-4 w-3/4 rounded bg-gray-300"></div>
			<div class="h-4 w-1/2 rounded bg-gray-300"></div>
			<!-- Category badges -->
			<div class="mt-3 flex gap-2">
				<div class="h-6 w-16 rounded bg-gray-300"></div>
				<div class="h-6 w-20 rounded bg-gray-300"></div>
			</div>
		</div>
		<!-- Screen reader text -->
		<span class="sr-only">Artikel wird geladen...</span>
	</CardContent>
</Card>
