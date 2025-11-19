<?php
    namespace App\Controllers;

    use App\Models\Nave;
    use Exception;

    class NaveControllers {
        public function index(){
            $naves = Nave::all();
            if (count($naves) == 0) {
                return null;
            }
            return $naves->toJson();
        }
    
        public function detail($id){
            if (empty($id)) {
                throw new Exception("ID no proporcionado", 400);
            }
            $nave = Nave::find($id);
            if (empty($nave)) {
                throw new Exception("Nave no encontrada", 404);
            }
            return $nave->toJson();
        }
    
        public function create($data){
            if (empty($data['name']) || empty($data['capacity']) || empty($data['model'])) {
                throw new Exception("Nombre, capacidad y modelo son requeridos", 400);
            }
            $nave = new Nave();
            $nave->name = $data['name'];
            $nave->capacity = $data['capacity'];
            $nave->model = $data['model'];
            $nave->save();
            return $nave->toJson();
        }
    
        public function update($id, $data){
            if (empty($id)) {
                throw new Exception("ID no proporcionado", 400);
            }
            $nave = Nave::find($id);
            if (empty($nave)) {
                throw new Exception("Nave no encontrada", 404);
            }
            if (!empty($data['name'])) {
                $nave->name = $data['name'];
            }
            if (!empty($data['capacity'])) {
                $nave->capacity = $data['capacity'];
            }
            if (!empty($data['model'])) {
                $nave->model = $data['model'];
            }
            $nave->save();
            return $nave->toJson();
        }
    
        public function delete($id){
            if (empty($id)) {
                throw new Exception("ID no proporcionado", 400);
            }
            $nave = Nave::find($id);
            if (empty($nave)) {
                throw new Exception("Nave no encontrada", 404);
            }
            if (!$nave->delete()) {
                throw new Exception("Error al eliminar nave", 500);
            }
            return true;
        }
    }
?>