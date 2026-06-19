import { defineConfig } from 'vite';

export default defineConfig({
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        submit: 'submit-esg.html'
      }
    }
  },
  plugins: [{
    name: 'submit-esg-pretty-urls',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url || '';
        const pathOnly = url.split('?')[0];
        if (/^\/submit-esg\/REQ-[\w-]+$/i.test(pathOnly)) {
          const query = url.includes('?') ? url.slice(url.indexOf('?')) : '';
          req.url = `/submit-esg.html${query}`;
        }
        next();
      });
    }
  }]
});
