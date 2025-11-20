<?php
    use App\Repositories\ReservationRepository;
    use App\Middleware\Auth;
    use App\Middleware\Role;
    use Slim\Routing\RouteCollectorProxy;

    return function ($app) {
        // Rutas de reservas (solo gestor)
        $app->group('/reservations', function (RouteCollectorProxy $group) {
            // Listar todas las reservas
            $group->get('', function ($request, $response) {
                $res = new ReservationRepository();
                return $res->index($request, $response);
            });
            // Ver reserva específica
            $group->get('/{id}', function ($request, $response, $args) {
                $res = new ReservationRepository();
                return $res->detail($request, $response, $args);
            });
            // Obtener reservas por usuario
            $group->get('/user/{userId}', function ($request, $response, $args) {
                $res = new ReservationRepository();
                return $res->getByUser($request, $response, $args);
            });
            // Crear reserva
            $group->post('', function ($request, $response) {
                $res = new ReservationRepository();
                return $res->create($request, $response);
            });
            // Cancelar reserva
            $group->patch('/{id}/cancel', function ($request, $response, $args) {
                $res = new ReservationRepository();
                return $res->cancel($request, $response, $args);
            });
            // Eliminar reserva
            $group->delete('/{id}', function ($request, $response, $args) {
                $res = new ReservationRepository();
                return $res->delete($request, $response, $args);
            });
        })->add(new Role(['gestor', 'administrador']))->add(new Auth());
    };
?>