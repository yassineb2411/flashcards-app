// Fonction pour ouvrir une base de données IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('flashcardsApp', 1);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('performance')) {
          db.createObjectStore('performance', { keyPath: 'word' });
        }
      };
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = reject;
    });
  }
  
  // Sauvegarde de la performance dans IndexedDB
export async function savePerformance(word, correct) {
    const db = await openDB();
    const transaction = db.transaction('performance', 'readwrite');
    const store = transaction.objectStore('performance');
    store.put({ word, correct });
  
    transaction.oncomplete = () => console.log(`Performance for ${word} saved: ${correct}`);
    transaction.onerror = (error) => console.error('Error saving performance:', error);
}
  
  // Chargement des performances depuis IndexedDB
export async function loadPerformance() {
    const db = await openDB();
    const transaction = db.transaction('performance', 'readonly');
    const store = transaction.objectStore('performance');
    const allData = await store.getAll();
  
    // Retourne un objet avec les performances par mot
    const performance = {};
    allData.forEach(item => {
      performance[item.word] = item.correct;
    });
  
    return performance;
}
  
  // Réinitialisation des scores dans IndexedDB
export async function resetPerformance() {
    const db = await openDB();
    const transaction = db.transaction('performance', 'readwrite');
    const store = transaction.objectStore('performance');
    store.clear();
  
    transaction.oncomplete = () => console.log("All performance data has been reset.");
    transaction.onerror = (error) => console.error('Error resetting performance:', error);
}
  
  // Fonction pour tirer un mot aléatoire sans répétition fréquente
export async function getNextWord(wordList) {
    const performance = await loadPerformance();
    let remainingWords = wordList.filter(word => !performance[word]);
  
    // Si toutes les cartes ont été utilisées, réinitialise les performances et recommence
    if (remainingWords.length === 0) {
      await resetPerformance();
      remainingWords = wordList;
    }
  
    // Choisit un mot aléatoire parmi les mots restants
    const randomIndex = Math.floor(Math.random() * remainingWords.length);
    return remainingWords[randomIndex];
}

// Fonction pour récupérer la définition d'un mot via l'API
export async function fetchDefinition(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Mot non trouvé');
        }
        const data = await response.json();
        // Retourne la première définition du mot
        return data[0].meanings[0].definitions[0].definition;
    } catch (error) {
        console.error('Erreur lors de la récupération de la définition:', error);
        return 'Définition non disponible'; // Message d'erreur si l'API échoue
    }
}
