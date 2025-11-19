<?php
    use Slim\Factory\AppFactory;

    require __DIR__ . '/../vendor/autoload.php';

    $app = AppFactory::create();

    $cors = require __DIR__ . '/../app/middleware/Cors.php';
    $cors($app);

    // Cargar rutas por entidad
    $naveRoutes = require __DIR__ . '/../app/endpoints/NaveRoutes.php';
    $naveRoutes($app);

    // Cuando agregues vuelos:
    // $flightRoutes = require __DIR__ . '/../app/endpoints/FlightRoutes.php';
    // $flightRoutes($app);

    // Cuando agregues reservas:
    // $reservationRoutes = require __DIR__ . '/../app/endpoints/ReservationRoutes.php';
    // $reservationRoutes($app);

    // Error middleware al final
    $app->addErrorMiddleware(true, true, true);

    $app->run();
?>