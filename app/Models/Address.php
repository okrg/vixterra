<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'address',
        'location', // This is a PostGIS geometry field
    ];

    protected $casts = [
        // 'location' => \Mstaack\LaravelPostgis\Casts\PointCast::class, // Example with laravel-postgis
    ];
}
