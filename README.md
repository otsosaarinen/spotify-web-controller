# Spotify Web Controller
Control your spotify playback through a simple website. Uses OAuth 2.0 authorization code flow method for authenticating the user. 

### Built with
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Spotify](https://img.shields.io/badge/Spotify-1ED760?style=for-the-badge&logo=spotify&logoColor=white)

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
