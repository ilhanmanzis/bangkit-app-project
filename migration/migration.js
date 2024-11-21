import db from "../src/config/db.js";

const createUsersTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      jenis_kelamin VARCHAR(10) NOT NULL,
      tanggal_lahir DATE NOT NULL,
      berat_badan INT NOT NULL,
      tinggi_badan INT NOT NULL,
      password VARCHAR(255) NOT NULL,
      refresh_token TEXT DEFAULT NULL
    );
  `;

  try {
    const connection = await db.getConnection();
    await connection.query(sql);
    console.log('Users table created successfully');
    connection.release();

    // Keluar dari program dengan kode sukses
    process.exit(0);
  } catch (error) {
    console.error('Error creating users table:', error.message);

    // Keluar dari program dengan kode error
    process.exit(1);
  }
};

createUsersTable();