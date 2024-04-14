import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	// optimizeDeps: {
	// 	disabled: false, // https://github.com/vitejs/vite/issues/9703
	// },
	// build: {
	// 	commonjsOptions: 
	// }
	server: {
		fs: {
		  // Allow serving files from specific directories
		  allow: ['C:\\Users\\andwx\\OneDrive\\Documents\\CS\\CS 6365\\fantasy-oracle']
		}
	  }
});
