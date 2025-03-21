# spotify web controller
Control your spotify playback through a simple website. Uses OAuth 2.0 authorization code flow method for authenticating the user. 

### How to run
1. Clone the project to your local machine
2. Install dependencies for both frontend & backend  in ``spotify-web-controller`` & ``server`` folders:
   ```bash
   npm install
   ```
3. Start the Vite server from the ``spotify-web-controller`` folder:
   ```bash
   npm run dev
   ```
4. Start the express.js server from the ``server`` folder:
   ```bash
   npx ts-node src/server.ts
   ```
5. Navigate to ``http://localhost:5173``
