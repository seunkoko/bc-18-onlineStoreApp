
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

		let usernameUpper = username.toUpperCase();
		$( "#headerText" ).text(usernameUpper + " Store");

		$( "#shareurl" ).text("share url: http://localhost:3000/" + username);

		$( "#divViewProduct" ).hide();

		$( "#signout" ).on('click', function(event) {
    	event.preventDefault(); 
			FIR.auth().signOut().then(function() {
				alert("Logged out");
				location.href = "http://localhost:3000/";
			}, function(error) {
				console.log(error.code);
				console.log(error.message);
			});
		});

		$( "#productaddBtn" ).on('click', function(event) {
    	event.preventDefault(); 
			console.log("#productaddBtn active");

			let productName = $( "#productName" ).val();
			let productPrice = $( "#productPrice" ).val();
			let productCat = $( "#productCat" ).val();
			console.log(productName + " " + productPrice + " " + productCat);

			addProduct(username, productName, productPrice, productCat);
		});	

		$( "#addProduct" ).click(function() {
			$( "#divAddProduct" ).show('slow');
			$( "#divViewProduct" ).hide('slow');
		});

		$( "#viewProduct" ).click(function() {
			$( "#divViewProduct" ).show('slow');
			$( "#divAddProduct" ).hide('slow');	
			onloadViewProduct(username);
		});

	});

	// function that loads the products for display on the viewProduct
	function onloadViewProduct(name) {

		userRef.on("value", function(snapshot) {
			emptyViewDiv();

			for (userKey in snapshot.val()) {
				if (snapshot.val()[userKey].username === name) {
					// console.log(userKey);
					let storeRef = FIR.database().ref('users/' + userKey + "/store");
					storeRef.orderByKey().on("value", function(snapshot){

						for (key in snapshot.val()) {
							let name = key;
							let price = "$" + snapshot.val()[key].price;
							let category = snapshot.val()[key].category;

							if (category === "Trouser/Pants") {
								category = "trouser";
							}

							if (category === "Wrist-watches") {
								category = "watch";
							}

							displayProduct(name, price, category);
						}

					}, function(error) {
						console.log("Error: " + error.code);
					});
				}
			}

		});
	}

	function emptyViewDiv() {
		$("#divViewProduct").empty();
	}

	// function that appends the products attached to a store for display
	function displayProduct(name, price, img) {
		$("<div class='col col-md-4 toViewProduct'>"
				+ "<img src='/images/" + img + ".PNG' class='productImage' alt='image' />"
				+ "<label class='productLabel'>" + name + "</label>"
				+ "<div class='priceHolder'>"
				+	"<p class='priceTag'>" + price + "</p>"
				+ "</div>" 
				+ "</div>")
		.appendTo("#divViewProduct");
	}

	// function that updates the user's store account with details of product
	function addProduct(userName, productName, productPrice, productCat) {
		let certify = validatePrice(productPrice);
		console.log("validatePrice: " + certify);

		if (!certify) {
			alert("Price should be a number");
		} else if (!isFieldEmpty(productName, productPrice)) {
			alert("Enter details in all boxes");
		} else {
			userRef.orderByChild("username").on("child_added", function(data) {
				if (data.val().username === userName) {
					let storeRef = FIR.database().ref('users/' + data.key + "/store");
					// console.log(storeRef);

					storeRef.child(productName).set({
						price: productPrice,
						category: productCat
					});

					alert("Product added");
					setFieldEmpty("productName");
					setFieldEmpty("productPrice");
				}
			});

		}
	}

	// function to validate if price is a number
	function validatePrice(price) {
		let regex = /[0-9]|\./;
		let priceArray = price.split("");
		// console.log(priceArray);

		for (let i = 0; i < priceArray.length; i++) {
			if (!regex.test(priceArray[i])) {
				return false;
			}
		}

		return true;
	}

	// function to check if the textfields are empty
	function isFieldEmpty(productName, productPrice) {
		console.log(productName.length + " " + productPrice.length);

		if ((productName.length === 0) || (productPrice.length === 0)) {
			return false;	
		} else {
			return true;
		}
	}

	// function to set field empty
	function setFieldEmpty(fieldId) {
		$("#" + fieldId).val("")
	}

