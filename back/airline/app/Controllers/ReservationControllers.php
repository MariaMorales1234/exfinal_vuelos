<?php
    namespace App\Controllers;

    use App\Models\Reservation;
    use App\Models\Flight;
    use Exception;

    class ReservationControllers{
        public function index(){
            $reservations = Reservation::with('flight.nave')->get();
            if (count($reservations) == 0) {
                return null;
            }
            return $reservations->toJson();
        }
    
        public function detail($id){
            if (empty($id)) {
                throw new Exception("ID no proporcionado", 400);
            }
            $reservation = Reservation::with('flight.nave')->find($id);
            if (empty($reservation)) {
                throw new Exception("Reserva no encontrada", 404);
            }
            return $reservation->toJson();
        }
    
        public function getByUser($userId){
            if (empty($userId)) {
                throw new Exception("ID de usuario no proporcionado", 400);
            }
            $reservations = Reservation::with('flight.nave')
                ->where('user_id', $userId)
                ->get();
            if (count($reservations) == 0) {
                return null;
            }
            return $reservations->toJson();
        }
    
        public function create($data){
            if (empty($data['user_id']) || empty($data['flight_id'])) {
                throw new Exception("Usuario y vuelo son requeridos", 400);
            }
            // Verificar que el vuelo existe
            $flight = Flight::find($data['flight_id']);
            if (empty($flight)) {
                throw new Exception("El vuelo especificado no existe", 404);
            }
            $reservation = new Reservation();
            $reservation->user_id = $data['user_id'];
            $reservation->flight_id = $data['flight_id'];
            $reservation->status = 'activa';
            $reservation->reserved_at = date('Y-m-d H:i:s');
            $reservation->save();
            // Cargar la relación para retornar datos completos
            $reservation->load('flight.nave');
            return $reservation->toJson();
        }
    
        public function cancel($id){
            if (empty($id)) {
                throw new Exception("ID no proporcionado", 400);
            }
            $reservation = Reservation::find($id);
            if (empty($reservation)) {
                throw new Exception("Reserva no encontrada", 404);
            }
            if ($reservation->status === 'cancelada') {
                throw new Exception("La reserva ya está cancelada", 400);
            }
            $reservation->status = 'cancelada';
            $reservation->save();
            $reservation->load('flight.nave');
            return $reservation->toJson();
        }
    
        public function delete($id){
            if (empty($id)) {
                throw new Exception("ID no proporcionado", 400);
            }
            $reservation = Reservation::find($id);
            if (empty($reservation)) {
                throw new Exception("Reserva no encontrada", 404);
            }
            if (!$reservation->delete()) {
                throw new Exception("Error al eliminar reserva", 500);
            }
            return true;
        }
    }
?>