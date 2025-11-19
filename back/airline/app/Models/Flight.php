<?php
    namespace App\Models;

    use Illuminate\Database\Eloquent\Model;

    class Flight extends Model{
        protected $table  = 'flights';
        public $timestamps = false;
        public function nave(){
            return $this->belongsTo(Nave::class, 'nave_id');
        }
    }
?>