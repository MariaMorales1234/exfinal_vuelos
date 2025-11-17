<?php 
    namespace App\Controllers;

    use App\Models\User;
    use Exception;

    class UsersControllers{
        public function index(){
            $rows = User::all();
            if (count($rows) == 0) {
                return null;
            }
            return $rows->toJson();
        }
    
        public function detail($id){
            if (empty($id)) {
                throw new Exception("ID null", 2);
            }
            $user = User::find($id);
            if (empty($user)) {
                throw new Exception("User null", 1);
            }
            return $user->toJson();
        }
    
        public function create($data){
            if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
                throw new Exception("Nombre, email y contraseña son requeridos", 400);
            }
            // Verificar si el email ya existe
            $existEmail = User::where('email', $data['email'])->first();
            if (!empty($existEmail)) {
                throw new Exception("El email ya está registrado", 409);
            }
            $user = new User();
            $user->name = $data['name'];
            $user->email = $data['email'];
            $user->password = $data['password'];
            $user->role = $data['role'] ?? 'gestor';
            $user->save();
            return $user->toJson();
        }
    
        public function update($id, $data){
            if (empty($id)) {
                throw new Exception("ID null", 2);
            }
            $user = User::find($id);
            if (empty($user)) {
                throw new Exception("User null", 1);
            }
            if (!empty($data['name'])) {
                $user->name = $data['name'];
            }
            if (!empty($data['email'])) {
                $user->email = $data['email'];
            }
            if (!empty($data['password'])) {
                $user->password = $data['password'];
            }
            if (!empty($data['role'])) {
                $user->role = $data['role'];
            }
            $user->save();
            return $user->toJson();
        }
    
        public function delete($id){
            if (empty($id)) {
                throw new Exception("ID null", 2);
            }
            $user = User::find($id);
            if (empty($user)) {
                throw new Exception("User null", 1);
            }
            if (!$user->delete()) {
                throw new Exception("Error al eliminar usuario", 500);
            }
            return true;
        }
    }
?>