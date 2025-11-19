<?php
    use Slim\Factory\AppFactory;

    require __DIR__ . '/../vendor/autoload.php';
    require __DIR__ . '/../app/Config/database.php';

    $app = AppFactory::create();

    $cors = require __DIR__ . '/../app/middleware/Cors.php';
    $cors($app);

    $naveRoutes = require __DIR__ . '/../app/endpoints/NaveRouters.php';
    $naveRoutes($app);

    $flightRoutes = require __DIR__ . '/../app/endpoints/FlightRouters.php';
    $flightRoutes($app);

    // Cuando agregues reservas:
    // $reservationRoutes = require __DIR__ . '/../app/endpoints/ReservationRoutes.php';
    // $reservationRoutes($app);

    $app->addErrorMiddleware(true, true, true);

    $app->run();
?>