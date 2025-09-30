# 🚢 API REST - Gestion des Catways

API complète pour la gestion des pontons (catways) et des réservations avec authentification sécurisée.

## 🛠️ Technologies utilisées

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **Bcrypt** - Hashage des mots de passe
- **JWT (jsonwebtoken)** - Authentification par tokens

## 📦 Installation

### Prérequis

- Node.js (v14 ou supérieur)
- MongoDB (v4.4 ou supérieur)

### Étapes d'installation

1. **Cloner le projet**

```bash
git clone <votre-repo>
cd catway-api
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

```bash
cp .env.example .env
# Éditer le fichier .env avec vos valeurs
```

4. **Démarrer MongoDB**

```bash
# Sur Linux/Mac
sudo systemctl start mongod

# Sur Windows
net start MongoDB
```

5. **Créer le dossier public**

```bash
mkdir public
# Placer le fichier index.html dans ce dossier
```

6. **Démarrer le serveur**

```bash
# Mode production
npm start

# Mode développement (avec rechargement auto)
npm run dev
```

Le serveur démarre sur `http://localhost:8080`

## 📁 Structure du projet

```
catway-api/
├── server.js              # Serveur principal
├── package.json           # Dépendances
├── .env                   # Variables d'environnement
├── .env.example          # Exemple de configuration
├── public/               # Fichiers statiques
│   └── index.html        # Page de connexion
└── README.md             # Documentation
```

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

### S'inscrire

**Endpoint:** `POST /register`

**Body:**

```json
{
  "name": "Jean Dupont",
  "email": "jean.dupont@example.com",
  "password": "motdepasse123"
}
```

**Réponse:**

```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "data": {
    "id": "65f3a2b1c4d5e6f7g8h9i0j1",
    "name": "Jean Dupont",
    "email": "jean.dupont@example.com"
  }
}
```

### Se connecter

**Endpoint:** `POST /login`

**Body:**

```json
{
  "email": "jean.dupont@example.com",
  "password": "motdepasse123"
}
```

**Réponse:**

```json
{
  "success": true,
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f3a2b1c4d5e6f7g8h9i0j1",
    "name": "Jean Dupont",
    "email": "jean.dupont@example.com"
  }
}
```

### Utiliser le token

Pour toutes les routes protégées, ajouter le header :

```
Authorization: Bearer <votre_token>
```

## 📚 API Endpoints

### 🏗️ Catways

#### Lister tous les catways

```http
GET /catways
Authorization: Bearer <token>
```

**Réponse:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "65f3a2b1c4d5e6f7g8h9i0j1",
      "catwayNumber": "A1",
      "type": "long",
      "catwayState": "Bon état",
      "createdAt": "2025-09-30T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### Récupérer un catway spécifique

```http
GET /catways/:id
Authorization: Bearer <token>
```

#### Créer un catway

```http
POST /catways
Authorization: Bearer <token>
Content-Type: application/json

{
  "catwayNumber": "A1",
  "type": "long",
  "catwayState": "Bon état"
}
```

#### Modifier l'état d'un catway

```http
PUT /catways/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "catwayState": "Nécessite réparation"
}
```

#### Supprimer un catway

```http
DELETE /catways/:id
Authorization: Bearer <token>
```

### 📅 Réservations

#### Lister les réservations d'un catway

```http
GET /catways/:id/reservations
Authorization: Bearer <token>
```

**Réponse:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "65f3a2b1c4d5e6f7g8h9i0j2",
      "catwayId": "65f3a2b1c4d5e6f7g8h9i0j1",
      "catwayNumber": "A1",
      "clientName": "Marie Martin",
      "boatName": "Liberté",
      "checkIn": "2025-10-01T00:00:00.000Z",
      "checkOut": "2025-10-15T00:00:00.000Z",
      "createdAt": "2025-09-30T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### Récupérer une réservation spécifique

```http
GET /catways/:id/reservations/:idReservation
Authorization: Bearer <token>
```

#### Créer une réservation

```http
POST /catways/:id/reservations
Authorization: Bearer <token>
Content-Type: application/json

{
  "clientName": "Marie Martin",
  "boatName": "Liberté",
  "checkIn": "2025-10-01",
  "checkOut": "2025-10-15"
}
```

**Réponse:**

```json
{
  "success": true,
  "message": "Réservation créée avec succès",
  "data": {
    "_id": "65f3a2b1c4d5e6f7g8h9i0j2",
    "catwayId": "65f3a2b1c4d5e6f7g8h9i0j1",
    "catwayNumber": "A1",
    "clientName": "Marie Martin",
    "boatName": "Liberté",
    "checkIn": "2025-10-01T00:00:00.000Z",
    "checkOut": "2025-10-15T00:00:00.000Z",
    "createdAt": "2025-09-30T12:30:00.000Z"
  }
}
```

#### Supprimer une réservation

```http
DELETE /catways/:id/reservations/:idReservation
Authorization: Bearer <token>
```

## 🧪 Tests avec cURL

### Inscription

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Connexion

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Créer un catway (remplacer YOUR_TOKEN)

```bash
curl -X POST http://localhost:3000/catways \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "catwayNumber": "A1",
    "type": "long",
    "catwayState": "Bon état"
  }'
```

### Créer une réservation (remplacer CATWAY_ID et YOUR_TOKEN)

```bash
curl -X POST http://localhost:3000/catways/CATWAY_ID/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "clientName": "Jean Dupont",
    "boatName": "Aventure",
    "checkIn": "2025-10-01",
    "checkOut": "2025-10-15"
  }'
```

## 🔒 Sécurité

- Les mots de passe sont hashés avec bcrypt (10 rounds)
- Authentification JWT avec expiration de 24h
- Validation des données côté client et serveur
- Protection contre les injections NoSQL avec Mongoose
- Vérification des conflits de dates pour les réservations

## 📊 Modèles de données

### User

```javascript
{
  name: String (requis),
  email: String (requis, unique),
  password: String (requis, hashé),
  createdAt: Date
}
```

### Catway

```javascript
{
  catwayNumber: String (requis, unique),
  type: String (requis),
  catwayState: String (requis),
  createdAt: Date
}
```

### Reservation

```javascript
{
  catwayId: ObjectId (requis, référence Catway),
  catwayNumber: String (requis),
  clientName: String (requis),
  boatName: String (requis),
  checkIn: Date (requis),
  checkOut: Date (requis),
  createdAt: Date
}
```

## ⚠️ Codes d'erreur HTTP

- `200` - Succès
- `201` - Créé avec succès
- `400` - Requête invalide
- `401` - Non authentifié
- `403` - Token invalide
- `404` - Ressource non trouvée
- `409` - Conflit (ex: dates de réservation)
- `500` - Erreur serveur

## 🚀 Améliorations possibles

- [ ] Pagination pour les listes
- [ ] Filtres et recherche
- [ ] Upload d'images pour les bateaux
- [ ] Notifications par email
- [ ] Dashboard administrateur
- [ ] Statistiques et rapports
- [ ] Export des données (CSV, PDF)
- [ ] API rate limiting
- [ ] Logs des actions utilisateur
- [ ] Tests unitaires et d'intégration

## 📝 Licence

ISC

## 👤 Auteur

iWutang
