<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UnicornEventController extends Controller
{
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('unicorn');
    }
}
