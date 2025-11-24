<?php
    use App\Repositories\FlightRepository;
    use App\Middleware\Auth;
    use App\Middleware\Role;
    use Slim\Routing\RouteCollectorProxy;

    return function ($app) {
        $app->group('/flights', function (RouteCollectorProxy $group) {
            $group->get('', function ($request, $response) {
                $res = new FlightRepository();
                return $res->index($request, $response);
            });
            $group->get('/search', function($request, $response){
                $res = new FlightRepository();
                return $res->search($request, $response);
            });
            $group->get('/{id}', function ($request, $response, $args) {
                $res = new FlightRepository();
                return $res->detail($request, $response, $args);
            });
            $group->post('', function ($request, $response) {
                $res = new FlightRepository();
                return $res->create($request, $response);
            });
            $group->put('/{id}', function ($request, $response, $args) {
                $res = new FlightRepository();
                return $res->update($request, $response, $args);
            });
            $group->delete('/{id}', function ($request, $response, $args) {
                $res = new FlightRepository();
                return $res->delete($request, $response, $args);
            });
        })->add(new Role(['administrador']))->add(new Auth());
    };
?>