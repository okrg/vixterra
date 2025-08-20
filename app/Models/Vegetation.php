<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vegetation extends Model
{
    use HasFactory;

    protected $table = 'vegetation';

    protected $fillable = [
        'type',
        'model_path',
        'position', // This is a PostGIS geometry field
    ];

    protected $casts = [
        // 'position' => \Mstaack\LaravelPostgis\Casts\PointCast::class, // Example with laravel-postgis
    ];
}
