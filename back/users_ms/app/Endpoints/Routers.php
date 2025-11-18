<?php 
    use App\Repositories\AuthRepository;
    use App\Repositories\UserRepository;
    use App\Middleware\Auth;
    use App\Middleware\Role;
    use Slim\Routing\RouteCollectorProxy;

    return function ($app) {
        // Rutas públicas de autenticación
        $app->post('/auth/login', function ($request, $response) {
            $res = new AuthRepository();
            return $res->login($request, $response);
        });
        // Rutas protegidas
        $app->group('', function (RouteCollectorProxy $group) {
            // Validar token
            $group->get('/auth/validate', function ($request, $response) {
                $res = new AuthRepository();
                return $res->validate($request, $response);
            });
            // Cerrar sesión
            $group->post('/auth/logout', function ($request, $response) {
                $res = new AuthRepository();
                return $res->logout($request, $response);
            });
            // Rutas de usuarios (solo administrador)
            $group->group('/users', function (RouteCollectorProxy $group) {
                $group->get('', function ($request, $response) {
                    $res = new UserRepository();
                    return $res->index($request, $response);
                });
                $group->get('/{id}', function ($request, $response, $args) {
                    $res = new UserRepository();
                    return $res->detail($request, $response, $args);
                });
                $group->post('', function ($request, $response) {
                    $res = new UserRepository();
                    return $res->create($request, $response);
                });
                $group->put('/{id}', function ($request, $response, $args) {
                    $res = new UserRepository();
                    return $res->update($request, $response, $args);
                });
                $group->delete('/{id}', function ($request, $response, $args) {
                    $res = new UserRepository();
                    return $res->delete($request, $response, $args);
                });
            })->add(new Role(['administrador']));
        })->add(new Auth());
    };
?>