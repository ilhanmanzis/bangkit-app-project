# Gunakan base image Node.js
FROM node:16

# Set working directory
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin seluruh kode
COPY . .

# Ekspos port
EXPOSE 5000

# Perintah untuk menjalankan aplikasi
CMD ["npm", "start"]
