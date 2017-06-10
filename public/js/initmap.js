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
$(document).ready(function () {

    temp = location.href.split("?");
    data = temp[1].split(":");
    in_air = data[0];
    out_air = data[1];
    dateIn = data[2];
    dateOut = data[3];

    in_air = decodeURI(in_air);
    out_air = decodeURI(out_air);
    dateIn = decodeURI(dateIn);
    dateOut = decodeURI(dateOut);
    document.getElementById('date-range13-2').value = dateIn;

});

function sendFunc() {
    location.href = "calendar.html?" + in_air + ":" + out_air;
}

function initMap() {
    viewMarker();
    var mapOptions = {
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,

    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

}

// 드롭 마커 보기

function viewMarker() {

    $.ajax({
        type: "GET",
        url: "/api/v1/placesList",
        //data: { latitude : latitude , longitude : longitude },		// 추후 값을 넘겨서 지정 범위내 값만 가져오기 위해 사용(?)
        beforeSend: function () {
            fnRemoveMarker(); // 조회 전 기존 마커 제거
        },
        success: function (json) {
            var markerList = json;
            var listLen = markerList.length;
            var pinColor = "FF0000";
            for (var i = 0; i < listLen; i++) {
                if (markerList[i].place_url == null) {
                    var homepage = "없음";
                } else {
                    var homepage = markerList[i].place_url;
                }

                var contentString = '<div>' +
                    markerList[i].place_name.ko_KR + '<hr></hr>' +
                    markerList[i].place_description.ko_KR + '<br></br>전화번호 : ' +
                    markerList[i].phone + '<br>주소 : ' + markerList[i].place_address.ko_KR + '<br>' +
                    '홈페이지 : <a href ="' + homepage + '" target="_blank">'+homepage+'</a><br><br><a class="btn btn-primary" onclick="addCourse(' + i + ')"> 추가 </a></div>';
                var contentString2 = '';
                /*'<div>' +
                markerList[i].place_name.ko_KR + '<hr></hr>' +
                markerList[i].place_description.ko_KR + '<br></br>전화번호 : ' +
                markerList[i].phone + '<br>주소 : ' + markerList[i].place_address.ko_KR + '<br>' +
                '홈페이지 : ' + homepage + '<br><br><a href="#" class="btn btn-primary" onclick="delCourse(' + i + ')"> 삭제 </a><form id="frm" action="action.jsp"><input type="number" id="usernumber" name="usernumber"             value="" step="1"  min="1"  max="'+labelIndex+'"></form></div>';*/

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(markerList[i].latitude, markerList[i].longitude),
                    map: map,
                    PlaceID: markerList[i].id_place,
                    ko_KR: markerList[i].place_name.ko_KR,
                    des_ko_KR: markerList[i].place_description.ko_KR,
                    adr_ko_KR: markerList[i].place_address.ko_KR,
                    homeurl: homepage,
                    phone: markerList[i].phone,
                    icon: getIcon(null, pinColor, textColor, outline),
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
                if (in_air == markerList[i].place_name.ko_KR || in_air == markerList[i].place_name.en_US || in_air == markerList[i].place_name.ja_JP) {
                    map.panTo(marker.getPosition());
                    addCourse(i);

                }
            }
        }
    });
}

function closeInfowindow() { //창 자동닥기
    if (infoWindows.length > 0) {
        infoWindows[0].set(null);
        infoWindows[0].close();
        infoWindows.length = 0;
    }
}

function addCourse(num) { //추가 버튼 클릭

    var pinColor = "F0F000";
    var getdate = document.getElementById('date-range13-2').value;

    markers[num].date = getdate;
    var string = getdate.split('-');
    //getdate = "";
    getdate = string[0] + string[1] + string[2];
    if (labelIndex != 0) {
        var last_date = markers[course[labelIndex - 1]].date;
        var string2 = last_date.split('-');
        last_date = string2[0] + string2[1] + string2[2];
        if (last_date > getdate) {
            alert("여행날짜가 잘못 되었습니다.");
            return;
        }
    }
    var tmp_datein = dateIn;
    var tmp_dateout = dateOut;
    var string1 = tmp_datein.split('-');
    var string2 = tmp_dateout.split('-');
    tmp_datein = string1[0] + string1[1] + string1[2];
    tmp_dateout = string2[0] + string2[1] + string2[2];
    if (labelIndex != 0) {
        if (getdate < tmp_datein || getdate > tmp_dateout) {
            alert("여행날짜가 잘못 되었습니다.");
            return;
        }
    }

    markers[num].setIcon(getIcon(labelNumber[labelIndex++], pinColor, textColor, outline));
    markers[num].setpath = true;
    markers[num].delnum = num;


    markers[num].content2 = '<div>' +
        markers[num].ko_KR + '<hr></hr>' +
        markers[num].des_ko_KR + '<br></br>전화번호 : ' +
        markers[num].phone + '<br>주소 : ' + markers[num].adr_ko_KR + '<br>' +
        '홈페이지 : <a href="' + markers[num].homeurl + '" target="_blank">'+markers[num].homeurl +'</a><div class="row"><div class="col-md-2"><a class="btn btn-primary" onclick="delCourse(' + num + ')"> 삭제 </a></div><div class="col-md-10" style="text-align:right">여행날짜 : <input id="userdate" type="date" style="width:120px" value="' + markers[num].date + '">&nbsp&nbsp여행순서 : <input style="width:35px" type="number" id="usernumber" name="usernumber" value="' + labelIndex + '" step="1"  min="1" max="' + 100 + '">&nbsp&nbsp<a align ="center" class="btn btn-primary" onclick="changeCourse(' + parseInt(labelNumber[labelIndex - 1]) + ')"> 변경 </a></div>';
    var infowindow = new google.maps.InfoWindow({
        maxWidth: 500
    }); //정보창 변경
    closeInfowindow();
    google.maps.event.addListener(markers[num], "click", function () {
        closeInfowindow();
        infowindow.setContent(this.content2);
        infowindow.open(map, this);
        infoWindows[0] = infowindow;

    });
    course.push(num);
    coordinate.push(markers[num].position);

    addLine();
}


function delCourse(num) { //삭제버튼클릭
    var pinColor = "FF0000";

    for (var i = 0; i < markers.length; i++) {
        if (i == num) {
            var n = course[labelIndex - 1];
            markers[i].setpath = false;
            markers[i].date = null;
            var infowindow = new google.maps.InfoWindow(); //정보창 번경
            closeInfowindow();
            google.maps.event.addListener(markers[i], "click", function () {
                closeInfowindow();
                infowindow.setContent(this.content);
                infowindow.open(map, this);
                infoWindows[0] = infowindow;
            });
            for (var k = 0; k < labelIndex; k++) {
                if (course[k] == i) {
                    course.splice(k, 1);
                    labelIndex--;
                    addPath.setMap(null);
                    coordinate.splice(k, 1);
                    break;
                }
            }
            //마커색 변경 및 번호 재지정, 경로 새로그리기
            if (i == n) {
                markers[i].setIcon(getIcon(null, pinColor, textColor, outline));
                addLine();
            } else {
                markers[i].setIcon(getIcon(null, pinColor, textColor, outline));
                addLine();
                reStruct();
            }
            //  markers[0].setMap(null);
        }
    }

}

function changeCourse(index) {

    var num = document.getElementById("usernumber").value;
    var user_date = document.getElementById("userdate").value;
    var tmp = course;
    var tmp_indate = dateIn;
    var tmp_outdate = dateOut;
    var string = tmp_indate.split('-');
    var string1 = tmp_outdate.split('-');
    var string2 = user_date.split('-');
    tmp_indate = string[0] + string[1] + string[2];
    tmp_outdate = string1[0] + string1[1] + string1[2];
    user_date = string2[0] + string2[1] + string2[2];
    if (num > labelIndex) {
        alert("등록한 여행일정 보다 큰 숫자 입니다.");
        return;
    }
    if (user_date > tmp_outdate || user_date < tmp_indate) {
        alert("여행 날짜가 아닙니다.")
        return;
    }

    if (labelIndex == num) {
        var tmp_front = markers[course[num - 1]].date;
        var string = tmp_front.split('-');
        tmp_front = string[0] + string[1] + string[2];
        if (user_date < tmp_front) {
            alert("여행 날짜가 잘못 되었습니다.")
            return;
        }
        course.push(course[index - 1]);
        course.splice(index - 1, 1);
        coordinate.push(coordinate[index - 1]);
        coordinate.splice(index - 1, 1);;

    } else if (index > num) {
        if (num == 1) {
            var tmp_front = 0;
        } else {
            var tmp_front = markers[course[num - 2]].date;
            var string4 = tmp_front.split('-');
            tmp_front = string4[0] + string4[1] + string4[2];
        }
        var tmp_back = markers[course[num - 1]].date
        var string3 = tmp_back.split('-');
        tmp_back = string3[0] + string3[1] + string3[2];

        if (user_date < tmp_front || user_date > tmp_back) {
            alert("여행 날짜가 잘못 되었습니다.")
            return;
        }
        course.splice(num - 1, 0, course[index - 1]);
        course.splice(index, 1);
        coordinate.splice(num - 1, 0, coordinate[index - 1]);
        coordinate.splice(index, 1);
    } else if (index < num) {
        var tmp_front = markers[course[num - 1]].date
        var tmp_back = markers[course[num]].date
        var string3 = tmp_front.split('-');
        tmp_front = string3[0] + string3[1] + string3[2];
        var string4 = tmp_back.split('-');
        tmp_back = string4[0] + string4[1] + string4[2];
        if (user_date < tmp_front || user_date > tmp_back) {
            alert("여행 날짜가 잘못 되었습니다.")
            return;
        }
        if (markers[course[num - 1]])
            course.splice(num, 0, course[index - 1]);
        course.splice(index - 1, 1);
        coordinate.splice(num, 0, coordinate[index - 1]);
        coordinate.splice(index - 1, 1);
    } else {
        return;
    }
    user_date = string2[0] + '-' + string2[1] + '-' + string2[2];
    markers[course[num - 1]].date = user_date;
    addLine();
    reStruct();
}

function reStruct() { //삭제시 번호 순서 재지정
    var pinColor = "F0F000";
    for (var i = 0; i < labelIndex; i++) {

        markers[course[i]].setIcon(getIcon(labelNumber[i], pinColor, textColor, outline));
        markers[course[i]].content2 = '<div>' +
            markers[course[i]].ko_KR + '<hr></hr>' +
            markers[course[i]].des_ko_KR + '<br></br>전화번호 : ' +
            markers[course[i]].phone + '<br>주소 : ' + markers[course[i]].adr_ko_KR + '<br>' + '홈페이지 : <a href="' + markers[course[i]].homeurl + '" target="_blank">'+markers[course[i]].homeurl +'</a><div class="row"><div class="col-md-2"><a class="btn btn-primary" onclick="delCourse(' + markers[course[i]].delnum + ')"> 삭제 </a></div><div class="col-md-10" style="text-align:right">여행날짜 : <input id="userdate" type="date" style="width:120px" value="' + markers[course[i]].date + '">&nbsp&nbsp여행순서 : <input style="width:35px" type="number" id="usernumber" name="usernumber" value="' + parseInt(labelNumber[i]) + '" step="1"  min="1" max="' + 100 + '">&nbsp&nbsp<a align ="right" class="btn btn-primary" onclick="changeCourse(' + parseInt(labelNumber[i]) + ')"> 변경 </a></div>';
        var infowindow = new google.maps.InfoWindow({
            maxWidth: 500
        }); //정보창 변경
        closeInfowindow();
        google.maps.event.addListener(markers[i], "click", function () {
            infowindow.setContent(this.content2);
            infowindow.setOptions({
                maxWidth: 150
            });
            infowindow.open(map, this);
            infoWindows[0] = infowindow;
        });
    }
}


function addLine() { //라인그리기
    if (coordinate.length > 1) {
        addPath.setMap(null);
    }
    addPath = new google.maps.Polyline({
        path: coordinate,
        strokeColor: "#ff0000",
        strokeOpacity: 0.7,
        strokeWeight: 2
    });

    //travelPath.push(addPath);

    addPath.setMap(map);
}
//마커 색 변경
function getIcon(text, fillColor, textColor, outlineColor) {
    if (!text) text = '•';
    var iconUrl = "https://chart.googleapis.com/chart?cht=d&chdp=mapsapi&chl=pin%27i\\%27[" + text + "%27-2%27f\\hv%27a\\]h\\]o\\" + fillColor + "%27fC\\" + textColor + "%27tC\\" + outlineColor + "%27eC\\Lauto%27f\\&ext=.png";
    return iconUrl;
}
// 마커 제거 함수\
function fnRemoveMarker() {
    for (var i = 1; i < markers.length; i++) {
        markers[i].setMap(null);
        markers[i].setVisible(false);
    }

}

function setVisibleGate(chkbox) {
    if (chkbox.checked == true) {
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].type == "GATEWAY")
                markers[i].setVisible(true);
        }
    } else {
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].type == "GATEWAY" && markers[i].setpath == false)
                markers[i].setVisible(false);
        }
    }
}

