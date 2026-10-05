import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages 的網址在 /fake-message/ 底下
export default defineConfig({
  base: '/fake-message/',
  plugins: [react()],
});
