# syntax = docker/dockerfile:1

# Usa una versione ufficiale di Node.js
FROM node:18

# Crea la directory di lavoro
WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia tutto il resto del backend (inclusa la cartella public)
COPY . .

# Espone la porta (deve essere la stessa usata in server.js, es: 3000)
EXPOSE 3000

# Avvia il server
CMD ["node", "server.js"]
