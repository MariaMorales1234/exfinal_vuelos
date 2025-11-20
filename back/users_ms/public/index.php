<?php
    use Slim\Factory\AppFactory;

    require __DIR__ . '/../vendor/autoload.php';
    require __DIR__ . '/../app/Config/database.php';

    $app = AppFactory::create();

    $app->get('/test', function ($request, $response) {
        $payload = json_encode([
            'status' => 'success',
            'message' => 'funcionando'
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type', 'application/json');
    });
    $cors = require __DIR__ . '/../app/middleware/Cors.php';
    $cors($app);

    $endpoints = require __DIR__ . '/../app/endpoints/Routes.php';
    $endpoints($app);

    $app->addErrorMiddleware(true, true, true);
    $app->run();
?>