<?php
// api/save_message.php

// 1. Incluir nuestra conexión a la base de datos
require 'db_config.php';

// 2. Definir que la respuesta será en formato JSON
header('Content-Type: application/json');

// 3. Leer los datos JSON enviados desde el front-end (app.js)
// Usamos php://input porque estamos enviando JSON, no un formulario POST tradicional
$data = json_decode(file_get_contents('php://input'));

// 4. Validar los datos
if (
    !isset($data->name) || empty($data->name) ||
    !isset($data->email) || empty($data->email) ||
    !isset($data->message) || empty($data->message)
) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'error' => 'Datos incompletos.']);
    exit;
}

// 5. Preparar la consulta SQL para insertar los datos de forma segura
try {
    $sql = "INSERT INTO mensajes (nombre, email, mensaje) VALUES (?, ?, ?)";

    $stmt = $pdo->prepare($sql);

    // 6. Ejecutar la consulta con los datos recibidos
    $stmt->execute([
        $data->name,
        $data->email,
        $data->message
    ]);

    // 7. Enviar una respuesta de éxito al front-end
    echo json_encode(['success' => true, 'message' => 'Mensaje guardado correctamente.']);

} catch (\PDOException $e) {
    // 8. Manejo de errores de la base de datos
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'error' => 'Error al guardar el mensaje: ' . $e->getMessage()]);
}
?>