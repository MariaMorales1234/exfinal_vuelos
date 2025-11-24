<?php
    use App\Repositories\NaveRepository;
    use App\Middleware\Auth;
    use App\Middleware\Role;
    use Slim\Routing\RouteCollectorProxy;

    return function ($app) {
        $app->group('/naves', function (RouteCollectorProxy $group) {
            $group->get('', function ($request, $response) {
                $res = new NaveRepository();
                return $res->index($request, $response);
            });
            $group->get('/{id}', function ($request, $response, $args) {
                $res = new NaveRepository();
                return $res->detail($request, $response, $args);
            });
            $group->post('', function ($request, $response) {
                $res = new NaveRepository();
                return $res->create($request, $response);
            });
            $group->put('/{id}', function ($request, $response, $args) {
                $res = new NaveRepository();
                return $res->update($request, $response, $args);
            });
            $group->delete('/{id}', function ($request, $response, $args) {
                $res = new NaveRepository();
                return $res->delete($request, $response, $args);
            });
        })->add(new Role(['administrador']))->add(new Auth());
    };
?>