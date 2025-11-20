<?php
    namespace App\Middleware;

    use Psr\Http\Message\ServerRequestInterface as Request;
    use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
    use Psr\Http\Message\ResponseInterface as Response;
    use Slim\Psr7\Response as SlimResponse;

    class Auth{
        private $userServiceUrl = 'http://127.0.0.1:8000'; // URL del microservicio de usuarios
    
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
            // Remover "Bearer " si existe
            $token = str_replace('Bearer ', '', $token);
            // Validar token con el microservicio de usuarios
            $ch = curl_init($this->userServiceUrl . '/auth/validate');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer ' . $token,
                'Content-Type: application/json'
            ]);
            $result = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            if ($httpCode !== 200) {
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
            // Decodificar respuesta del microservicio de usuarios
            $userData = json_decode($result, true);
            if (!isset($userData['data']['user'])) {
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
            // Agregar el usuario al request para uso posterior
            $request = $request->withAttribute('user', (object)$userData['data']['user']);
            return $handler->handle($request);
        }
    }
?>