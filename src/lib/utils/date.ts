export function formatDate(dateString: string): string {
	try {
		const date = new Date(dateString);

		// Check if date is valid
		if (isNaN(date.getTime())) {
			return 'Invalid Date';
		}

		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffDays = Math.floor(diffHours / 24);

		if (diffHours < 1) {
			const diffMinutes = Math.floor(diffMs / (1000 * 60));
			return `vor ${diffMinutes} Min`;
		} else if (diffHours < 24) {
			return `vor ${diffHours} Std`;
		} else if (diffDays < 7) {
			return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;
		} else {
			return date.toLocaleDateString('de-AT', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric'
			});
		}
	} catch {
		return 'Invalid Date';
	}
}

export function formatFullDate(dateString: string): string {
	try {
		const date = new Date(dateString);

		// Check if date is valid
		if (isNaN(date.getTime())) {
			return 'Invalid Date';
		}

		return date.toLocaleString('de-AT', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	} catch {
		return 'Invalid Date';
	}
}
