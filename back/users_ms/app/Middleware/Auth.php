<?php 
    namespace App\Middleware;

    use Psr\Http\Message\ServerRequestInterface as Request;
    use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
    use Psr\Http\Message\ResponseInterface as Response;
    use App\Models\User;
    use Slim\Psr7\Response as SlimResponse;

    class Auth{
        public function __invoke(Request $request, RequestHandler $handler): Response{
            $token = $request->getHeaderLine('Authorization');
            if (empty($token)) {
                $response = new SlimResponse();
                $response->getBody()->write(json_encode([
                    'status' => 'error',
                    'message' => 'Token no proporcionado',
                    'data' => null
                ], JSON_UNESCAPED_UNICODE));
                return $response
                    ->withHeader('Content-Type', 'application/json; charset=utf-8')
                    ->withStatus(401);
            }
            $token = str_replace('Bearer ', '', $token);
            $user = User::where('token', $token)->first();
            if (empty($user)) {
                $response = new SlimResponse();
                $response->getBody()->write(json_encode([
                    'status' => 'error',
                    'message' => 'Token invalido',
                    'data' => null
                ], JSON_UNESCAPED_UNICODE));
                return $response
                    ->withHeader('Content-Type', 'application/json; charset=utf-8')
                    ->withStatus(401);
            }
            $request = $request->withAttribute('user', $user);
            return $handler->handle($request);
        }
    }
?>