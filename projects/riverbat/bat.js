
//MAPINIT
L.mapbox.accessToken = 'pk.eyJ1IjoiZ3JlZ29yeWRnYXJjaWEiLCJhIjoiNGRMNU13NCJ9.eYlvRKV4vrpXMGBPAs_Amw';
var map = L.mapbox.map('map', 'gregorydgarcia.m187akkn');
map.setView([51.513333, -0.136667], 16);

//FULL SCREEN
L.control.fullscreen().addTo(map);

//GEOCODER
L.Control.geocoder().addTo(map);

                
//CONTROL INIT
var control = L.control.layers({
    'Topology': L.mapbox.tileLayer('gregorydgarcia.m187akkn').addTo(map),
    'Satellite': L.mapbox.tileLayer('gregorydgarcia.m189o9m3'),
    'Grey Scale': L.mapbox.tileLayer('gregorydgarcia.m18a0neh')
 
}, {

}).addTo(map);




//FILE CONTROL
  var counter = 0,
   fileLayers = {},
  fileLayers2 = {},
   toolLayers = {};
  function handleFileSelect(evt) {
          var files = evt.target.files, // FileList object
                  f = files[0],
             reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = (function (theFile) {
          return function (e) { 
              var JsonObj = e.target.result,
                  layerId = 'layer' + counter,
                  parsedJSON = JSON.parse(JsonObj);
              
              fileLayers.layerId = parsedJSON;
              counter += 1;
          };
      })(f);
      // Read in JSON as a data URL.
      reader.readAsText(f, 'UTF-8');
  }
  function handleFileSelect2(evt) {
          var files = evt.target.files, // FileList object
                  f = files[0],
             reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = (function (theFile) {
          return function (e) { 
              var JsonObj = e.target.result,
                  layerId = 'layer' + counter,
                  parsedJSON = JSON.parse(JsonObj);
              
              fileLayers2.layerId = parsedJSON;
              counter += 1;
          };
      })(f);
      // Read in JSON as a data URL.
      reader.readAsText(f, 'UTF-8');
  }

//DRAW CONTROL
  var featureGroup = L.featureGroup().addTo(map);
  // Define circle options
  // http://leafletjs.com/reference.html#circle
  var circle_options = {
      color: '#fff',      // Stroke color
      opacity: 1,         // Stroke opacity
      weight: 10,         // Stroke weight
      fillColor: '#000',  // Fill color
      fillOpacity: 0.6    // Fill opacity
  };
  // Define polyline options
  // http://leafletjs.com/reference.html#polyline
  var polyline_options = {
      color: '#000'
  };
  // Defining a polygon here instead of a polyline will connect the
  // endpoints and fill the path.
  // http://leafletjs.com/reference.html#polygon

  var drawControl = new L.Control.Draw({
    edit: {
      featureGroup: featureGroup
    }
  }).addTo(map);

  map.on('draw:created', function(e) {
      var lay = featureGroup.addLayer(e.layer);
      control.addOverlay(featureGroup, 'Draw'),
      console.log(JSON.stringify(lay));

  });  

//GEOJSON NAME
  function onEachFeature(feature, layer) {
      // does this feature have a property named popupContent?
      if (feature.properties && feature.properties.name) {
          layer.bindPopup(feature.properties.name);
      }
  }

//UI CONTROL OF TOOLS
  var previousTool = null
  $('input[type=button]').on('click', function(){
      if (previousTool != null){
          $(previousTool).addClass('hidden');
      }
      var name = $(this).val();
      var toolId = '#' + name;
      $(toolId).toggleClass('hidden');
      previousTool = toolId
  });

  var previousToolSet = null
  var previousMenu = null
  $('.tools ul li').on('click', function(){
      if(previousToolSet !== null){
          $(previousToolSet).addClass('hidden');
      }
      if(previousMenu !== null){
          $(previousMenu).removeClass('selected')
      }

      $(this).toggleClass('selected');
      var toolSet = $(this).text();
      var jToolSet = 'div.' + toolSet;
      $(jToolSet).toggleClass('hidden');
      previousToolSet = jToolSet;
      previousMenu = $(this);


  })

  $('.title').on('click', function(){
      $('.tools').toggleClass('shrunk')
  })


