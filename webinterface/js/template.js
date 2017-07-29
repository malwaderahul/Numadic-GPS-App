$(document).ready(function(){

	//Initialize tooltips
	$('.show-tooltip').tooltip();

	//Product Details
	// $.ajax({
	// 	url : "/mobile"

	// }).done(function(response){

	// 	var domId = document.getElementById('#mobiles');

		
	// 	console.log("mobile");
	// 	console.log(response);
	// 	$.each(response.data, function(index, data){
    //         $("#mobiles ul").append('<li>' + data.name + '</li>');
    //     });
	// 	var jsonStr = JSON.stringify(response);
	// 	$("#mobiles").append(jsonStr);
	// });

	//cartDetails
	// $.ajax({
	// 	url : "/cart"
	// }).done(function(response){

	// 	var cartList = $('#cartList');
	// 	console.log("cartDetails");
	// 	console.log(response);
	// 	$.each(response.data, function(index, data){
    //         $("#cartList").append('<li>' + data.name + '</li>');
    //     });
	// });

	

	$( window ).resize(function() {
		$('.col-footer:eq(0), .col-footer:eq(1)').css('height', '');
		var footerColHeight = Math.max($('.col-footer:eq(0)').height(), $('.col-footer:eq(1)').height()) + 'px';
		$('.col-footer:eq(0), .col-footer:eq(1)').css('height', footerColHeight);
	});
	$( window ).resize();

});