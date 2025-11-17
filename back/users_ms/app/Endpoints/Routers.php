<?php 
    use App\Repositories\AuthRepository;
    use App\Repositories\UserRepository;
    use App\Middleware\Auth;
    use App\Middleware\Role;
    use Slim\Routing\RouteCollectorProxy;

    return function ($app) {
        // Rutas públicas de autenticación
        $app->post('/auth/login', [AuthRepository::class, 'login']);
        // Rutas protegidas
        $app->group('', function (RouteCollectorProxy $group) {
            // Validar token
            $group->get('/auth/validate', [AuthRepository::class, 'validate']);
            // Cerrar sesión
            $group->post('/auth/logout', [AuthRepository::class, 'logout']);
            // Rutas de usuarios (solo administrador)
            $group->group('/user', function (RouteCollectorProxy $group) {
                $group->get('', [UserRepository::class, 'index']);
                $group->get('/{id}', [UserRepository::class, 'show']);
                $group->post('', [UserRepository::class, 'store']);
                $group->put('/{id}', [UserRepository::class, 'update']);
                $group->delete('/{id}', [UserRepository::class, 'delete']);
            })->add(new Role(['administrador']));
        })->add(new Auth());
    };
?>