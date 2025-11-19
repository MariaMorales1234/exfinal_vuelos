<?php 
    namespace App\Middleware;

    use Psr\Http\Message\ServerRequestInterface as Request;
    use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
    use Psr\Http\Message\ResponseInterface as Response;
    use Slim\Psr7\Response as SlimResponse;

    class Role{
        private $allowedRoles;
    
        public function __construct(array $allowedRoles){
            $this->allowedRoles = $allowedRoles;
        }
    
        public function __invoke(Request $request, RequestHandler $handler): Response{
            $user = $request->getAttribute('user');
            if (!$user || !in_array($user->role, $this->allowedRoles)) {
                $response = new SlimResponse();
                $response->getBody()->write(json_encode([
                    'status' => 'error',
                    'message' => 'No tienes permisos para acceder a este recurso',
                    'data' => null
                ], JSON_UNESCAPED_UNICODE));
                return $response
                    ->withHeader('Content-Type', 'application/json; charset=utf-8')
                    ->withStatus(403);
            }
            return $handler->handle($request);
        }
    }
?>