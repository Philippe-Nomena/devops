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
