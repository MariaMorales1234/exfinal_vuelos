<?php
    namespace App\Models;

    use Illuminate\Database\Eloquent\Model;

    class Reservation extends Model {
        protected $table = 'reservations';
        public $timestamps = true;
        public function flight(){
            return $this->belongsTo(Flight::class, 'flight_id');
        }
    }
?>