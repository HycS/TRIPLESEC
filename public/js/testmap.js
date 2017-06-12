var lat = 34.974716;

var lng = 134.974716;

var map;
var markersArray = []; //마커들이 담길 배열
var geocoder;

function initialize() {

    var haightAshbury = new google.maps.LatLng(lat, lng);
    var mapOptions = {
        zoom: 14,
        center: haightAshbury,
        mapTypeId: 'roadmap'

    };

    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById("map"), mapOptions);



    if (markersArray.length === 0) {

        addMarker(haightAshbury);

    }



    google.maps.event.addListener(map, 'click', function (e) {

        geocoder.geocode({
                'latLng': e.latLng
            },
            function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        if (marker) {
                            marker.setPosition(e.latLng);
                        } else {
                            marker = new google.maps.Marker({
                                position: e.latLng,
                                map: map
                            });
                        }
                    } else {
                        document.getElementById('geocoding').innerHTML =
                            'No results found';
                   }
                } else {
                    document.getElementById('geocoding').innerHTML =
                        'Geocoder failed due to: ' + status;

                }

            });

    });
}


function addMarker(location) {



    $.ajax({

     	url: 'http://triplesec.herokuapp.com/api/v1/placesList',
				//data: { mode : "KEYWORDCITYJSON" , keyword : $("#cityNm").val() },

				dataType: "json",
        success: function (data) {





            var markers = [];

            if (data) {



                //만약 ajax처리를 하지 않고 배열로 테스트 할경우 아래 처리 반복문으로 처리하세요

                $.each(data, function (i, val) {

                    var latLng = new google.maps.LatLng(, 마커 경도[변경]);

                    var marker = new google.maps.Marker({

                        position: latLng,

                        title: 마커타이틀[변경],

                        map: map

                    });



                    markers.push(marker);

                });

            }

            markersArray = markers;







        },

        error: function (xmlRequest) {

            alert(xmlRequest.status + " " +

                xmlRequest.statusText +

                " " +

                xmlRequest.responseText);

        }

    });

}