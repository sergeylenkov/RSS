export function debounce(func: any, wait: number, immediate: boolean) {
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

export function throttled(func: any, delay: number) {
	let lastCall = 0;

	return function(...args: any[]) {
		const now = (new Date()).getTime();
			if (now - lastCall < delay) {
			return;
		}

		lastCall = now;
		return func(...args);
	}
}