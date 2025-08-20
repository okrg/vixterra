<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Building extends Model
{
    use HasFactory;

    protected $fillable = [
        'osm_id',
        'height',
        'roof_type',
        'materials',
        'footprint', // This is a PostGIS geometry field
    ];

    protected $casts = [
        'materials' => 'json',
        // 'footprint' => \Mstaack\LaravelPostgis\Casts\PolygonCast::class, // Example with laravel-postgis
    ];
}
