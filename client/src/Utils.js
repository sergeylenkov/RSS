export function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

export function throttled(func, delay) {
	let lastCall = 0;
	return function (...args) {
	  	const now = (new Date()).getTime();
	  	if (now - lastCall < delay) {
			return;
		}
		  
	  	lastCall = now;
	  	return func(...args);
	}
}