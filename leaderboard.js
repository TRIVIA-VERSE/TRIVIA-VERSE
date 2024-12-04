// Get the player list from localStorage or initialize as an empty array if not found
const playerList = JSON.parse(localStorage.getItem("playerList")) || [];
const playerListElement = document.getElementById("player-list");
const resetButton = document.getElementById("reset-btn");

// Function to display the player list
function displayPlayerList() {
    // Ensure the player scores are treated as numbers, and sort by score (highest to lowest)
    playerList.sort((a, b) => Number(b.score) - Number(a.score)); // Convert score to number for proper sorting

    if (Array.isArray(playerList) && playerList.length > 0) {
        playerListElement.innerHTML = "";  // Clear the list before re-rendering
        playerList.forEach((entry, index) => {
            if (entry.name && entry.score !== undefined) {
                const entryElement = document.createElement("div");
                entryElement.classList.add("player-entry");
                entryElement.textContent = `${index + 1}. ${entry.name} - ${entry.score}`;
                playerListElement.appendChild(entryElement);
            } else {
                console.error(`Invalid entry format at index ${index}:`, entry);
            }
        });
    } else {
        playerListElement.textContent = "No players have participated yet.";
    }
}

// Display the player list when the page loads
displayPlayerList();

// Reset button event listener
resetButton.addEventListener("click", function() {
    // Clear the player list from localStorage
    localStorage.removeItem("playerList");

    // Re-render the empty state
    displayPlayerList();
});
