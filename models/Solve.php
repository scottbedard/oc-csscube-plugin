<?php namespace Bedard\Cube\Models;

use Carbon\Carbon;
use Model;

/**
 * Solve Model
 */
class Solve extends Model
{

    /**
     * @var string The database table used by the model.
     */
    public $table = 'bedard_cube_solves';

    /**
     * @var array Guarded fields
     */
    protected $guarded = ['*'];

    /**
     * @var array Fillable fields
     */
    protected $fillable = [
        'name',
        'time',
    ];

    public function getTimeSinceAttribute()
    {
        return Carbon::parse($this->created_at)->diffForHumans();
    }
}
