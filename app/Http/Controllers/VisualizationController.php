<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class VisualizationController extends Controller
{
    /**
     * Display the main visualization page.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        return view('welcome');
    }
}
