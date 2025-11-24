<?php
    use App\Repositories\ReservationRepository;
    use App\Middleware\Auth;
    use App\Middleware\Role;
    use Slim\Routing\RouteCollectorProxy;

    return function ($app) {
        $app->group('/reservations', function (RouteCollectorProxy $group) {
            $group->get('', function ($request, $response) {
                $res = new ReservationRepository();
                return $res->index($request, $response);
            });
            $group->get('/{id}', function ($request, $response, $args) {
                $res = new ReservationRepository();
                return $res->detail($request, $response, $args);
            });
            $group->get('/user/{userId}', function ($request, $response, $args) {
                $res = new ReservationRepository();
                return $res->getByUser($request, $response, $args);
            });
            $group->post('', function ($request, $response) {
                $res = new ReservationRepository();
                return $res->create($request, $response);
            });
            $group->patch('/{id}/cancel', function ($request, $response, $args) {
                $res = new ReservationRepository();
                return $res->cancel($request, $response, $args);
            });
            $group->delete('/{id}', function ($request, $response, $args) {
                $res = new ReservationRepository();
                return $res->delete($request, $response, $args);
            });
        })->add(new Role(['gestor', 'administrador']))->add(new Auth());
    };
?>