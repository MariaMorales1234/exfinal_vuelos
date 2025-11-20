<?php
    namespace App\Repositories;

    use Psr\Http\Message\ResponseInterface as Response;
    use Psr\Http\Message\ServerRequestInterface as Request;
    use App\Controllers\NaveControllers;
    use Exception;

    class NaveRepository{
        private $controller;
    
        public function __construct(){
            $this->controller = new NaveControllers();
        }
    
        public function index(Request $request, Response $response){
            try {
                $result = $this->controller->index();
                if ($result === null) {
                    $payload = json_encode([
                        'status' => 'success',
                        'message' => 'No hay naves registradas',
                        'data' => []
                    ], JSON_UNESCAPED_UNICODE);
                    $response->getBody()->write($payload);
                    return $response
                        ->withHeader('Content-Type', 'application/json; charset=utf-8')
                        ->withStatus(200);
                }
                $payload = json_encode([
                    'status' => 'success',
                    'message' => 'Naves obtenidas',
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
    
        public function detail(Request $request, Response $response, array $args){
            try {
                $result = $this->controller->detail($args['id']);
                $payload = json_encode([
                    'status' => 'success',
                    'message' => 'Nave obtenida',
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
    
        public function create(Request $request, Response $response){
            try {
                $body = $request->getBody()->getContents();
                $data = json_decode($body, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    throw new Exception("JSON invalido", 400);
                }
                if ($data === null) {
                    throw new Exception("Datos no proporcionados", 400);
                }
                $result = $this->controller->create($data);
                $payload = json_encode([
                    'status' => 'success',
                    'message' => 'Nave creada',
                    'data' => json_decode($result)
                ], JSON_UNESCAPED_UNICODE);
                $response->getBody()->write($payload);
                return $response
                    ->withHeader('Content-Type', 'application/json; charset=utf-8')
                    ->withStatus(201);
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
    
        public function update(Request $request, Response $response, array $args){
            try {
                $body = $request->getBody()->getContents();
                $data = json_decode($body, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    throw new Exception("JSON invalido", 400);
                }
                if ($data === null) {
                    throw new Exception("Datos no proporcionados", 400);
                }
                $result = $this->controller->update($args['id'], $data);
                $payload = json_encode([
                    'status' => 'success',
                    'message' => 'Nave actualizada',
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
    
        public function delete(Request $request, Response $response, array $args){
            try {
                $this->controller->delete($args['id']);
                $payload = json_encode([
                    'status' => 'success',
                    'message' => 'Nave eliminada',
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
    }
?>