//bouton docs
const docsBtn = document.getElementById("docsBtn");
docsBtn.addEventListener("click", () => {
  window.location.href = "docs.html";
});

// Changer d'onglet
function switchTab(tab) {
  const tabs = document.querySelectorAll(".tab-btn");
  const forms = document.querySelectorAll(".form-tab");

  tabs.forEach((t) => t.classList.remove("active"));
  forms.forEach((f) => f.classList.remove("active"));

  if (tab === "login") {
    tabs[0].classList.add("active");
    document.getElementById("loginForm").classList.add("active");
  } else {
    tabs[1].classList.add("active");
    document.getElementById("registerForm").classList.add("active");
  }

  hideMessage();
}

// Afficher un message
function showMessage(message, type) {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = message;
  messageDiv.className = `message ${type}`;
}

function hideMessage() {
  const messageDiv = document.getElementById("message");
  messageDiv.className = "message";
}

// Validation email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Vérifier la force du mot de passe
function checkPasswordStrength() {
  const password = document.getElementById("registerPassword").value;
  const strengthBar = document.getElementById("passwordStrengthBar");

  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
  if (password.match(/\d/)) strength++;
  if (password.match(/[^a-zA-Z\d]/)) strength++;

  strengthBar.className = "password-strength-bar";
  if (strength >= 2) strengthBar.classList.add("weak");
  if (strength >= 3) strengthBar.classList.add("medium");
  if (strength >= 4) strengthBar.classList.add("strong");
}

// Gestion de la connexion
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  // Validation côté client
  let isValid = true;

  if (!validateEmail(email)) {
    document.getElementById("loginEmail").classList.add("invalid");
    document.getElementById("loginEmailError").textContent = "Email invalide";
    document.getElementById("loginEmailError").classList.add("show");
    isValid = false;
  } else {
    document.getElementById("loginEmail").classList.remove("invalid");
    document.getElementById("loginEmailError").classList.remove("show");
  }

  if (password.length < 6) {
    document.getElementById("loginPassword").classList.add("invalid");
    document.getElementById("loginPasswordError").textContent =
      "Mot de passe trop court";
    document.getElementById("loginPasswordError").classList.add("show");
    isValid = false;
  } else {
    document.getElementById("loginPassword").classList.remove("invalid");
    document.getElementById("loginPasswordError").classList.remove("show");
  }

  if (!isValid) return;

  // Envoyer la requête
  const btn = document.getElementById("loginBtn");
  btn.disabled = true;
  btn.textContent = "Connexion...";

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      showMessage("Connexion réussie! Redirection...", "success");

      // Redirection après 1 seconde
      setTimeout(() => {
        window.location.href = "/dashboard.html";
      }, 1000);
    } else {
      showMessage(data.message, "error");
    }
  } catch (error) {
    showMessage("Erreur de connexion au serveur", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Se connecter";
  }
}

// Gestion de l'inscription
async function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;
  const passwordConfirm = document.getElementById(
    "registerPasswordConfirm"
  ).value;

  // Validation côté client
  let isValid = true;

  if (name.length < 2) {
    document.getElementById("registerName").classList.add("invalid");
    document.getElementById("registerNameError").textContent = "Nom trop court";
    document.getElementById("registerNameError").classList.add("show");
    isValid = false;
  } else {
    document.getElementById("registerName").classList.remove("invalid");
    document.getElementById("registerNameError").classList.remove("show");
  }

  if (!validateEmail(email)) {
    document.getElementById("registerEmail").classList.add("invalid");
    document.getElementById("registerEmailError").textContent =
      "Email invalide";
    document.getElementById("registerEmailError").classList.add("show");
    isValid = false;
  } else {
    document.getElementById("registerEmail").classList.remove("invalid");
    document.getElementById("registerEmailError").classList.remove("show");
  }

  if (password.length < 8) {
    document.getElementById("registerPassword").classList.add("invalid");
    document.getElementById("registerPasswordError").textContent =
      "Le mot de passe doit contenir au moins 8 caractères";
    document.getElementById("registerPasswordError").classList.add("show");
    isValid = false;
  } else {
    document.getElementById("registerPassword").classList.remove("invalid");
    document.getElementById("registerPasswordError").classList.remove("show");
  }

  if (password !== passwordConfirm) {
    document.getElementById("registerPasswordConfirm").classList.add("invalid");
    document.getElementById("registerPasswordConfirmError").textContent =
      "Les mots de passe ne correspondent pas";
    document
      .getElementById("registerPasswordConfirmError")
      .classList.add("show");
    isValid = false;
  } else {
    document
      .getElementById("registerPasswordConfirm")
      .classList.remove("invalid");
    document
      .getElementById("registerPasswordConfirmError")
      .classList.remove("show");
  }

  if (!isValid) return;

  // Envoyer la requête
  const btn = document.getElementById("registerBtn");
  btn.disabled = true;
  btn.textContent = "Inscription...";

  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (data.success) {
      showMessage(
        "Inscription réussie! Vous pouvez maintenant vous connecter.",
        "success"
      );

      // Réinitialiser le formulaire
      document.getElementById("registerForm").reset();
      document.getElementById("passwordStrengthBar").className =
        "password-strength-bar";

      // Passer à l'onglet connexion après 2 secondes
      setTimeout(() => {
        switchTab("login");
      }, 2000);
    } else {
      showMessage(data.message, "error");
    }
  } catch (error) {
    showMessage("Erreur de connexion au serveur", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "S'inscrire";
  }
}

// Nettoyer les erreurs lors de la saisie
document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", function () {
    this.classList.remove("invalid");
    const errorId = this.id + "Error";
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.classList.remove("show");
    }
  });
});
