<?php namespace Bedard\Cube\Components;

use Bedard\Cube\Models\Solve;
use Cms\Classes\ComponentBase;

class Cube extends ComponentBase
{

    /**
     * Identify the six cube faces (Up, Left, Front, Right, Back, and Down),
     * and individually identify all stickers associated with that face.
     *
     * Sticker IDs are labeled by the face the given sticker is on, followed
     * by clockwise adjacent faces. For example, the first sticker on the UP
     * face would be identified as ULB (Up, Left, Back).
     */
    public $faces = [
        'U' => ['ULB', 'UB', 'UBR', 'UL', 'U', 'UR', 'UFL', 'UF', 'URF'],
        'L' => ['LBU', 'LU', 'LUF', 'LB', 'L', 'LF', 'LDB', 'LD', 'LFD'],
        'F' => ['FLU', 'FU', 'FUR', 'FL', 'F', 'FR', 'FDL', 'FD', 'FRD'],
        'R' => ['RFU', 'RU', 'RUB', 'RF', 'R', 'RB', 'RDF', 'RD', 'RBD'],
        'B' => ['BRU', 'BU', 'BUL', 'BR', 'B', 'BL', 'BDR', 'BD', 'BLD'],
        'D' => ['DLF', 'DF', 'DFR', 'DL', 'D', 'DR', 'DBL', 'DB', 'DRB']
    ];

    /**
     * @var integer     The number of times the cube has been solved.
     */
    public $solved = 0;

    /**
     * Returns information about this component.
     *
     * @return  array
     */
    public function componentDetails()
    {
        return [
            'name'        => 'CSS Cube',
            'description' => 'A Rubik\'s Cube made entirely out of CSS and JavaScript.'
        ];
    }

    /**
     * Injects required assets and initializes the cube.
     */
    public function onRun()
    {
        $this->addCss('components/cube/assets/css/cube.css');
        $this->addCss('components/cube/assets/css/sweetalert.css');
        $this->addJs('components/cube/assets/js/sweetalert.min.js');
        $this->addJs('components/cube/assets/js/jquery.touchSwipe.min.js');
        $this->addJs('components/cube/assets/js/cube.js');

        $this->prepareVars();
    }

    protected function prepareVars()
    {
        $this->solved = Solve::all()->count();
        $this->record = Solve::where('name', '<>', '')->orderBy('time', 'asc')->first();
    }

    public function onSubmitSolve()
    {
        Solve::create([
            'name' => input('name'),
            'time' => input('time'),
        ]);

        $this->prepareVars();
    }

}
