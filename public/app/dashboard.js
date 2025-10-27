const API_URL = "http://localhost:8080"; // URL de ton serveur
const token = localStorage.getItem("token") || ""; // Si tu utilises JWT

// Helper pour fetch avec gestion JWT
async function apiFetch(url, options = {}) {
  options.headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };
  const res = await fetch(url, options);
  return await res.json();
}

// --- USERS ---
document
  .getElementById("createUserForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
    };
    const res = await apiFetch(`${API_URL}/register`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    document.getElementById("createUserResponse").innerText = JSON.stringify(
      res,
      null,
      2
    );
  });

document
  .getElementById("updateUserForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {};
    if (form.name.value) data.name = form.name.value;
    if (form.email.value) data.email = form.email.value;
    const res = await apiFetch(`${API_URL}/users/${form.userId.value}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    document.getElementById("updateUserResponse").innerText = JSON.stringify(
      res,
      null,
      2
    );
  });

document
  .getElementById("deleteUserForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const res = await apiFetch(`${API_URL}/users/${form.userId.value}`, {
      method: "DELETE",
    });
    document.getElementById("deleteUserResponse").innerText = JSON.stringify(
      res,
      null,
      2
    );
  });

// --- CATWAYS ---
document
  .getElementById("createCatwayForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      catwayNumber: form.catwayNumber.value,
      type: form.type.value,
      catwayState: form.catwayState.value,
    };
    const res = await apiFetch(`${API_URL}/catways`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    document.getElementById("createCatwayResponse").innerText = JSON.stringify(
      res,
      null,
      2
    );
  });

document
  .getElementById("updateCatwayForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = { catwayState: form.catwayState.value };
    const res = await apiFetch(`${API_URL}/catways/${form.catwayId.value}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    document.getElementById("updateCatwayResponse").innerText = JSON.stringify(
      res,
      null,
      2
    );
  });

document
  .getElementById("deleteCatwayForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const res = await apiFetch(`${API_URL}/catways/${form.catwayId.value}`, {
      method: "DELETE",
    });
    document.getElementById("deleteCatwayResponse").innerText = JSON.stringify(
      res,
      null,
      2
    );
  });

document
  .getElementById("detailsCatwayForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const res = await apiFetch(`${API_URL}/catways/${form.catwayId.value}`, {
      method: "GET",
    });
    document.getElementById("detailsCatwayResponse").innerText = JSON.stringify(
      res,
      null,
      2
    );
  });

document
  .getElementById("listCatwaysButton")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || "";

    const res = await fetch(`${API_URL}/catways`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
      <html>
        <head><title>Liste des Catways</title></head>
        <body>
          <h1>Liste des Catways</h1>
          <pre>${JSON.stringify(data, null, 2)}</pre>
      </body>
      </html>
    `);
    newWindow.document.close();
  });

// get list cateway ajouter!
// --- RESERVATIONS ---
document
  .getElementById("createReservationForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      clientName: form.clientName.value,
      boatName: form.boatName.value,
      checkIn: form.checkIn.value,
      checkOut: form.checkOut.value,
    };
    const res = await apiFetch(
      `${API_URL}/reservations/${form.catwayId.value}`,
      { method: "POST", body: JSON.stringify(data) }
    );
    document.getElementById("createReservationResponse").innerText =
      JSON.stringify(res, null, 2);
  });

document
  .getElementById("deleteReservationForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const res = await apiFetch(
      `${API_URL}/reservations/${form.catwayId.value}/${form.reservationId.value}`,
      { method: "DELETE" }
    );
    document.getElementById("deleteReservationResponse").innerText =
      JSON.stringify(res, null, 2);
  });

document
  .getElementById("detailsReservationForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const res = await apiFetch(
      `${API_URL}/reservations/${form.catwayId.value}/${form.reservationId.value}`,
      { method: "GET" }
    );
    document.getElementById("detailsReservationResponse").innerText =
      JSON.stringify(res, null, 2);
  });

document
  .getElementById("listReservationsButton")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || "";

    const res = await fetch(`${API_URL}/reservations`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
      <html>
        <head><title>Liste des Réservations</title></head>
        <body>
          <h1>Liste des Réservations</h1>
          <pre>${JSON.stringify(data, null, 2)}</pre>
      </body>
      </html>
    `);
    newWindow.document.close();
  });
