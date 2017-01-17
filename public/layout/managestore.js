
	// setting up the database
	var config = {
		apiKey: "AIzaSyByIWjvUEphiXmv0RmtRMAHnZYu3PYBvTA",
		authDomain: "online-store-app.firebaseapp.com",
		databaseURL: "https://online-store-app.firebaseio.com",
		storageBucket: "online-store-app.appspot.com",
		messagingSenderId: "814616524832"
	};
 	var FIR = firebase.initializeApp(config),
		ref = FIR.database().ref(),
	userRef = FIR.database().ref('users'); 
	
	// DOM manipulation
	$(document).ready(function() {
		console.log(document.URL);
		let usernameArray = (document.URL).split('/')
		let username = usernameArray[usernameArray.length - 1].split('-')[0];
		console.log(username);

		$( "#divAddProduct" ).show('slow');
		$( "#divViewProduct" ).hide();

		$( "#addProduct" ).click(function() {
			$( "#divAddProduct" ).show('slow');
			$( "#divViewProduct" ).hide('slow');
		});

		$( "#viewProduct" ).click(function() {
			$( "#divViewProduct" ).show('slow');
			$( "#divAddProduct" ).hide('slow');
		});

	});
