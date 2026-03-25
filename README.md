# Test 24h – DevOps & Full Stack Engineer

Application de suivi de documents (CERFA / conventions) avec génération PDF + signature électronique simulée.

## Installation (1 commande)

```bash
./init.sh


## Architecture

- **Frontend** : React + Vite + Zustand (état client léger, pas Redux)
- **Backend** : Node.js/TypeScript + Express (robuste, typage strict)
- **DB** : MongoDB (documents JSON = stockage naturel pour CERFA)
- **Proxy** : Nginx (terminaison HTTP, routing /api vs /)

```

                    ┌─────────┐
         :80 ──────▶│  Nginx  │
                    └────┬────┘
               ┌─────────┴──────────┐
               ▼                    ▼
          ┌──────────┐       ┌───────────┐
          │ Frontend │       │  Backend  │
          │  :80     │       │   :3000   │
          └──────────┘       └─────┬─────┘
                                   │
                             ┌─────▼─────┐
                             │  MongoDB  │
                             └───────────┘

## Déploiement CI/CD

Cette application utilise GitHub Actions pour automatiser :

1. Lancer les tests et le linting sur le backend et le frontend.
2. Construire les images Docker pour le backend et le frontend.
3. Pousser les images sur GitHub Container Registry (GHCR).
4. Déployer automatiquement sur Render via des webhooks.

### Note sur le déploiement Render

Pour activer le déploiement automatique sur Render, il suffit de **configurer les secrets GitHub** suivants avec vos propres clés/webhooks Render :

- `RENDER_DEPLOY_HOOK_BACKEND` → webhook de déploiement backend
- `RENDER_DEPLOY_HOOK_FRONTEND` → webhook de déploiement frontend
- `RENDER_ROLLBACK_URL` → URL pour rollback automatique en cas d’échec (optionnel)
- `RENDER_API_KEY` → clé API pour le rollback (optionnel)

Si ces secrets ne sont pas configurés, le workflow continue de fonctionner pour **tests, lint et build Docker**, mais le déploiement Render ne sera pas déclenché.