function setVisibleTour(chkbox) {
    if (chkbox.checked == true) {
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].type == "TOUR")
                markers[i].setVisible(true);
        }
    } else {
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].type == "TOUR" && markers[i].setpath == false)
                markers[i].setVisible(false);
        }
    }
}

function setVisibleRest(chkbox) {
    if (chkbox.checked == true) {
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].type == "RESTAURANT")
                markers[i].setVisible(true);
        }
    } else {
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].type == "RESTAURANT" && markers[i].setpath == false)
                markers[i].setVisible(false);
        }
    }
}

function setVisibleHotel(chkbox) {
    if (chkbox.checked == true) {
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].type == "HOTEL")
                markers[i].setVisible(true);
        }
    } else {
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].type == "HOTEL" && markers[i].setpath == false)
                markers[i].setVisible(false);
        }
    }
}

$(function () {
    $("#auto").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: '/api/v1/placesList',
                //data: { mode : "KEYWORDCITYJSON" , keyword : $("#cityNm").val() },
                dataType: "json",
                success: function (data) {
                    response($.map(data, function (item) {
                        if (item.place_name.en_US.toLowerCase().indexOf($("#auto").val().toLowerCase()) >= 0) {
                            return {
                                label: item.place_name.en_US.toLowerCase().replace($("#auto").val().toLowerCase() + $("#auto").val().toLowerCase()),
                                value: item.place_name.en_US,
                                latval: item.latitude,
                                longval: item.longitude,
                                id: item.id_place
                            }
                        } else if (item.place_name.ko_KR.toLowerCase().indexOf($("#auto").val().toLowerCase()) >= 0) {
                            return {
                                label: item.place_name.ko_KR.toLowerCase().replace($("#auto").val().toLowerCase() + $("#auto").val().toLowerCase()),
                                value: item.place_name.ko_KR,
                                latval: item.latitude,
                                longval: item.longitude,
                                id: item.id_place
                            }
                        } else if (item.place_name.ja_JP.toLowerCase().indexOf($("#auto").val().toLowerCase()) >= 0) {
                            return {
                                label: item.place_name.ja_JP.toLowerCase().replace($("#auto").val().toLowerCase() + $("#auto").val().toLowerCase()),
                                value: item.place_name.ja_JP,
                                latval: item.latitude,
                                longval: item.longitude,
                                id: item.id_place
                            }
                        }
                    }));
                }
            });
        },

        minLength: 2,

        select: function (event, ui) {
            var tmp = new google.maps.LatLng(ui.item.latval, ui.item.longval)
            map.setCenter(tmp);
            for (var i = 0; i < markers.length; i++) {
                if (ui.item.id == markers[i].PlaceID) {
                    var infowindow = new google.maps.InfoWindow(); //정보창 번경
                    closeInfowindow();
                    if (markers[i].setpath) {
                        infowindow.setContent(markers[i].content2);
                        infowindow.open(map, markers[i]);
                        infoWindows[0] = infowindow;
                    } else {
                        infowindow.setContent(markers[i].content);
                        infowindow.open(map, markers[i]);
                        infoWindows[0] = infowindow;
                    }
                }
            }
        },
        open: function () {
            $(this).autocomplete("widget").width("323px");
            $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
        },
        close: function () {
            $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError);
            alert(xhr.responseText);
        }

    })


});

