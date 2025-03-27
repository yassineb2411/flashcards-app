<script>
  export let word = '';  // Mot à afficher
  export let definitions = [];  // Définitions à afficher
  let isFlipped = false;  // Contrôle pour savoir si la carte est retournée
  function toggleFlip(event) {
    if (event.type === 'click' || event.key === 'Enter' || event.key === ' ') {
      isFlipped = !isFlipped;
    }
  }
</script>

<div 
  class="flashcard" 
  role="button" 
  tabindex="0"  
  on:click={toggleFlip}
  on:keydown={toggleFlip}  
  aria-pressed={isFlipped ? 'true' : 'false'}  
>
  <div class="card">
    {#if isFlipped}
      <ul>
        {#each definitions as definition}
          <li>{definition}</li>
        {/each}
      </ul>
    {:else}
      <p>{word}</p>
    {/if}
  </div>
</div>

<style>
  .flashcard {
    cursor: pointer;
    width: 200px;
    height: 300px;
    border: 1px solid #ccc;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    transition: transform 0.5s;
    transform-style: preserve-3d;
  }

  .card {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    backface-visibility: hidden;
  }

  .card p {
    font-size: 24px;
  }

  .card ul {
    list-style: none;
    padding: 0;
  }

  .card li {
    font-size: 18px;
  }
</style>
