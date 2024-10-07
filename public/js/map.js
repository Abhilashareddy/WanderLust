
const coordinate=JSON.parse(coordinates);

    maptilersdk.config.apiKey = mapToken;
    var map = new maptilersdk.Map({
        container: 'map',
        style: maptilersdk.MapStyle.STREETS,
        center: coordinate,
        zoom: 9
    });

    const marker = new maptilersdk.Marker({
        color: "red",
        draggable: false
      }).setLngLat(coordinate)
      .addTo(map);


    map.on('load', function () {

//         map.loadImage(
//             'https://docs.maptiler.com/sdk-js/assets/custom_marker.png',
// // Add an image to use as a custom marker


// function (error, image) {
//                 if (error) throw error;
//                 map.addImage('custom-marker', image);});

        map.addSource('places', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'properties': {
                            'description':
                                '<h6><b>' + listingtitle +'</b></h6><p>Exact location will be Provided  after booking </p>',
                           
                        },
                        'geometry': {
                            'type': 'Point',
                            'coordinates': coordinate
                        }
                    },  
                ]
            }
        });


        // Add a layer showing the places.
        map.addLayer({
            'id': 'places',
            'type': 'symbol',
            'source': 'places',
            'layout': {
                
                // 'icon-image': 'custom-marker',
                'icon-overlap': 'always',
                'icon-size': 0.9
            }
        });

        // When a click event occurs on a feature in the places layer, open a popup at the
        // location of the feature, with description HTML from its properties.
        map.on('click', 'places', function (e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.description;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new maptilersdk.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        });

        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', 'places', function () {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'places', function () {
            map.getCanvas().style.cursor = '';
        });
    });
