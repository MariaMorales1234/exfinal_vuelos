<?php
    use App\Repositories\FlightRepository;
    use App\Middleware\Auth;
    use App\Middleware\Role;
    use Slim\Routing\RouteCollectorProxy;

    return function ($app) {
        $app->group('/flights', function (RouteCollectorProxy $group) {
            // Listar todos los vuelos
            $group->get('', function ($request, $response) {
                $res = new FlightRepository();
                return $res->index($request, $response);
            });
            // Buscar vuelos por origen, destino o fecha
            $group->get('/search', function($request, $response){
                $res = new FlightRepository();
                return $res->search($request, $response);
            });
            // Ver vuelo específico
            $group->get('/{id}', function ($request, $response, $args) {
                $res = new FlightRepository();
                return $res->detail($request, $response, $args);
            });
            // Crear vuelo
            $group->post('', function ($request, $response) {
                $res = new FlightRepository();
                return $res->create($request, $response);
            });
            // Actualizar vuelo
            $group->put('/{id}', function ($request, $response, $args) {
                $res = new FlightRepository();
                return $res->update($request, $response, $args);
            });
            // Eliminar vuelo
            $group->delete('/{id}', function ($request, $response, $args) {
                $res = new FlightRepository();
                return $res->delete($request, $response, $args);
            });
        })->add(new Role(['administrador']))->add(new Auth());
    };
?>