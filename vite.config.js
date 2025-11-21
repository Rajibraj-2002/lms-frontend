import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // --- FIX IS HERE ---
  define: {
    // Tells SockJS to use 'window' instead of the undefined 'global' object
    global: 'window', 
  },
  // --- END FIX ---
});