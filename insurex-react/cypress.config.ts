<<<<<<< HEAD
export default {
  allowCypressEnv: false,

  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
};
=======
import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: "http://localhost:5173",
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        viewportWidth: 1280,
        viewportHeight: 720,
        video: false,
    },
});
>>>>>>> d63fc5bdc80de482702d1cfe0d23b84da79cbd27
