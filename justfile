# Default recipe (runs when you type `just` with no arguments)
default: deploy

# Deploy to Firebase
deploy:
    npm run build && firebase deploy
