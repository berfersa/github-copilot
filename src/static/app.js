document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        // Crear lista de participantes
        const participantsList = details.participants.length
          ? `<ul class="participants-list">
              ${details.participants.map(p => `<li>${p}</li>`).join("")}
            </ul>`
          : `<p class="no-participants">No hay participantes aún.</p>`;

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Horario:</strong> ${details.schedule}</p>
          <p><strong>Disponibilidad:</strong> ${spotsLeft} lugares disponibles</p>
          <div class="participants-section">
            <strong>Participantes:</strong>
            ${participantsList}
          </div>
        `;

        // Añadir estilos inline para hacerlo más bonito
        activityCard.style.border = "1px solid #e0e0e0";
        activityCard.style.borderRadius = "8px";
        activityCard.style.padding = "16px";
        activityCard.style.marginBottom = "18px";
        activityCard.style.background = "#fafbfc";
        activityCard.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";

        // Estilo para la lista de participantes
        const style = document.createElement("style");
        style.textContent = `
          .participants-section {
            margin-top: 12px;
            background: #f0f4f8;
            border-radius: 6px;
            padding: 8px 12px;
          }
          .participants-list {
            margin: 6px 0 0 0;
            padding-left: 20px;
          }
          .participants-list li {
            margin-bottom: 2px;
            color: #2d3a4a;
          }
          .no-participants {
            color: #888;
            font-style: italic;
            margin: 6px 0 0 0;
          }
        `;
        activityCard.appendChild(style);

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
