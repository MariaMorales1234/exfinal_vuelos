<?php
    namespace App\Repositories;

    use Psr\Http\Message\ResponseInterface as Response;
    use Psr\Http\Message\ServerRequestInterface as Request;
    use App\Controllers\AuthControllers;
    use Exception;

    class AuthRepository{
        private $controller;
    
        public function __construct(){
            $this->controller = new AuthControllers();
        }
    
        public function login(Request $request, Response $response){
            try {
                $data = json_decode($request->getBody()->getContents(), true);
                $result = $this->controller->login($data);
                $payload = json_encode([
                    'status' => 'success',
                    'message' => 'Has inciado sesion',
                    'data' => json_decode($result)
                ], JSON_UNESCAPED_UNICODE);
                $response->getBody()->write($payload);
                return $response
                    ->withHeader('Content-Type', 'application/json; charset=utf-8')
                    ->withStatus(200);
            } catch (Exception $e) {
                $statusCode = $e->getCode() >= 400 && $e->getCode() < 600 ? $e->getCode() : 500;
                $payload = json_encode([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                    'data' => null
                ], JSON_UNESCAPED_UNICODE);
                $response->getBody()->write($payload);
                return $response
                    ->withHeader('Content-Type', 'application/json; charset=utf-8')
                    ->withStatus($statusCode);
            }
        }
    
        public function logout(Request $request, Response $response){
            try {
                $user = $request->getAttribute('user');
                $this->controller->logout($user->id);
                $payload = json_encode([
                    'status' => 'success',
                    'message' => 'Sesion cerrada exitosamente',
                    'data' => null
                ], JSON_UNESCAPED_UNICODE);
                $response->getBody()->write($payload);
                return $response
                    ->withHeader('Content-Type', 'application/json; charset=utf-8')
                    ->withStatus(200);
            } catch (Exception $e) {
                $statusCode = $e->getCode() >= 400 && $e->getCode() < 600 ? $e->getCode() : 500;
                $payload = json_encode([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                    'data' => null
                ], JSON_UNESCAPED_UNICODE);
                $response->getBody()->write($payload);
                return $response
                    ->withHeader('Content-Type', 'application/json; charset=utf-8')
                    ->withStatus($statusCode);
            }
        }
    
        public function validate(Request $request, Response $response){
            try {
                $user = $request->getAttribute('user');
                $result = $this->controller->validate($user->id);
                $payload = json_encode([
                    'status' => 'success',
                    'message' => 'Token valido',
                    'data' => json_decode($result)
                ], JSON_UNESCAPED_UNICODE);
                $response->getBody()->write($payload);
                return $response
                    ->withHeader('Content-Type', 'application/json; charset=utf-8')
                    ->withStatus(200);
            } catch (Exception $e) {
                $statusCode = $e->getCode() >= 400 && $e->getCode() < 600 ? $e->getCode() : 500;
                $payload = json_encode([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                    'data' => null
                ], JSON_UNESCAPED_UNICODE);
                $response->getBody()->write($payload);
                return $response
                    ->withHeader('Content-Type', 'application/json; charset=utf-8')
                    ->withStatus($statusCode);
            }
        }
    }
?>