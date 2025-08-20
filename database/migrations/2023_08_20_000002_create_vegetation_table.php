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
        Schema::create('vegetation', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('model_path')->nullable();
            $table->timestamps();
        });

        // Add geometry column with a raw statement
        DB::statement('ALTER TABLE vegetation ADD COLUMN position GEOMETRY(Point, 4326)');
        DB::statement('CREATE INDEX vegetation_position_idx ON vegetation USING GIST (position)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vegetation');
    }
};
