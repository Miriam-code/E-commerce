require('dotenv').config({ path: '.env.test' });
const mysql = require('mysql2/promise');

(async () => {
  const {
    DB_HOST = '127.0.0.1',
    DB_USER = 'root',
    DB_PASS = '',
    DB_NAME = 'watch_test',
  } = process.env;

  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`✅ Base de test '${DB_NAME}' prête.`);
    await connection.end();
  } catch (err) {
    console.error('❌ Erreur lors de la création de la base :', err.message);
    process.exit(1);
  }
})();
