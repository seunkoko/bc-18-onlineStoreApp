	
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
 	var FIR = firebase.initializeApp(config);
	var	ref = FIR.database().ref();
	var userRef = FIR.database().ref('users'); 
	
	// DOM manipulation
	$(document).ready(function() {
		let usernameArray = (document.URL).split('/');
		let username = decodeURI(usernameArray[usernameArray.length - 1].split('-')[0]);
		let route = usernameArray;
		route.pop();
		route.pop();
		let routebase = decodeURI(route.join("/"));
		
		$( "#sharedHeader" ).text(username.toUpperCase() + " Store"); 

		$( ".page-body-ms" ).css("background-image", "url(" + routebase + "/images/silverbg.jpg)");

		$( "#sharedView" ).css("background-image", "url(" + routebase + "/images/silverbg.jpg)");

		$ ( "#page-footer" ).css("background-color", "#f2f2f2");
		$ ( "#page-footer" ).css("border-top", "thick double #999999");

		emptyViewDiv("#sharedView");
		onloadViewProduct(username, "#sharedView");

		let usernameUpper = username.toUpperCase();
		$( "#headerText" ).text(usernameUpper + " Store"); 

		$( "#shareurl" ).text(routebase + "/" + username);

		$( "#divViewProduct" ).hide();

		$( "#signout" ).on('click', function(event) {
			event.preventDefault(); 
			FIR.auth().signOut().then(function() {
				alert("Logged out");
				location.href = routebase;
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
			let productCat = $( "#productCat" ).val().toLowerCase();
			// let productImage = $( "#imageToUpload" ).val();
			let productStock = $( "#productStock" ).val();

			addProduct(username, productName, productPrice, productCat, productStock);
			
			// let imageTested = testUploadedImage(productImage); 
			// let imageToSave = productImage.split("\\");
			// if (imageTested) {
			// 	addProduct(username, productName, productPrice, productCat, productStock);
			// } else {
			// 	addProduct(username, productName, productPrice, productCat, productStock);
			// }	

			$( "#divViewProduct" ).show('slow');
			$( "#divAddProduct" ).hide('slow');	
			$( "#divViewProduct" ).css("background-color", "#ffffff");
			$( "#divViewProduct" ).css("width", "auto");
			onloadViewProduct(username, "#divViewProduct");
		});	

		$( "#addProduct" ).click(function() {
			$( "#divAddProduct" ).show('slow');
			$( "#divViewProduct" ).hide('slow');
		});

		$( "#viewProduct" ).click(function() {
			$( "#divViewProduct" ).show('slow');
			$( "#divAddProduct" ).hide('slow');	
			$( "#divViewProduct" ).css("background-color", "#ffffff");
			$( "#divViewProduct" ).css("width", "auto");
			onloadViewProduct(username, "#divViewProduct");
		});

	});

	// function that loads the products for display on the viewProduct
	function onloadViewProduct(name, appendiv) {

		userRef.on("value", function(snapshot) {
			emptyViewDiv("#divViewProduct");
			emptyViewDiv("#sharedView");

			for (userKey in snapshot.val()) {
				if (snapshot.val()[userKey].username === name) {
					// console.log(userKey);
					let storeRef = FIR.database().ref('users/' + userKey + "/store");
					storeRef.orderByKey().on("value", function(snapshot){

						for (key in snapshot.val()) {
							let name = key;
							let price = "$" + snapshot.val()[key].price;
							let category = snapshot.val()[key].category;
							let stock = snapshot.val()[key].stock;

							if (category === "Trouser/Pants") {
								category = "trouser";
							}

							if (category === "Wrist-watches") {
								category = "watch";
							}

							displayProduct(name, price, category, stock, appendiv);
						}

					}, function(error) {
						console.log("Error: " + error.code);
					});
				}
			}

		});
	}

	function emptyViewDiv(divToEmpty) {
		$(divToEmpty).empty();
	}

	// function that appends the products attached to a store for display
	function displayProduct(name, price, cat, stock, appendiv) {
		$("<div class='col col-md-4 toViewProduct'>"
				+ "<img src='/images/" + cat + ".PNG' class='productImage' alt='image' />"
				+ "<label class='productLabel'>" + name + "</label>"
				+ "<div class='priceHolder'>"
				+ "<p class='priceTag'>" + price + "</p>"
				+ "</div>"
				+ "<div class='stockHolder'>"
				+ "<p class='priceTag'>Available: " + stock + "</p>"
				+ "</div>" 
				+ "</div>")
		.appendTo(appendiv);
		console.log(appendiv);
	}

	// function that updates the user's store account with details of product
	function addProduct(userName, productName, productPrice, productCat, productStock) {
		let certifyPrice = validatePrice(productPrice);
		let certifyStock = validatePrice(productStock);

		if (!certifyStock || !certifyPrice) {
			alert("Price should be a number");
		}  else if (productPrice < 0) {
			alert("Price cannot be a negative value");
		} else if (productStock <= 0) {
			alert("Stock should be more than 0");
		} else if (!isFieldEmpty(productName, productPrice)) {
			alert("Enter details in all boxes");
		} else {
			userRef.orderByChild("username").on("child_added", function(data) {
				if (data.val().username === userName) {
					let storeRef = FIR.database().ref('users/' + data.key + "/store");
					// console.log(storeRef);

					storeRef.child(productName).set({
						price: productPrice,
						category: productCat,
						stock: productStock
					});

					alert("Product added");
					setFieldEmpty("productName");
					setFieldEmpty("productPrice");
					setFieldEmpty("productStock");
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

	// function to test extension for uploaded images
	function testUploadedImage(image) {
		let testExtensionArray1 = image.split("/");
		let testExtensionArray2 = testExtensionArray1[testExtensionArray1.length - 1].split(".");
		let testExtension = testExtensionArray2[testExtensionArray2.length - 1].toLowerCase();
		let arrayExtension = ["jpeg", "jfif", "gif", "png"];
		
		for (let i = 0; i < arrayExtension.length; i++) {
			if (arrayExtension[i] === testExtension) {
				return true;
			}
		}

		return false;
	}


