<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Terrain extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'heightmap_path',
        'area', // This is a PostGIS geometry field
    ];

    protected $casts = [
        // 'area' => \Mstaack\LaravelPostgis\Casts\PolygonCast::class, // Example with laravel-postgis
    ];
}
