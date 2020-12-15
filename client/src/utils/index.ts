export function debounce(func: any, wait: number, immediate: boolean) {
	let timeout: number | null;

	return function() {
		const context = this;
		const args = arguments;

		const later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};

		const callNow = immediate && !timeout;

		timeout && clearTimeout(timeout);

		timeout = setTimeout(later, wait);

		if (callNow) func.apply(context, args);
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