	
	// setting up the database
	var config = {
		apiKey: "AIzaSyByIWjvUEphiXmv0RmtRMAHnZYu3PYBvTA",
		authDomain: "online-store-app.firebaseapp.com",
		databaseURL: "https://online-store-app.firebaseio.com",
		storageBucket: "online-store-app.appspot.com",
		messagingSenderId: "814616524832"
	};
	// var config = {
	// 	apiKey: process.env.APIKEY,
	// 	authDomain: process.env.AUTHDOMAIN,
	// 	databaseURL: process.env.DATABASEURL,
	// 	storageBucket: process.env.STORAGEBUCKET,
	// 	messagingSenderId: process.env.MESSAGINGSENDERID
	// };
	var FIR = firebase.initializeApp(config),
		ref = FIR.database().ref(),
	userRef = FIR.database().ref('users'); 

	// DOM Manipulation
	$(document).ready(function() {
		let usernameArray = (document.URL).split('/');
		let route = usernameArray;
		route.pop();
		let routebase = decodeURI(route.join("/"));
		console.log(routebase);

		// handles page layout
		$( "#signup" ).hide();

		$( ".loginMainPage" ).css("background-image", "url(" + routebase + "/images/loginBackground.jpg)");

		$( ".main" ).css("background-image", "url(" + routebase + "/images/silverbg.jpg)");

		$( "#loginBtn" ).click(function() {
			event.preventDefault();
			console.log("#loginBtn active");
			login(routebase);
		});

		$( "#signupBtn" ).on('click', function(event) {
		event.preventDefault(); 
			console.log("#signupBtn active");
			signup();		
		});

		signupShow();
		loginShow();

	});

	// function that displays the signup Div
	function signupShow() {
		$( "#linkSignup" ).click(function() {
			console.log("#linkSignup active");
			$( "#login" ).hide('slow');
			$( "#signup" ).show('slow');
		});
	}

	// function that displays the login Div
	function loginShow() {
		$( "#linkLogin" ).click(function() {
			console.log("#linkLogin active");
			$( "#signup" ).hide('slow');
			$( "#login" ).show('slow');
		});
	}

	// function to check if the signup textfields are empty
	function signupInfo(username, email, password) {
		if ((username.length === 0) || (email.length === 0) || (password.length === 0)) return false;
		return true;
	}

	// function to check if the email supplied is valid
	function validateEmail(email) {
		let filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
		if (filter.test(email)) {
			return true;
		}	else {
			return false;
		}
	}

	// function to check if the username (for signup) already exists
	function validateUsername(name) {
		var boolToReturn = false;

		userRef.orderByChild("username").on("child_added", function(data) {
			// console.log(data.val().username);
			if (data.val().username === name) {
				boolToReturn = true;
			}
		});

		return boolToReturn;
	}

	// function that handles signup
	function signup() {
		let username = $( "#signupUsername" ).val();
		let email = $( "#signupEmail" ).val();
		let password = $( "#signupPassword" ).val();
		let errorCode = "";
		let errorMessage = "";
		let success = true;

		console.log(username + " " + email + " " + password);

		let certify = signupInfo(username, email, password);
		let validateemail = validateEmail(email);
		let validateusername = validateUsername(username);
		console.log("certify: " + certify); 
		console.log("email: " + validateemail);
		console.log("username: " + validateusername);

		// if (validateusername) {
		// 	alert("Username already taken");
		// } else 
		if (!validateemail) {
			alert("Enter a correct email address");
		} else if (validateemail && certify) {
			FIR.auth().createUserWithEmailAndPassword(email, password).then(function(){
				userRef.push ({
					username: username,
					password: password,
					accesskey: username + "-" + Math.ceil(Math.random() * 500)
				});
				alert("succesfully signed up");
				location.href = "http://localhost:3000/";
			}).catch(function(error) {
				success = false;
				errorCode = error.code;
				errorMessage = error.message;
				console.log(errorCode);
				console.log(errorMessage);
				alert(errorMessage);
			});
		} else {
			alert("Ensure all fields are properly filled");
		}
	}

	// function that handles login
	function login(routebase) {
		let username = $( "#loginUsername" ).val();
		let password = $( "#loginPassword" ).val();
		let loginkey = ""
		let certify = false;
	
		userRef.orderByChild("username").on("child_added", function(data) {
			if ((data.val().username === username) && (data.val().password === password)) {
				certify = true;
				loginkey = data.val().accesskey;
			}		
		});	

		if (certify) {
			location.href = routebase + "/managestore/" + loginkey;
		} else {
			alert("username/password incorrect");
		}
	}





