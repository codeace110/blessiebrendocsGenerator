import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    open: true // Automatically open browser
  },
  build: {
    sourcemap: true, // Generate source maps for better debugging
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          pdf: ['jspdf', 'html2canvas']
        }
      }
    }
  },
  define: {
    // Ensure environment variables are properly handled
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  }
})