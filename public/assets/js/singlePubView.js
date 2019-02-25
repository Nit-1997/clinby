document.getElementById('rzp-button1').onclick = async function(e){
  var options = {
    "key": "rzp_test_RVcbfjLehUkMu8", 
    "amount": 180000,
    "name": "CLUBBO",
    "description": "pay and party!!",
    "image": "https://res.cloudinary.com/dskmn0vwa/image/upload/v1536835129/vwksex931egcntozjcg6.jpg",
    "handler": function (response){
     console.log(response.razorpay_payment_id);
     
    //  $.post({
    //   url: 'localhost:7000/book',
    //   data: response,
    //   dataType: 'json',
    //   success: function (data) {
    //       window.open("localhost:7000/ticket");
    //       window.location.href = 'localhost:7000/ticket';
    //   }
    // });

    $.post( "/book",response)
    .done(function( data ) {
        window.open("http://localhost:7000/ticket");
        //window.location.href = 'localhost:7000/ticket'; 
    });

  },
  "prefill": {
    "name": "",
    "email": ""
  },
  "notes": {
    "address": ""
  },
  "theme": {
    "color": "#a7f442"
  }
};

var rzp1 = new Razorpay(options);

rzp1.open();
e.preventDefault();
}
