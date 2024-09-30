# ColocaSmart - Backend

Ce projet représente l'API backend de **ColocaSmart**, une application destinée à simplifier la gestion entre colocataires. Les fonctionnalités incluent la gestion des tâches quotidiennes, le suivi du budget partagé, et bien plus encore.

## Table des matières

- [Aperçu du projet](#aperçu-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies utilisées](#technologies-utilisées)
- [Scripts](#scripts)
- [Contributeurs](#contributeurs)

## Aperçu du projet

**ColocaSmart** permet aux colocataires de :
- Gérer les tâches quotidiennes (par exemple : nettoyage, courses, etc.).
- Suivre le budget partagé et répartir les dépenses équitablement.
- Faciliter la communication et la gestion des responsabilités au sein de la colocation.

Le backend de ce projet a été développé en utilisant Node.js avec Express, connecté à une base de données MySQL via Sequelize ORM.

## Fonctionnalités

- **Création de compte utilisateur** avec hachage de mot de passe via `bcryptjs`.
- **Authentification des utilisateurs**.
- **Gestion des tâches** : Ajout, mise à jour, suppression des tâches entre colocataires.
- **Gestion du budget partagé** : Enregistrement et suivi des dépenses.
- **API REST** : Architecture d'API RESTful avec des routes bien définies.
- **Support des requêtes CORS** pour permettre les connexions entre l'API et un client frontend.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- [Node.js](https://nodejs.org/en/download/) (version 14 ou supérieure)
- [npm](https://www.npmjs.com/) (normalement installé avec Node.js)
- [MySQL](https://dev.mysql.com/downloads/) (pour la gestion de la base de données)

## Installation

Suivez ces étapes pour installer et configurer l'API backend.

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/votre-utilisateur/colocasmart-backend.git
   cd colocasmart-backend
   ```
   
2. **API Endpoints**

   Voici quelques exemples de routes disponibles dans l'API :

   - `POST /api/users/register` : Inscription d'un nouvel utilisateur
   - `POST /api/users/login` : Connexion d'un utilisateur
   - `GET /api/tasks` : Récupérer toutes les tâches
   - `POST /api/tasks` : Créer une nouvelle tâche
   - `PUT /api/tasks/:id` : Mettre à jour une tâche
   - `DELETE /api/tasks/:id` : Supprimer une tâche
   - `GET /api/budget` : Récupérer toutes les dépenses
   - `POST /api/budget` : Ajouter une nouvelle dépense

## Technologies utilisées

- **Node.js** : Environnement d'exécution JavaScript côté serveur.
- **Express** : Framework web minimal et flexible pour Node.js.
- **MySQL** : Base de données relationnelle utilisée pour stocker les informations des utilisateurs, des tâches et des dépenses.
- **Sequelize** : ORM (Object-Relational Mapping) pour interagir avec MySQL.
- **bcryptjs** : Pour le hachage des mots de passe et la sécurité des utilisateurs.
- **dotenv** : Pour la gestion des variables d'environnement.
- **cors** : Middleware pour gérer les requêtes Cross-Origin.

## Scripts

- `npm start` : Démarre le serveur avec `nodemon`.
- `npm run sync-db` : Synchronise la base de données avec Sequelize.
- `npm install` : Installe les dépendances du projet.

## Contributeurs

- **Votre Nom** - Calvin

Si vous souhaitez contribuer à ce projet, n'hésitez pas à soumettre une pull request ou à ouvrir une issue.