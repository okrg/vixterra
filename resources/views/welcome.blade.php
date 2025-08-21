<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>San Diego 3D Geospatial Visualizer</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="antialiased">
        <div id="visualization-container"></div>
        <div id="loading-indicator" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 2em;">Loading...</div>
        <div id="error-message" style="display: none; position: absolute; top: 10px; left: 10px; background: red; color: white; padding: 10px; border-radius: 5px;"></div>

        <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5); padding: 10px; border-radius: 5px; color: white;">
            <form id="address-form">
                <input type="text" name="address" placeholder="Enter an address in San Diego" style="width: 300px; padding: 5px;">
                <button type="submit" style="padding: 5px;">Visualize</button>
            </form>
            <div style="margin-top: 10px;">
                <button data-download="buildings" data-format="stl">Download Buildings (STL)</button>
                <button data-download="terrain" data-format="stl">Download Terrain (STL)</button>
            </div>
        </div>
    </body>
</html>
