<?php
// api/get_menu.php

// 1. Incluir nuestra conexión a la base de datos
require 'db_config.php';

// 2. Definir que la respuesta será en formato JSON
header('Content-Type: application/json');

// 3. Obtener la categoría de la URL (ej: /get_menu.php?category=entradas)
// Usamos filter_input para limpiar el dato y prevenir ataques XSS
$category_key = filter_input(INPUT_GET, 'category', FILTER_UNSAFE_RAW);

// 4. Validar que la categoría no esté vacía
if (empty($category_key)) {
    http_response_code(400); // 400 Bad Request
    echo json_encode(['error' => 'Categoría no especificada.']);
    exit;
}

try {
    // 5. Preparar la consulta SQL (¡Seguridad primero!)
    // Usamos 'prepared statements' (?) para prevenir inyección SQL.
    // Unimos las tablas 'menu' (m) y 'categorias' (c)
    $sql = "SELECT m.id, m.nombre, m.descripcion, m.foto, m.precio, m.avg_rating, m.total_ratings
            FROM menuTest m
            JOIN categorias c ON m.id_cat = c.id_cat
            WHERE c.nombre_key = ?"; // El '?' es un marcador de posición

    // 6. Preparar y ejecutar la consulta
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$category_key]); // Pasamos el valor del usuario aquí

    // 7. Obtener todos los resultados
    $items = $stmt->fetchAll();

    // 8. Devolver los resultados como JSON
    echo json_encode($items);

} catch (\PDOException $e) {
    // 9. Manejo de errores de la base de datos
    http_response_code(500); // 500 Internal Server Error
    echo json_encode(['error' => 'Error al consultar la base de datos: ' . $e->getMessage()]);
}
?>