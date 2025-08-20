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
        Schema::create('buildings', function (Blueprint $table) {
            $table->id();
            $table->string('osm_id')->nullable();
            $table->decimal('height', 8, 2)->nullable();
            $table->string('roof_type')->nullable();
            $table->json('materials')->nullable();
            $table->timestamps();
        });

        // Add geometry column with a raw statement
        DB::statement('ALTER TABLE buildings ADD COLUMN footprint GEOMETRY(Polygon, 4326)');
        DB::statement('CREATE INDEX buildings_footprint_idx ON buildings USING GIST (footprint)');

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buildings');
    }
};
