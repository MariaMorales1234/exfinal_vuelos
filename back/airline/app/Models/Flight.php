<?php
    namespace App\Models;

    use Illuminate\Database\Eloquent\Model;

    class Flight extends Model{
        protected $table  = 'flights';
        public $timestamps = true;
        public function nave(){
            return $this->belongsTo(Nave::class, 'nave_id');
        }
        public function reservations(){
            return $this->hasMany(Reservation::class, 'flight_id');
        }
    }
?>