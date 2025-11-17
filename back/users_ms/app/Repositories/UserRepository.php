<?php 
    namespace App\Repositories;

    use App\Controllers\UsersControllers;
    use Exception;
    use Psr\Http\Message\ResponseInterface as Response;
    use Psr\Http\Message\ServerRequestInterface as Request;

    class UserRepository{
        private $controller;
    
        public function __construct(){
            $this->controller = new UsersControllers();
        }
    
        public function index(Request $request, Response $response){
            try {
                $result = $this->controller->index();
                if ($result === null) {
                    $response->getBody()->write(json_encode([
                        'status' => 'success',
                        'message' => 'No hay usuarios registrados',
                        'data' => []
                    ]));
                    return $response
                        ->withHeader('Content-Type', 'application/json')
                        ->withStatus(200);
                }
                $response->getBody()->write(json_encode([
                    'status' => 'success',
                    'message' => 'Usuarios obtenidos correctamente',
                    'data' => json_decode($result)
                ]));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(200);
                
            } catch (Exception $e) {
                $statusCode = $e->getCode() >= 400 && $e->getCode() < 600 ? $e->getCode() : 500;
            
                $response->getBody()->write(json_encode([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                    'data' => null
                ]));
            
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus($statusCode);
            }
        }
    
        public function detail(Request $request, Response $response, array $args){
            try {
                $result = $this->controller->detail($args['id']);
                $response->getBody()->write(json_encode([
                    'status' => 'success',
                    'message' => 'Usuario obtenido correctamente',
                    'data' => json_decode($result)
                ]));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(200);
            } catch (Exception $e) {
                $statusCode = $e->getCode() >= 400 && $e->getCode() < 600 ? $e->getCode() : 500;
                $response->getBody()->write(json_encode([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                    'data' => null
                ]));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus($statusCode);
            }
        }
    
        public function create(Request $request, Response $response){
            try {
                $data = json_decode($request->getBody()->getContents(), true);
                $result = $this->controller->create($data);
                $response->getBody()->write(json_encode([
                    'status' => 'success',
                    'message' => 'Usuario creado exitosamente',
                    'data' => json_decode($result)
                ]));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(201);
            } catch (Exception $e) {
                $statusCode = $e->getCode() >= 400 && $e->getCode() < 600 ? $e->getCode() : 500;
                $response->getBody()->write(json_encode([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                    'data' => null
                ]));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus($statusCode);
            }
        }
    
        public function update(Request $request, Response $response, array $args){
            try {
                $data = json_decode($request->getBody()->getContents(), true);
                $result = $this->controller->update($args['id'], $data);
                $response->getBody()->write(json_encode([
                    'status' => 'success',
                    'message' => 'Usuario actualizado exitosamente',
                    'data' => json_decode($result)
                ]));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(200);
            } catch (Exception $e) {
                $statusCode = $e->getCode() >= 400 && $e->getCode() < 600 ? $e->getCode() : 500;
                $response->getBody()->write(json_encode([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                    'data' => null
                ]));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus($statusCode);
            }
        }
    
        public function delete(Request $request, Response $response, array $args){
            try {
                $this->controller->delete($args['id']);
                $response->getBody()->write(json_encode([
                    'status' => 'success',
                    'message' => 'Usuario eliminado exitosamente',
                    'data' => null
                ]));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(200);
            } catch (Exception $e) {
                $statusCode = $e->getCode() >= 400 && $e->getCode() < 600 ? $e->getCode() : 500;
                $response->getBody()->write(json_encode([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                    'data' => null
                ]));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus($statusCode);
            }
        }
    }
?>