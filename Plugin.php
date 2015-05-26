<?php namespace Bedard\Cube;

use Backend;
use System\Classes\PluginBase;

/**
 * Cube Plugin Information File
 */
class Plugin extends PluginBase
{

    /**
     * Returns information about this plugin.
     *
     * @return  array
     */
    public function pluginDetails()
    {
        return [
            'name'        => 'CSS Cube',
            'description' => 'A Rubik\'s Cube made entirely out of CSS and JavaScript.',
            'author'      => 'Scott Bedard',
            'icon'        => 'icon-cube'
        ];
    }

    public function registerNavigation()
    {
        return [
            'cube' => [
                'label'       => 'Cube',
                'url'         => Backend::url('bedard/cube/solves'),
                'icon'        => 'icon-cube',
                'permissions' => ['bedard.cube.*'],
                'order'       => 500,

                'sideMenu' => [
                    'solves' => [
                        'label'       => 'Solves',
                        'icon'        => 'icon-cube',
                        'url'         => Backend::url('bedard/cube/solves'),
                        'permissions' => ['bedard.cube.access_solves'],
                    ],
                ]
            ]
        ];
    }

    /**
     * Registers plugin components.
     *
     * @return  array
     */
    public function registerComponents()
    {
        return [
            'Bedard\Cube\Components\Cube' => 'cube',
        ];
    }

}
