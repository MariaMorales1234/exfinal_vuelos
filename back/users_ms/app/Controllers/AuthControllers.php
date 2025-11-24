<?php
    namespace App\Controllers;

    use App\Models\User;
    use Exception;

    class AuthControllers{
        public function login($data){
            if (empty($data['email']) || empty($data['password'])) {
                throw new Exception("Email y contrasena son requeridos", 400);
            }
            $user = User::where('email', $data['email'])->first();
            if (empty($user) || $user->password !== $data['password']) {
                throw new Exception("Credenciales invalidas", 401);
            }
            // Generar token aleatorio 
            $token = bin2hex(random_bytes(4));
            $user->token = $token;
            $user->save();
            return json_encode([
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role
                ]
            ]);
        }
    
        public function logout($userId){
            if (empty($userId)) {
                throw new Exception("ID null", 400);
            }
            $user = User::find($userId);
            if (empty($user)) {
                throw new Exception("User null", 404);
            }
            $user->token = null;
            $user->save();
            return true;
        }
    
        public function validate($userId){
            if (empty($userId)) {
                throw new Exception("ID null", 400);
            }
            $user = User::find($userId);
            if (empty($user)) {
                throw new Exception("User null", 404);
            }
            return json_encode([
                'valid' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role
                ]
            ]);
        }
    }
?>