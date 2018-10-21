window.myMap = function() {
  
  var myCenter = new google.maps.LatLng(28.455556,-80.527778);
  var mapCanvas = document.getElementById("map");
  var mapOptions = {center: myCenter, zoom: 4, minZoom: 4, disableDefaultUI: true};
  var map = new google.maps.Map(mapCanvas, mapOptions);

  
  var getTileUrl = function (tile, zoom) {
    //OMPS_Ozone_Total_Column
    const layer = "OMPS_Ozone_Total_Column";
    // const time = (new Date()).toISOString().substring(0, 10);
    const time = "2018-10-19";
    const tileMatrixSet = "GoogleMapsCompatible_Level6";
    const z = zoom;
    const y = tile.y;
    const x = tile.x;
    
    return `//gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layer}/default/${time}/${tileMatrixSet}/${z}/${y}/${x}.png`;
  };

  var layerOptions = {
    alt: 'OMPS_Ozone_Total_Column',
    getTileUrl: getTileUrl,
    maxZoom: 4,
    minZoom: 1,
    name: 'OMPS_Ozone_Total_Column',
    tileSize: new google.maps.Size(256, 256),
    opacity: 0.7
  };

  var imageMapType = new google.maps.ImageMapType(layerOptions);
  map.overlayMapTypes.insertAt(0, imageMapType);
  

  fetch("https://launchlibrary.net/1.4/launch?mode=verbose").then(function(response) {
      response.json().then(function(data) {
        console.log(data);
        var newData = data.launches
         .filter((point) => point.location.pads[0])   
        .map((point) => {
          const pad = point.location.pads[0];
          const mission = point.missions[0];
          
          var marker = new google.maps.Marker({
            position: {
              lat: pad.latitude,
              lng: pad.longitude
            },
            map: map,
            title: `${point.name} ${point.windowstart}`
          });
          
          
          var contentString = `
            <p><b>${point.name}</b>
            <br/><i>${pad.name}</i></p>
            <img width="100" src="${point.rocket.imageURL}"></img>
            <p><u>${mission.name}</u><br/>
            ${mission.description}</p>
          `;
          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });
          
          
          marker.addListener('click', function() {
          infowindow.open(map, marker);
          });

          return {
            rocket_name: point.name,
            start_time: point.windowstart,
            end_time: point.windowend,
            net_time: point.net,
            long: point.location.pads[0]["longitude"],
            lat: point.location.pads[0]["latitude"]
          };
        });

        console.log(newData);
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
}