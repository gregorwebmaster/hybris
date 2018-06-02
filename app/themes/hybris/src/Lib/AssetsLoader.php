<?php
namespace Hybris\Lib;

class AssetsLoader
{
    public function __construct()
    {
        //customise jquery
        add_action('wp_enqueue_scripts', array($this, 'disJquery'));
        //add global css
        add_action('wp_enqueue_scripts', array($this, 'loadStyles'));
        //add global js
        add_action('wp_enqueue_scripts', array($this, 'loadJs'));
        //customise CSS
    }

    public function loadStyles()
    {
        wp_enqueue_script('main-js', get_template_directory_uri() . '/assets/main.js', '', '', true);
    }

    public function loadJs()
    {
        wp_enqueue_style('main-style', get_template_directory_uri() . '/assets/main.css', '', '0.1');
        
        // template style !!!THIS MUST BE LAST!!!
        wp_enqueue_style('my-style', get_template_directory_uri() . '/style.css', '', '0.1');
    }

    public function disJquery()
    {
        if (!is_admin()) {
            wp_deregister_script('jquery');
        }
    }
}
