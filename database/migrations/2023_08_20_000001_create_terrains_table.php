<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('terrains', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('heightmap_path');
            $table->timestamps();
        });

        // Add geometry column with a raw statement
        DB::statement('ALTER TABLE terrains ADD COLUMN area GEOMETRY(Polygon, 4326)');
        DB::statement('CREATE INDEX terrains_area_idx ON terrains USING GIST (area)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('terrains');
    }
};
