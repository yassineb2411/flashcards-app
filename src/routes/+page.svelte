<script>
  import { onMount } from 'svelte';
  import { fetchDefinitions, resetMemory } from '$lib/dataManager'; 
  import SelectGame from '../components/SelectGame.svelte';
  import Flashcard from '../components/Flashcard.svelte';
  import { sets } from '$lib/dataManager';

  let selectedGame = null;
  let flashcards = [];
  let currentCard = null;
  export let word;
  let definitions = [];
  let selectedDefinitions = [];  // Tableau pour gérer l'état des cases à cocher
  let showDefinitions = false;

  // Fonction pour récupérer les définitions via l'API pour un mot donné
  async function loadDefinitions(word) {
    definitions = await fetchDefinitions(word); 
    selectedDefinitions = new Array(definitions.length).fill(false); // Initialiser à `false`
    showDefinitions = false;
  }

  // Fonction pour tirer une carte au hasard du jeu sélectionné
  function drawCard() {
    const randomIndex = Math.floor(Math.random() * flashcards.length);
    currentCard = flashcards[randomIndex];
    loadDefinitions(currentCard.word); // Charger les définitions du mot de la carte tirée
  }

  // Fonction appelée lors de la sélection d'un jeu
  function onSelectGame(game) {
    selectedGame = game;
    flashcards = sets[game] || [];
    drawCard(); 
  }

  // Fonction pour mettre à jour la mémoire après l'auto-évaluation
  function updateMemoryForCard(word, correctCount) {
    const storedMemory = localStorage.getItem('memory');
    const memory = storedMemory ? JSON.parse(storedMemory) : {};
    memory[word] = correctCount;
    localStorage.setItem('memory', JSON.stringify(memory));
  }

  // Fonction pour réinitialiser les données en mémoire
  function resetGame() {
    selectedGame = null;
    flashcards = [];
    currentCard = null;
    definitions = [];
    selectedDefinitions = [];
    showDefinitions = false;
    resetMemory();
  }

  function saveToMemory() {
    const selectedDefs = definitions.filter((_, index) => selectedDefinitions[index]); // Filtre les définitions sélectionnées
    const storedMemory = localStorage.getItem('memory');
    const memory = storedMemory ? JSON.parse(storedMemory) : {};  // Si 'memory' existe, on le charge, sinon on crée un objet vide

    memory[word] = selectedDefs;  // On associe les définitions sélectionnées au mot actuel
    localStorage.setItem('memory', JSON.stringify(memory));  // On enregistre les données dans le localStorage
    console.log("Données enregistrées dans la mémoire", memory); // Pour vérifier
  }

  // Fonction pour valider les réponses et mettre à jour la mémoire
  function handleValidation() {
    const correctCount = selectedDefinitions.filter(def => def).length;
    updateMemoryForCard(currentCard.word, correctCount); 
    drawCard();
  }

  // Fonction pour retourner la carte et afficher les définitions
  function flipCard() {
    showDefinitions = true; 
  }
</script>

<div class="page">
  <h1>Flashcards App</h1>

  {#if !selectedGame}
    <!-- Sélection du jeu -->
    <SelectGame on:gameSelected={event => onSelectGame(event.detail)} />
  {:else}
    <div class="card-container">
      {#if currentCard}
        <div>
          <h2>{currentCard.word}</h2>
          {#if !showDefinitions}
            <button on:click={flipCard}>Retourner la carte</button>
          {:else}
            <!-- Transmission de `selectedDefinitions` -->
            <Flashcard 
              word={currentCard.word} 
              definitions={definitions} 
              selectedDefinitions={selectedDefinitions}
              onValidate={handleValidation} 
            />
          {/if}
        </div>
      {:else}
        <p>Chargement de la carte...</p>
      {/if}
    </div>

    <button on:click={resetGame}>Réinitialiser le jeu</button>
  {/if}
</div>
