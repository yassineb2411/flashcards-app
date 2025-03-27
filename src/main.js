import App from './lib/App.svelte';  // Import du composant principal

const app = new App({
  target: document.getElementById('app')  // Ici, on monte l'application dans un élément avec id "app"
});

export default app;
