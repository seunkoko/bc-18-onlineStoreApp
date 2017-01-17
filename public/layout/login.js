	
	$(document).ready(function() {

		// setting up my database
		var dbRef = new Firebase('https://online-store-app.firebaseio.com');
		
		// handles page layout
		$( "#signup" ).hide();

		$( "#signupBtn" ).click(function() {
			console.log("#signupBtn active");
		});

		$( "#linkSignup" ).click(function() {
			console.log("#linkSignup active");
			$( "#login" ).hide('slow');
			$( "#signup" ).show('slow');
		});

		$( "#linkLogin" ).click(function() {
			console.log("#linkLogin active");
			$( "#signup" ).hide('slow');
			$( "#login" ).show('slow');
		});


	});





