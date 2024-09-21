import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import rollupNodePolyFill from 'rollup-plugin-polyfill-node'

export default defineConfig(async ({ mode }) => {	
	return {		
		plugins: [
			vue({
				template: {
					compilerOptions: {
					}
				}
			})
		],
		server: {
			port: 5207,
		},
		css: {
			loaderOptions: {
				sass: {
					implementation: require("sass"),
				},
			},
			preprocessorOptions: {
				scss: {
					includePaths: ['node_modules']
				}
			}
		},
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),	
			},
		},
		optimizeDeps: {
			esbuildOptions: {
				define: {
					global: 'globalThis',
				},
				plugins: [
					NodeGlobalsPolyfillPlugin({
						process: true,						
					}),
				],
			},
		},		
		build: {
			rollupOptions: {
				plugins: [
					rollupNodePolyFill()
				],
			},
			chunkSizeWarningLimit: false,
		}	
	};
});
