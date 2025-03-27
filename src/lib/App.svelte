<script>
  import { onMount } from 'svelte';
  import { fetchDefinition, savePerformance, loadPerformance, resetPerformance, getNextWord } from '../utils/dataManager';

  let cardSets = {
    set1: ['apple', 'banana', 'computer', 'svelte', 'developer', 'ocean', 'mountain', 'guitar', 'astronomy', 'philosophy'],
    set2: ['river', 'language', 'technology', 'sky', 'book', 'science', 'art', 'dream', 'code', 'friend'],
    set3: ['light', 'memory', 'school', 'future', 'music', 'forest', 'world', 'freedom', 'machine', 'mind']
  };

  let selectedSet = 'set1';
  let words = cardSets[selectedSet];
  let selectedWord = '';
  let definitions = [];
  let showDefinition = false;
  let performance = {};

  async function pickRandomWord() {
    showDefinition = false;
    words = cardSets[selectedSet];
    selectedWord = await getNextWord(words); // Utilisation de getNextWord pour éviter la répétition
    definitions = await fetchDefinition(selectedWord);
  }

  async function handlePerformance(correct) {
    await savePerformance(selectedWord, correct);
  }

  onMount(async () => {
    performance = await loadPerformance();
    pickRandomWord();
  });
</script>

<main>
  <h1>Flashcards - Learn English Words</h1>
  <label for="set-select">Choose a card set:</label>
  <select id="set-select" bind:value={selectedSet} on:change={() => pickRandomWord()}>
    <option value="set1">Set 1</option>
    <option value="set2">Set 2</option>
    <option value="set3">Set 3</option>
  </select>

  <button on:click={pickRandomWord}>Next Card</button>

  <div class="card">
    <h2>{selectedWord}</h2>

    {#if showDefinition}
      <ul>
        {#each definitions as def}
          <li>{def}</li>
        {/each}
      </ul>
      <button on:click={() => handlePerformance(true)}>I knew it</button>
      <button on:click={() => handlePerformance(false)}>I didn't know</button>
    {/if}

    <button on:click={() => (showDefinition = true)}>Show Definition</button>
  </div>

  <button on:click={resetPerformance}>Reset Performance</button>
</main>

<style>
  main {
    text-align: center;
  }

  .card {
    border: 1px solid black;
    padding: 20px;
    margin: 20px;
    display: inline-block;
  }
</style>