//FUNCTION MODEL EXAMPLE
// function along() {
//         //Inputs
//     var distance = $("#along-distance" ).val(),
//         units = $( "input[name='along-unit']:checked" ).val(),
//         ref = $( 'input[name="along-name"]' ).val(),
//         //Layer Reference
//         layerId = 'layer' + counter,
//         alo = fileLayers.layerId, //<first 3 char of function>
//         //Turf Processing
//         alongResult = turf.along(alo, distance, units),         
//         //Save result to toolLayer as string
//         toolLayers[ref] = JSON.stringify(alongResult),
//         //Result to Leaflet Layer
//         alongGeo = L.geoJson(alongResult); //<function>Geo

//     //Add to map
//     geoAlong.addTo(map);
//     //Add to overlay
//     control.addOverlay(geoAlong, ref);
//     //Add to save-list
//     appendToSave(ref);


//
//AGGREGATION CONTROLS
//



//AGGREGATE
    function aggregate(){
        var aggregations = [{aggregation: 'sum', inField: 'population', outField: 'pop_sum' }, { aggregation: 'average', inField: 'population', outField: 'pop_avg' }, {   aggregation: 'median',   inField: 'population',   outField: 'pop_median' }, {   aggregation: 'min',   inField: 'population',   outField: 'pop_min' }, {   aggregation: 'max',   inField: 'population',   outField: 'pop_max' }, {   aggregation: 'deviation',   inField: 'population',   outField: 'pop_deviation' }, {   aggregation: 'variance',   inField: 'population',   outField: 'pop_variance' }, {   aggregation: 'count',   inField: '',   outField: 'point_count' }],
            polygons = fileLayers.layerId
            points = fileLayers2.layerId
            ref = $( 'input[name="aggregate-name"]' ).val(),

            aggregateResult = turf.aggregate( polygons, points, aggregations),
            aggregateResult = turf.featurecollection( points.features.concat(aggregateResult.features)),

            aggregateGeo = L.geoJson(aggregateResult);

        toolLayers[ref] = JSON.stringify(aggregateResult),
        aggregateGeo.addTo(map);
        control.addOverlay(aggregateGeo, ref);
        appendToSave(ref);

    }

 
$('#aggregate-submit').on('click', aggregate); //<func>-submit
document.getElementById('aggregate-data1').addEventListener('change', handleFileSelect, false); 
document.getElementById('aggregate-data2').addEventListener('change', handleFileSelect2, false); 
//
//MEASUREMENT CONTROLS
//



// //ALONG
//     function along() {
//             //Inputs
//         var distance = $("#along-distance" ).val(),
//             units = $( "input[name='along-unit']:checked" ).val(),
//             ref = $( 'input[name="along-name"]' ).val(),
//             alo = fileLayers.layerId.
//             console.log(alo);

//             alongResult = turf.along(alo, distance, units),
//             alongGeo = L.geoJson(alongResult); //<func>Geo

//         //Add result to toolLayer as string
//         toolLayers[ref] = JSON.stringify(alongResult),
//         //Add to map
//         alongGeo.addTo(map);
//         //Add to overlay
//         control.addOverlay(alongGeo, ref);
//         //Add to save-list
//         appendToSave(ref);
//     }
// $('#along-submit').on('click', along); //<func>-submit
// document.getElementById('along-data').addEventListener('change', handleFileSelect, false); //<function>-data


//AREA
    function area() {
          //Layer Reference
      var layerId = 'layer' + counter,
          are = fileLayers.layerId, //<first 3 char of func>
          //Turf Processing
          areaNum = turf.area(are);

      //NOTE: Process for output that doesn't generate a layer
      //Append to result area
      $('#area-result').append('<p>' + areaNum + ' Square Meters </p>');
      //Prevents append from resetting hidden class 
      $('#area').removeClass('hidden');
    }
$('#area-submit').on('click', area);
document.getElementById('area-data').addEventListener('change', handleFileSelect, false);

//BBOX-POLYGON
    function bbox() {
        
        var xLow = $("#bbox-xLow" ).val(),
            yLow = $("#bbox-yLow" ).val(),
            xHigh = $("#bbox-xHigh" ).val(),
            yHigh = $("#bbox-yHigh" ).val(),
            
            bbox = [xLow, yLow, xHigh, yHigh];
            ref = $( 'input[name="bbox-name"]' ).val(),
            
            bboxResult = turf.bboxPolygon(bbox), 
            bboxGeo = L.geoJson(bboxResult); 

        toolLayers[ref] = JSON.stringify(bboxResult),
        bboxGeo.addTo(map);
        control.addOverlay(bboxGeo, ref);
        appendToSave(ref);
    }
$('#bbox-submit').on('click', bbox); 

//BEARING 
//IN PROGRESS 
//   function bearing(){

//     var start = $("bearing-start").val(),
//         end = $("bearing-end").val()

