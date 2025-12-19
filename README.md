# Johan Mistral Chat

Application de chat avec l'API Mistral (modèle open-mixtral-8x22b) en streaming.

## Installation

```bash
npm install
```

## Lancement

```bash
npm run dev
```

Ouvrir http://localhost:3000

## Utilisation

1. Obtenir une clé API gratuite sur [console.mistral.ai](https://console.mistral.ai)
2. Entrer la clé dans l'interface au premier lancement
3. La clé est sauvegardée localement (localStorage)

## Structure

```
app/
├── page.tsx              # Monte le composant Chat
├── globals.css           # Styles + animations custom
├── components/
│   └── Chat.tsx          # UI complète (config + chat)
├── hooks/
│   └── useChat.ts        # Logique : messages, streaming, API key
└── api/chat/
    └── route.ts          # Proxy vers Mistral (streaming SSE)
```

## Choix techniques

- **Streaming** : réponses affichées progressivement (effet machine à écrire)
- **Clé API côté client** : stockée en localStorage, envoyée à chaque requête
- **Buffer SSE** : gestion des chunks incomplets pour éviter les coupures
- **Fetch natif** : pas de dépendance externe pour le chat
- **Tailwind** : styling avec glassmorphism et gradients

## Design

- Gradients indigo/purple
- Glassmorphism (backdrop-blur)
- Animations d'entrée des messages
- Indicateur de frappe animé (3 points)
- Support dark mode

## Limites volontaires

- Mono-conversation (pas d'historique)
- Pas d'authentification serveur
- Pas de persistance des conversations
- Messages non formatés (pas de markdown)