function autoSerch(lag, long) {
    var mapOptions = {
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(lag, long)
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    viewMarker();

} //코스 데이터 전송
function postData() {
    var courseObj = new Object();
    var courseArray = new Array();
    var tmp_startDate = markers[course[0]].date;
    var string1 = tmp_startDate.split('-');
    tmp_startDate = string1[0] + string1[1] + string1[2];
    var tmp_endDate = markers[course[labelIndex - 1]].date;
    var string2 = tmp_endDate.split('-');
    tmp_endDate = string2[0] + string2[1] + string2[2];

    courseObj.courseName = "testCourseName";
    courseObj.startDate = tmp_startDate;
    courseObj.endDate = tmp_endDate;
    courseObj.courseType = "custom";


    for (var i = 0; i < labelIndex; i++) {
        var courseInfo = new Object();
        courseInfo.unitIndex = parseInt(labelNumber[i]);
        courseInfo.placeID = parseInt(markers[course[i]].PlaceID);
        var tmp = markers[course[i]].date;
        var string = tmp.split('-');
        tmp = string[0] + string[1] + string[2];
        courseInfo.unitDate = parseInt(tmp);
        courseArray.push(courseInfo);

    }
    courseObj.courseUnit = courseArray;
    // var courseInfo = JSON.stringify(courseObj);

    $.ajax({
        type: "POST",
        url: '/api/v1/course',
        dataType: "json",
        data: courseObj,
        success: function (result) {
            resultID = result.courseID;
            location.href = "result.html?" + resultID;
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
  

}

