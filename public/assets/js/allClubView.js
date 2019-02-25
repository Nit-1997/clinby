// let chartData={};
// let countVar=0;
// let limit = 20;

// function formatDate (input) {
// 	var datePart = input.match(/\d+/g),
// 	year = datePart[0], 
// 	month = datePart[1], day = datePart[2];
// 	return day+'-'+month+'-'+year;
// }


// function reRender(rows,count){
// 	let $body = $('<tbody id="table-body"/>');
// 	if(count) {
// 		rows.forEach(function(item) {
// 			let $tr = $('<tr/>');

// 			$tr.append($('<td/>').append($('<img/>').attr('src', 'img/farmer.png')));
// 			$tr.append($('<td/>').html(item.name));
// 			$tr.append($('<td/>').html(item.donorType));
// 			$tr.append($('<td/>').html(item.createdAt));
// 			$tr.append($('<td/>').html(item.amount));
// 			$body.append($tr)  
// 		})
// 	}
// 	$('#table-body').replaceWith($body);
// };

(async function loadPubs(){
	let data;
	data = await $.get('/listAllPubs');
	console.log(data);
	return;
}());


