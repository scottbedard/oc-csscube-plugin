<?php namespace Bedard\Cube\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class CreateSolvesTable extends Migration
{

    public function up()
    {
        Schema::create('bedard_cube_solves', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name')->default('');
            $table->decimal('time', 10, 3)->unsigned()->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('bedard_cube_solves');
    }

}
