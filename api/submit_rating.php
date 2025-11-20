<?php
// api/submit_rating.php

require 'db_config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'));

if (
    !isset($data->id_menu_item) ||
    !isset($data->rating) || empty($data->rating) ||
    !isset($data->nombre) || empty($data->nombre)
) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Datos incompletos.']);
    exit;
}

$id_menu_item = $data->id_menu_item;
$rating = (int) $data->rating;
$nombre = filter_var($data->nombre, FILTER_UNSAFE_RAW);
$comentario = isset($data->comentario) ? filter_var($data->comentario, FILTER_UNSAFE_RAW) : null;

if ($rating < 1 || $rating > 5) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Calificación inválida.']);
    exit;
}

// =============================================
// ===== INICIO DE LA CORRECCIÓN =====
// =============================================
try {
    $pdo->beginTransaction();

    // 1. Insertar la nueva calificación (Sin cambios)
    $sql_insert = "INSERT INTO calificaciones (id_menu_item, rating, nombre_cliente, comentario) 
                   VALUES (?, ?, ?, ?)";
    $stmt_insert = $pdo->prepare($sql_insert);
    $stmt_insert->execute([$id_menu_item, $rating, $nombre, $comentario]);

    // 2. Recalcular el promedio (SQL CORREGIDO)
    // Usamos placeholders únicos: :id_avg, :id_count, :id_where
    $sql_update = "UPDATE menuTest
                   SET 
                       avg_rating = (SELECT AVG(rating) FROM calificaciones WHERE id_menu_item = :id_avg),
                       total_ratings = (SELECT COUNT(*) FROM calificaciones WHERE id_menu_item = :id_count)
                   WHERE id = :id_where";

    $stmt_update = $pdo->prepare($sql_update);

    // Y pasamos los 3 parámetros en el execute
    $stmt_update->execute([
        'id_avg' => $id_menu_item,
        'id_count' => $id_menu_item,
        'id_where' => $id_menu_item
    ]);

    $pdo->commit();

    // 3. Devolver la nueva calificación promedio (Sin cambios)
    $sql_select = "SELECT avg_rating, total_ratings FROM menuTest WHERE id = ?";
    $stmt_select = $pdo->prepare($sql_select);
    $stmt_select->execute([$id_menu_item]);
    $new_data = $stmt_select->fetch();

    echo json_encode(['success' => true, 'new_data' => $new_data]);

} catch (\PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    // Devolvemos el mensaje de error de SQL para depurar
    echo json_encode(['success' => false, 'error' => 'Error de base de datos: ' . $e->getMessage()]);
}
// =============================================
// ===== FIN DE LA CORRECCIÓN =====
// =============================================
?>