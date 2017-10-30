<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="csrf-token" content="{{ csrf_token() }}">
<title>Sample</title>
<link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>
<body>

<div id="app" class="page">
    <input type="checkbox" id="show-article">

    <div class="map">
        <div id="map"></div>
    </div>

    <header>
        header <label for="show-article" class="btn btn-sm btn-secodary">toggle</label>
    </header>

    <article id="js-article">
        <header>
            content
        </header>
        <div class="body">
            <label for="show-article">close</label>
        </div>
    </article>
</div>


<script src="{{ asset('js/app.js') }}"></script>
<script async defer src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_MAPS_APIKEY_BROWSER') }}&libraries=geometry&callback=initMap"></script>
</body>
</html>