//         bearingResult = turf.bearing(start, end);

//     //NOTE: Process for output that doesn't generate a layer
//     $('#area-result').append('<p>' + areaResult + ' Square Meters </p>');
//     //Prevents append from resetting hidden class 
//     $('#area').removeClass('hidden');
//   }
// $('#area-submit').on('click', area);


//CENTER
    function center() {
      
      var ref = $( '#center-name' ).val();
          layerId = 'layer' + counter,
          
          cen = fileLayers.layerId,
          centerResult = turf.center(cen),
          centerGeo = L.geoJson(centerResult);

      toolLayers[ref] = JSON.stringify(centerResult);
      centerGeo.addTo(map);
      control.addOverlay(centerGeo, ref);
      appendToSave(ref);

    }
$('#center-submit').on('click', center);
document.getElementById('center-data').addEventListener('change', handleFileSelect, false);


//CENTROID
    function centroid() {
      
      var ref = $( '#centroid-name' ).val(),
          layerId = 'layer' + counter,
          
          cen = fileLayers.layerId,
          centroidResult = turf.centroid(cen),
          cenGeo = L.geoJson(centroidResult);

      toolLayers[ref] = cenSubmit;
      cenGeo.addTo(map);
      control.addOverlay(cenGeo, ref);
      appendToSave(ref);


    }
$('#centroid-submit').on('click', centroid);
document.getElementById('centroid-data').addEventListener('change', handleFileSelect, false);



//
//TRANSFORM CONTROLS
//

//BEZIER
    function bezier() {
        var res = $( "input[name='bezier-res']" ).val(),
            sharp = $( "input[name='bezier-sharpness']" ).val(),
            ref = $( "input[name='bezier-name']" ).val(),
            layerId = 'layer' + counter,

            bez = fileLayers.layerId,
            bezierResult = turf.bezier(bez, res, sharp),
            bezierGeo = L.geoJson(bezier);

        toolLayers[ref] = JSON.stringify(bezierResult);
        bezierGeo.addTo(map);
        control.addOverlay(bezierGeo, ref);
        appendToSave(ref);


    }
$('#bezier-submit').on('click', bezier);
document.getElementById('bezier-data').addEventListener('change', handleFileSelect, false);

//BUFFER
    function buffer() {
        var length = $("#buffer-length" ).val(),
            units = $( "input[name='buffer-unit']:checked" ).val(),
            ref = $( 'input[name="buffer-name"]' ).val();
            layerId = 'layer' + counter,
            
            buf = fileLayers.layerId,
            bufferResult = turf.buffer(buf, length, units),
            bufferGeo = L.geoJson(bufferResult);

        toolLayers[ref] = JSON.stringify(bufferResult);
        bufferGeo.addTo(map);
        control.addOverlay(bufferGeo, ref);
        appendToSave(ref);

    }
$('#buffer-submit').on('click', buffer);
document.getElementById('buffer-data').addEventListener('change', handleFileSelect, false);

//CONCAVE
    function concave() {
        var maxEdge = $("#concave-maxEdge" ).val(),
            units = $( "input[name='concave-unit']:checked" ).val(),
            ref = $( '#concave-name' ).val(),
            layerId = 'layer' + counter,
            
            con = fileLayers.layerId,
            concaveResult = turf.concave(con, length, units),
            concaveGeo = L.geoJson(concaveResult);

        toolLayers[ref] = JSON.stringify(concaveResult);
        concaveGeo.addTo(map);
        control.addOverlay(concaveGeo, ref);
        appendToSave(ref);

    }

$('#concave-submit').on('click', concave);
document.getElementById('concave-data').addEventListener('change', handleFileSelect, false);

//
//DATA CONTROLS
//

//LOAD
    function load() {
      var ref = $( '#load-name' ).val(),
          layerId = 'layer' + counter,
          
          loa = fileLayers.layerId,
          //for naming
          loadGeo = L.geoJson(loa, {
            onEachFeature: onEachFeature
          });

      loadGeo.addTo(map);
      control.addOverlay(loadGeo, ref);

    }
$('#load-submit').on('click', load);
document.getElementById('load-data').addEventListener('change', handleFileSelect, false);

//SAVE 
  function save() {
    var ref = $( '#save-list' ).val();
    var data = toolLayers[ref];
    var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data);
    window.open(url, '_blank');
    window.focus();
    
  }
$('#save-input').on('click', save);

  function appendToSave(ref){
    $('#save-list').append(
      '<option value="' + ref + '">' + ref + '</option>'
      );
  } 