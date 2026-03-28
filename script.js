async function loadPartials() {
	const includeNodes = Array.from(document.querySelectorAll('[data-include]'));

	await Promise.all(
		includeNodes.map(async (node) => {
			const includePath = node.getAttribute('data-include');
			if (!includePath) {
				return;
			}

			try {
				const response = await fetch(includePath, { cache: 'no-cache' });
				if (!response.ok) {
					throw new Error(`Failed to load ${includePath}: ${response.status}`);
				}

				const html = await response.text();
				node.outerHTML = html;
			} catch (error) {
				console.error(error);
			}
		})
	);
}

async function bootstrap() {
	await loadPartials();
	const { initApp } = await import('./js/main.js');
	initApp();
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
	bootstrap();
}
