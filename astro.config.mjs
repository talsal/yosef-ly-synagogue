// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://talsal.github.io',
	base: '/yosef-ly-synagogue',
	trailingSlash: 'never',
	vite: {
		build: {
			// מיניפיקציית ה-CSS של esbuild כותבת מדיה קווריז בתחביר range syntax
			// מודרני (width >= 62rem) שגרסאות Safari מסוימות לא תומכות בו —
			// כשזה קורה כל בלוק ה-media מתעלם ממנו לגמרי. יעד מפורש שומר על
			// (min-width: 62rem) הקלאסי שנתמך בכל דפדפן.
			cssTarget: 'safari14',
		},
	},
});
