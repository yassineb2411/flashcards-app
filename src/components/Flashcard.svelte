<script>
  export let word;
  export let definitions;
  export let selectedDefinitions;  // Tableau pour gérer l'état des cases à cocher
  export let onValidate;  // Fonction pour valider

  // Fonction pour enregistrer les données dans localStorage
  function saveToMemory() {
    const selectedDefs = definitions.filter((_, index) => selectedDefinitions[index]); // Filtre les définitions sélectionnées
    const storedMemory = localStorage.getItem('memory');
    const memory = storedMemory ? JSON.parse(storedMemory) : {};  // Si 'memory' existe, on le charge, sinon on crée un objet vide

    memory[word] = selectedDefs;  // On associe les définitions sélectionnées au mot actuel
    localStorage.setItem('memory', JSON.stringify(memory));  // On enregistre les données dans le localStorage
    console.log("Données enregistrées dans la mémoire", memory); // Pour vérifier
  }

  // Appel de saveToMemory lors de la validation
  function handleValidation() {
    saveToMemory();  // Sauvegarde les données
    console.log("Données sauvegardées pour le mot", word);
  }
</script>

<!-- Contenu de la carte -->
<div>
  <h3>Définitions pour le mot : {word}</h3>

  {#each definitions as def, index}
    <div>
      <!-- Liaison directe entre la case à cocher et le tableau `selectedDefinitions` -->
      <input
        type="checkbox"
        id={"def-" + index}
        bind:checked={selectedDefinitions[index]}  
      />
      <label for={"def-" + index}>{def}</label>
    </div>
  {/each}

  <button on:click={onValidate}>Valider</button>
</div>
