<?php
    use Slim\Factory\AppFactory;

    require __DIR__ . '/../vendor/autoload.php';
    require __DIR__ . '/../app/Config/database.php';

    $app = AppFactory::create();

    // Prueba
    $app->get('/test', function ($request, $response) {
        $payload = json_encode([
            'status' => 'success',
            'message' => 'funcionando'
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type', 'application/json');
    });
    //pruebagf
    // Cargar CORS primero
    $cors = require __DIR__ . '/../app/middleware/Cors.php';
    $cors($app);
    // Cargar endpoints
    $endpoints = require __DIR__ . '/../app/endpoints/Routers.php';
    $endpoints($app);
    // Error middleware al final
    $app->addErrorMiddleware(true, true, true);
    $app->run();
?>