
$(function() {

	$( "#in_air" ).autocomplete({

		source: function( request, response ) {

			$.ajax({

                dataType: "json",
				success: function( data ) {
					response( $.map( data, function( item ) {

						if (item.place_name.en_US.toLowerCase().indexOf($("#in_air").val().toLowerCase()) >= 0 && item.place_type=="GATEWAY")
						{

							return {

								label: item.place_name.en_US.toLowerCase().replace($( "#in_air" ).val().toLowerCase()+ $( "#in_air" ).val().toLowerCase() ),

								value: item.place_name.en_US,
                                 latitude : item.latiude,
                                longtitude : item.longitude,
							}

						}
                        else if (item.place_name.ko_KR.toLowerCase().indexOf($("#in_air").val().toLowerCase()) >= 0 && item.place_type=="GATEWAY")

						{

							return {

								label: item.place_name.ko_KR.toLowerCase().replace($( "#in_air" ).val().toLowerCase()+ $( "#in_air" ).val().toLowerCase() ),

								value: item.place_name.ko_KR,
                                 latitude : item.latiude,
                                longtitude : item.longitude,
							}

						}
                         else if (item.place_name.ja_JP.toLowerCase().indexOf($("#in_air").val().toLowerCase()) >= 0 && item.place_type=="GATEWAY")

						{

							return {

								label: item.place_name.ja_JP.toLowerCase().replace($( "#out_air" ).val().toLowerCase()+ $( "#out_air" ).val().toLowerCase() ),

								value: item.place_name.ja_JP,
                                latitude : item.latiude,
                                longtitude : item.longitude,
							}

						}

					}));

				}

			});

		},

		minLength: 2,

		select: function( event, ui ) {
           // latValue(ui.item.latitude);
            //longValue(ui.item.longitude);
		},
		open: function() {
			$( this ).autocomplete("widget").width("323px");
			$( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
		},
		close: function() {
			$( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
		},
		error: function(xhr, ajaxOptions, thrownError){ alert(thrownError);  alert(xhr.responseText); }
	})
});


$(function() {



	$( "#out_air" ).autocomplete({

		source: function( request, response ) {

			$.ajax({


				//data: { mode : "KEYWORDCITYJSON" , keyword : $("#cityNm").val() },

				dataType: "json",

				success: function( data ) {

					response( $.map( data, function( item ) {

						if (item.place_name.en_US.toLowerCase().indexOf($("#out_air").val().toLowerCase()) >= 0 && item.place_type=="GATEWAY")

						{

							return {

								label: item.place_name.en_US.toLowerCase().replace($( "#out_air" ).val().toLowerCase()+ $( "#out_air" ).val().toLowerCase() ),

								value: item.place_name.en_US,

							}

						}
                        else if (item.place_name.ko_KR.toLowerCase().indexOf($("#out_air").val().toLowerCase()) >= 0 && item.place_type=="GATEWAY")

						{

							return {

								label: item.place_name.ko_KR.toLowerCase().replace($( "#out_air" ).val().toLowerCase()+ $( "#out_air" ).val().toLowerCase() ),

								value: item.place_name.ko_KR,

							}

						}
                         else if (item.place_name.ja_JP.toLowerCase().indexOf($("#out_air").val().toLowerCase()) >= 0 && item.place_type=="GATEWAY")

						{

							return {

								label: item.place_name.ja_JP.toLowerCase().replace($( "#out_air" ).val().toLowerCase()+ $( "#out_air" ).val().toLowerCase() ),

								value: item.place_name.ja_JP,

							}

						}

					}));

				}

			});

		},

		minLength: 2,

		select: function( event, ui ) {

			

		},

		open: function() {

			$( this ).autocomplete("widget").width("323px");

			$( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );

		},

		close: function() {

			$( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );

		},

		error: function(xhr, ajaxOptions, thrownError){ alert(thrownError);  alert(xhr.responseText); }

	})


});


