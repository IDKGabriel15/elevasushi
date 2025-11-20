<?php
// api/db_config.php

// --- ACTUALIZA ESTOS DATOS CON LOS DE TU SERVIDOR ---
$host = 'localhost'; // O la IP/host de tu servidor de base de datos
$db_name = 'db_name';
$username = 'username';
$password = 'password';
$charset = 'utf8mb4';
// --------------------------------------------------

$dsn = "mysql:host=$host;dbname=$db_name;charset=$charset";

$options = [
    // Lanza excepciones en caso de error
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    // Devuelve los resultados como arrays asociativos (ej: ['nombre' => 'Sushi'])
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    // Desactiva la emulación de prepared statements para usar los nativos de MySQL
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    // Crea el objeto de conexión PDO
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (\PDOException $e) {
    // Si la conexión falla, muestra un error y detiene el script
    http_response_code(500);
    throw new \PDOException($e->getMessage(), (int) $e->getCode());
}
?>