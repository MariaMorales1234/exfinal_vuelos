<?php
    namespace App\Controllers;

    use App\Models\Flight;
    use App\Models\Nave;
    use Exception;

    class FlightControllers {
        function index() {
            $flights = Flight::with('nave')->get();
            if (count($flights) == 0) {
                return null;
            }
            return $flights->toJson();
        }

        function detail($id){
            if (empty($id)) {
                throw new Exception("ID null", 400);
            }
            $flight = Flight::with('nave')->find($id);
            if (empty($flight)) {
                throw new Exception("Flight null", 404);
            }
            return $flight->toJson();
        }

        function search($params){
            $query = Flight::with('nave');
            if (!empty($params['origin'])) {
                $query->where('origin', 'like', '%' . $params['origin'] . '%');
            }
            if (!empty($params['destination'])) {
                $query->where('destination', 'like', '%' . $params['destination'] . '%');
            }
            if (!empty($params['date'])) {
                $query->whereDate('departure', $params['date']);
            }
            $flights = $query->get();
            if (count($flights) == 0) {
                return null;
            }
            return $flights->toJson();
        }

        function create($data){
            if (empty($data['nave_id']) || empty($data['origin']) || empty($data['destination']) 
            || empty($data['departure']) || empty($data['arrival']) || empty($data['price'])) {
                throw new Exception("Nave, origen, destino, salida, llegada y precio son requeridos", 400);
            }
            // Verificar que la nave existe
            $nave = Nave::find($data['nave_id']);
            if (empty($nave)) {
                throw new Exception("La nave especificada no existe", 404);
            }
            $flight = new Flight();
            $flight->nave_id = $data['nave_id'];
            $flight->origin = $data['origin'];
            $flight->destination = $data['destination'];
            $flight->departure = $data['departure'];
            $flight->arrival = $data['arrival'];
            $flight->price = $data['price'];
            $flight->save();
            return $flight->toJson();
        }

        function update($id, $data){
            if (empty($id)) {
                throw new Exception("ID null", 400);
            }
            $flight = Flight::find($id);
            if (empty($flight)) {
                throw new Exception("Flight null", 404);
            }
            if (!empty($data['nave_id'])) {
                // Verificar que la nave existe
                $nave = Nave::find($data['nave_id']);
                if (empty($nave)) {
                    throw new Exception("La nave especificada no existe", 404);
                }
                $flight->nave_id = $data['nave_id'];
            }
            if (!empty($data['origin'])) {
                $flight->origin = $data['origin'];
            }
            if (!empty($data['destination'])) {
                $flight->destination = $data['destination'];
            }
            if (!empty($data['departure'])) {
                $flight->departure = $data['departure'];
            }
            if (!empty($data['arrival'])) {
                $flight->arrival = $data['arrival'];
            }
            if (!empty($data['price'])) {
                $flight->price = $data['price'];
            }
            $flight->save();
            return $flight->toJson();
        }

        function delete($id){
            if (empty($id)) {
                throw new Exception("ID null", 400);
            }
            $flight = Flight::find($id);
            if (empty($flight)) {
                throw new Exception("Flight null", 404);
            }
            if (!$flight->delete()) {
                throw new Exception("Error al eliminar vuelo", 500);
            }
            return true;
        }
    }
?>