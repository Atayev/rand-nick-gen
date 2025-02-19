const button = document.getElementById("generateButton");
const info = document.getElementById("additional");
const nicknameInput = document.getElementById("nicknameInput");
const loader = document.getElementById("loader");
const overlay = document.getElementById("overlay");

async function fetchData() {
  overlay.style.display = "flex";
  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    nicknameInput.value = data.player;
    nicknameInput.classList.add("fade-in");
    nicknameInput.classList.add("green-border");
    console.log("Classes added"); // Debugging log

    setTimeout(() => {
      nicknameInput.classList.remove("fade-in");
      nicknameInput.classList.remove("green-border");
      console.log("Classes removed"); // Debugging log
    }, 5000);
  } catch (error) {
    console.error("Error fetching nickname:", error);
    info.textContent =
      "Failed to generate a new nickname. Please try again later.";
    info.style.color = "red";
    info.style.fontSize = "1rem";
    info.classList.add("fade-in");
    setTimeout(() => info.classList.remove("fade-in"), 1000);
  } finally {
    overlay.style.display = "none"; // Hide spinner
  }
}

button.addEventListener("click", fetchData);
