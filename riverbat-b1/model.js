//ALONG
    function along() {
            //Inputs
        var distance = $("#along-distance" ).val(),
            units = $( "input[name='along-unit']:checked" ).val(),
            ref = $( 'input[name="along-name"]' ).val(),
            //Layer Reference
            layerId = 'layer' + counter,
            alo = fileLayers.layerId, //<first 3 char of function>
            
            //Turf Processing
            alongResult = turf.along(alo, distance, units),         
            
            //Result to Leaflet Layer
            alongGeo = L.geoJson(alongResult); //<function>Geo

        //Save result to toolLayer as string
        toolLayers[ref] = JSON.stringify(alongResult),
        //Add to map
        alongGeo.addTo(map);
        //Add to overlay
        control.addOverlay(geoAlong, ref);
        //Add to save-list
        appendToSave(ref);
    }
    $('#along-submit').on('click', along); //<function>-submit
    document.getElementById('along-data').addEventListener('change', handleFileSelect, false); //<function>-data


//BEZIER
    function bezier() {
        var res = $( "input[name='bezier-res']" ).val(),
            sharp = $( "input[name='bezier-sharpness']" ).val(),
            ref = $( "input[name='bezier-name']" ).val(),
            layerId = 'layer' + counter,

            bez = fileLayers.layerId,
            bezierResult = turf.bezier(bez, res, sharp),
            bezierGeo = L.geoJson(bezier);

        toolLayers[ref] = JSON.stringify(bezierResult),
        bezierGeo.addTo(map);
        control.addOverlay(bezierGeo, ref);
        appendToSave(ref);


    }