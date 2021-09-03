export function debounce(func: (...args: any[]) => void, wait: number, immediate: boolean): () => void {
	let timeout: number | null;

	return (...args: any[]) => {
		const later = function() {
			timeout = null;
			if (!immediate) func.apply(this, args);
		};

		const callNow = immediate && !timeout;

		timeout && clearTimeout(timeout);

		timeout = window.setTimeout(later, wait);

		if (callNow) func.apply(this, args);
	};
}

export function isSystemDarkTheme(): boolean {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}
