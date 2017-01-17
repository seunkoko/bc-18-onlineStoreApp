	
	// setting up my database
	var config = {
		apiKey: "AIzaSyByIWjvUEphiXmv0RmtRMAHnZYu3PYBvTA",
		authDomain: "online-store-app.firebaseapp.com",
		databaseURL: "https://online-store-app.firebaseio.com",
		storageBucket: "online-store-app.appspot.com",
		messagingSenderId: "814616524832"
	};
  var FIR = firebase.initializeApp(config),
			ref = FIR.database().ref();
	userRef = FIR.database().ref('users'); 

	// DOM Manipulation
	$(document).ready(function() {

		// handles page layout
		$( "#signup" ).hide();

		$( "#loginBtn" ).click(function() {
			event.preventDefault();
			console.log("#loginBtn active");
			login();
		});

		$( "#signupBtn" ).on('click', function(event) {
    	event.preventDefault(); 
			console.log("#signupBtn active");
			signup();		
		});

		signupShow();
		loginShow();

	});

	function signupShow() {
		$( "#linkSignup" ).click(function() {
			console.log("#linkSignup active");
			$( "#login" ).hide('slow');
			$( "#signup" ).show('slow');
		});
	}

	function loginShow() {
		$( "#linkLogin" ).click(function() {
			console.log("#linkLogin active");
			$( "#signup" ).hide('slow');
			$( "#login" ).show('slow');
		});
	}

	function signupInfo(username, email, password) {
		if ((username.length === 0) || (email.length === 0) || (password.length === 0)) return false;
		return true;
	}

	function validateEmail(email) {
		let filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
		if (filter.test(email)) {
			return true;
		}	else {
			return false;
		}
	}

	function validateUsername(username) {
		userRef.orderByChild("username").on("child_added", function(data) {
			if (data.val().username === username) return true;
		});
		return false;
	}

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
		console.log(certify); 
		console.log(validateemail);

		if (!validateusername) {
			alert("Username already taken");
		} else if (!validateemail ) {
			alert("Enter a correct email address");
		} else if (validateusername && validateemail && certify) {
			FIR.auth().createUserWithEmailAndPassword(email, password).then(function(){
				userRef.push ({
					username: username,
					password: password,
					accesskey: username + "-" + (Math.random() * 500)
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

	function login() {
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
			location.href = "http://localhost:3000/" + loginkey;
		} else {
			alert("username/password incorrect");
		}
	}





