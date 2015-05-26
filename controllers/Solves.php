<?php namespace Bedard\Cube\Controllers;

use BackendMenu;
use Backend\Classes\Controller;

/**
 * Solves Back-end Controller
 */
class Solves extends Controller
{
    public $implement = [
        'Backend.Behaviors.FormController',
        'Backend.Behaviors.ListController'
    ];

    public $formConfig = 'config_form.yaml';
    public $listConfig = 'config_list.yaml';

    public $bodyClass = 'compact-container';

    public $requiredPermissions = ['bedard.cube.access_solves'];

    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('Bedard.Cube', 'cube', 'solves');
    }
}
