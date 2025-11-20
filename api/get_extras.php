<?php
// api/get_extras.php

require 'db_config.php';
header('Content-Type: application/json');

try {
    $sql = "SELECT id_extra, nombre, precio FROM extras ORDER BY precio ASC";
    $stmt = $pdo->query($sql);
    $extras = $stmt->fetchAll();

    echo json_encode($extras);

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al obtener los extras: ' . $e->getMessage()]);
}
?>