import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { formatDate, formatFullDate } from './date.js';

describe('Date Utils', () => {
	beforeEach(() => {
		// Mock current date to 2024-01-20 12:00:00
		vi.setSystemTime(new Date('2024-01-20T12:00:00Z'));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('formatDate', () => {
		it('should format recent time in minutes', () => {
			// 30 minutes ago
			const date = '2024-01-20T11:30:00Z';
			const result = formatDate(date);

			expect(result).toBe('vor 30 Min');
		});

		it('should format time within hours', () => {
			// 3 hours ago
			const date = '2024-01-20T09:00:00Z';
			const result = formatDate(date);

			expect(result).toBe('vor 3 Std');
		});

		it('should format time within days', () => {
			// 2 days ago
			const date = '2024-01-18T12:00:00Z';
			const result = formatDate(date);

			expect(result).toBe('vor 2 Tagen');
		});

		it('should format single day correctly', () => {
			// 1 day ago
			const date = '2024-01-19T12:00:00Z';
			const result = formatDate(date);

			expect(result).toBe('vor 1 Tag');
		});

		it('should format older dates as full date', () => {
			// 10 days ago
			const date = '2024-01-10T12:00:00Z';
			const result = formatDate(date);

			expect(result).toBe('10.01.2024');
		});

		it('should handle invalid date strings', () => {
			const result = formatDate('invalid-date');

			expect(result).toBe('Invalid Date'); // Browser returns this for invalid dates
		});

		it('should handle very recent time (less than 1 minute)', () => {
			// 30 seconds ago
			const date = '2024-01-20T11:59:30Z';
			const result = formatDate(date);

			expect(result).toBe('vor 0 Min');
		});

		it('should handle future dates', () => {
			// 1 hour in the future
			const date = '2024-01-20T13:00:00Z';
			const result = formatDate(date);

			// Should show as negative minutes (future dates)
			expect(result).toMatch(/vor -?\d+ Min/);
		});
	});

	describe('formatFullDate', () => {
		it('should format date with full details', () => {
			const date = '2024-01-15T14:30:00Z';
			const result = formatFullDate(date);

			// Should include weekday, date, and time in Austrian German locale
			// Note: Austrian German uses "Jänner" instead of "Januar"
			expect(result).toMatch(/Montag.*15.*Jänner.*2024/);
		});

		it('should use Austrian locale format', () => {
			const date = '2024-12-25T18:45:00Z';
			const result = formatFullDate(date);

			// Should be in Austrian German format
			expect(result).toMatch(/Mittwoch.*25.*Dezember.*2024/);
		});

		it('should handle invalid date strings', () => {
			const result = formatFullDate('invalid-date');

			expect(result).toBe('Invalid Date'); // Browser returns this for invalid dates
		});

		it('should format different times correctly', () => {
			const morning = '2024-01-15T09:15:00Z';
			const evening = '2024-01-15T21:45:00Z';

			const morningResult = formatFullDate(morning);
			const eveningResult = formatFullDate(evening);

			// Times may be adjusted for timezone
			expect(morningResult).toMatch(/\d{2}:\d{2}/);
			expect(eveningResult).toMatch(/\d{2}:\d{2}/);
		});

		it('should handle different months', () => {
			const january = '2024-01-15T12:00:00Z';
			const december = '2024-12-15T12:00:00Z';

			const januaryResult = formatFullDate(january);
			const decemberResult = formatFullDate(december);

			// Austrian German uses "Jänner" for January
			expect(januaryResult).toMatch(/Jänner/);
			expect(decemberResult).toMatch(/Dezember/);
		});
	});
});
