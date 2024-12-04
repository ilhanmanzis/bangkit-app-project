# capstone cloud computing api


## overview

This project is the final part of Bangkit Academy. This project involves creating APIs for machine learning models, login, register.

## packages used in the project

- Hapi.js
- dotenv
- mysql2
- jsonwebtoken (untuk otentifikasi dengan jwt)
- bcryptjs (untuk enkripsi password)
- Joi (untuk validasi data)

## documentation

[Documentation](https://app.swaggerhub.com/apis-docs/ILHANMANZIS1207/api-dokumentasi_ideat/1.0.0)


## installation

1. clone the repository:
   ```sh
   git clone https://github.com/ilhanmanzis/bangkit-app-project
   ```

2. copy file .env.example menjadi .env, kemudian isi yang diperlukan didalam file .env
   ```sh
   cp .env.example .env
   ```

3. Install the required packages
   ```sh
   npm install
   ```

4. migration database
   ```sh
   npm run migration
   ```

5. how to run
   - development
     ```sh
     npm run dev
     ```
   - production
     ```sh
     npm run start
     ```
