var markers = [];
var map;
var geocoder;
var infowindow = null;
var latitude = 0;
var longitude = 0;
var plaace, iw, autocomplete;
var course = [];
var tmp = [];
var travelPath = [];
var coordinate = [];
var addPath = [];
var labelNumber = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100'];
var labelIndex = 0;
var outline = "f5f5f5";
var textColor = "000000"
var infoWindows = [];
var in_air, out_air;
var firstMap;
var resultID;
var firstCoor;
var dateIn, dateOut;
var results = [];
var resultLen;
var passes = [];
var courseNum;
$(document).ready(function () {

    temp = location.href.split("?");
    courseNum = temp[1];
      getCourse();
});

function initMap() {
  
    viewMarker();

    var mapOptions = {
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        

    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
   
}

function getCourse() {
    $.ajax({
        type: "GET",
        url: "/api/v1/course/"+courseNum,
        success: function (json) {
            var resultList = json;
            resultLen = resultList.courseUnit.length;

            for (var i = 0; i < resultLen; i++) {
                var result = new Object();
                result.unitIndex = resultList.courseUnit[i].unitIndex;
                result.placeID = resultList.courseUnit[i].placeID;
                result.unitDate = resultList.courseUnit[i].unitDate;
                results.push(result);
            }
            if(results[0].placeID == results[resultLen-1].placeID){
                            resultLen--;
                        }
        }
    })
}

function viewMarker() {

    $.ajax({
        type: "GET",
        url: "/api/v1/placesList",
        //data: { latitude : latitude , longitude : longitude },		// 추후 값을 넘겨서 지정 범위내 값만 가져오기 위해 사용(?)

        success: function (json) {
            var markerList = json;
            var listLen = markerList.length;
            var pinColor = "F0F000";
            for (var i = 0; i < listLen; i++) {
                for (var k = 0; k < resultLen; k++) {
                    if (results[k].placeID == markerList[i].id_place) {
                        if (markerList[i].place_url == null) {
                            var homepage = "없음";
                        } else {
                            var homepage = markerList[i].place_url;
                        }
                      
                       
                        var contentString = '<div>' +
                            markerList[i].place_name.ko_KR + '<div style="text-align:left">' + results[k].unitDate+ '</div><hr></hr>' +
                            markerList[i].place_description.ko_KR + '<br></br>전화번호 : ' +
                            markerList[i].phone + '<br>주소 : ' + markerList[i].place_address.ko_KR + '<br>' +
                            '홈페이지 : <a href="' + homepage + '" target="_blank">' + homepage+ '</a></div>';
                        var contentString2 = '';
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(markerList[i].latitude, markerList[i].longitude),
                            map: map,
                            PlaceID: markerList[i].id_place,
                            ko_KR: markerList[i].place_name.ko_KR,
                            des_ko_KR: markerList[i].place_description.ko_KR,
                            adr_ko_KR: markerList[i].place_address.ko_KR,
                            homeurl: homepage,
                            phone: markerList[i].phone,
                            icon: getIcon(labelNumber[results[k].unitIndex - 1], pinColor, textColor, outline),
                            draggable: false,
                            title: markerList[i].place_name.ko_KR,
                            delnum: 0,
                            content: contentString,
                            content2: contentString2,
                            type: markerList[i].place_type,
                            setpath: false,
                            date: null
                        });

                        markers.push(marker);
                      
                        var infowindow = new google.maps.InfoWindow({
                            maxWidth: 500
                        });

                        google.maps.event.addListener(marker, "click", function () {
                            closeInfowindow();
                            infowindow.setContent(this.content);
                            infowindow.open(map, this);
                            infoWindows[0] = infowindow;
                        });
                        if (results[k].unitIndex == 1) {
                            map.panTo(marker.getPosition());


                        }
                    }
                }
            }
            getOrder();
            addLine();
             getPass();
        }
    });
}

function getOrder() {

    for (var i = 0; i < resultLen; i++) {

        for (var k = 0; k < resultLen; k++) {

            if (markers[k].PlaceID == results[i].placeID) {
                coordinate.push(markers[k].position);

            }
        }
    }
   
}

function addLine() { //라인그리기
    
    addPath = new google.maps.Polyline({
        path: coordinate,
        strokeColor: "#ff0000",
        strokeOpacity: 0.7,
        strokeWeight: 2
    });

    //travelPath.push(addPath);

    addPath.setMap(map);
}

function getIcon(text, fillColor, textColor, outlineColor) {
    if (!text) text = '•';
    var iconUrl = "http://chart.googleapis.com/chart?cht=d&chdp=mapsapi&chl=pin%27i\\%27[" + text + "%27-2%27f\\hv%27a\\]h\\]o\\" + fillColor + "%27fC\\" + textColor + "%27tC\\" + outlineColor + "%27eC\\Lauto%27f\\&ext=.png";
    return iconUrl;
}

function closeInfowindow() { //창 자동닥기
    if (infoWindows.length > 0) {
        infoWindows[0].set(null);
        infoWindows[0].close();
        infoWindows.length = 0;
    }
}
function getPass() {
    $.ajax({
        type: "GET",
        url: "/api/v1/recommendpass/12",
        success: function (json) {
            var passList = json;
            var passLen = passList.length;
            for(var i = 0; i<passLen ; i++){
                var pass = new Object();
                pass.passName = passList[i].passName.ko_KR;
                pass.passPrice = passList[i].passPrice;
                pass.passDescription = passList[i].passDescription.ko_KR;
                pass.URL = passList[i].passURL;
                passes.push(pass);
            }
            var content;
            var cost =0;
            for (var i = 0; i < passLen; i++) {
                if (i == 0) {
                    content = '<div style="color : yellow; width :120%"; class="panel-body" >추천 패스 ' + labelNumber[i] + '<br>•  ' + passes[i].passName + '  : ' + passes[i].passPrice + '엔<br>' + 'URL 주소 : <a href="' + passes[i].URL + '"target="_blank">' + passes[i].URL + '</a><div style="color : yellow; width :120%";  href="#info' + labelNumber[i] + '" data-toggle="collapse">정보<i class="material-icons">arrow_drop_down</i>   <div class="collapse" id="info' + labelNumber[i] + '"><div class="panel-body"style="color : white; width :120%">' + passes[i].passDescription + '</div></div></div></div>';

                } else {
                    content = content + '<div style="color : yellow; width :120%"; class="panel-body" >추천 패스 ' + labelNumber[i] + '<br>•  ' + passes[i].passName + '  : ' + passes[i].passPrice + '엔<br>' + 'URL 주소 : <a href="' + passes[i].URL + '"target="_blank">' + passes[i].URL + '</a><div style="color : yellow; width :120%";  href="#info' + labelNumber[i] + '" data-toggle="collapse">정보<i class="material-icons">arrow_drop_down</i>   <div class="collapse" id="info' + labelNumber[i] + '"><div class="panel-body"style="color : white; width :120%">' + passes[i].passDescription + '</div></div></div></div>';

                }

                cost += passes[i].passPrice;
            }
            //content = content + '총 ' + cost + '엔';
           
            $("#collapse1").html(content);       
          
        }
    })
}
