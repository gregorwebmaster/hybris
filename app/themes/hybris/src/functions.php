<?php
namespace Hybris;

use Hybris\Lib\AssetsLoader;

class functions
{
    public function __construct()
    {
        require_once('vendor/autoload.php');
        new AssetsLoader;
    }
}

new functions;
