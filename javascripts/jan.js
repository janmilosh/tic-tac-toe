//
// Declare global variables
//
var position = [0,0,0,0,0,0,0,0,0];
var line = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var sumArray = [];
var pickedArray;
var wins = [];
var blocks = [];
var corners = [];
var edges = [];
var anyOldPlace = [];
var i, index;
var computerImageId;
var newClickImageId = 'idReset';
var oldClickImageId = 'idReset';
var currentClickedId = 'idReset';
var computerMoved;
var easy = false;
var valueSum, computerImageId, picked;
var maxRandom;
var randomNumber;


//
//function to change images on hover
//
function mouseOverImage(image) {
	//
	//only do this if clicked === false
	//
	for (i = 0; i <= 8; i++) {	
		var currentId = 'img' + i;	
    	if ((currentId === image.id) && (position[i] === 0) && (currentId !== currentClickedId)) {
    		image.src = "images/purple-kitty.png";
    	}
    }
}
function mouseOutImage(image) {
	//
	//only do this if clicked === false 
	//
	for (i = 0; i <= 8; i++) {
		var currentId = 'img' + i;	
    	if ((currentId === image.id) && (position[i] === 0) && (currentId !== currentClickedId)) {
    		image.src = "images/black-kitty.png";
    	}
    }
}
//
//select square on click
//
function selectSquare(image) {
	//
	//bring back which image it is and only allow selection if clicked === false
	//
	for (i = 0; i <= 8; i++) {
		var currentId = 'img' + i;	
    	if ((currentId === image.id) && (position[i] === 0)) {
			oldClickImageId = newClickImageId;
			newClickImageId = image.id;
			document.getElementById(oldClickImageId).src = "images/black-kitty.png";
			document.getElementById(newClickImageId).src = "images/purple-kitty.png";
			currentClickedId = image.id;
			selectedIndex = i;
		}
    }
}
//
// The function for registering the move and calculating the computer's move
//
function calculate() {
	//
	// First register the player's selection
	//
	position[selectedIndex] = 1;
//
// Call the function to check for a winner now that the player's move has been registered
//
	whoWins(); 
	newClickImageId = 'idReset';
	oldClickImageId = 'idReset';
	computerMoved = false;
	//
	//Calculate sums for all 8 directions, fill wins and blocks arrays
	//
	wins = [];
	blocks = [];
	for (i = 0; i <= 7; i++) {
		sum = calculateSum(line[i][0], line[i][1], line[i][2]);	
		if (sum === -2) {
			for (j = 0; j <= 2; j++) {
				index = line[i][j];
				if (position[index] === 0) {
					wins.push(index);
				}
			}
		}
		if (sum === 2) {
			for (j = 0; j <= 2; j++) {
				index = line[i][j];
				if (position[index] === 0) {
					blocks.push(index);
				}
			}
		}
	}
	//
	//Look for a win first!
	//
	if (computerMoved === false && wins.length >= 1) {
		maxRandom = wins.length;
		randomNumber = Math.floor(Math.random() * maxRandom);
		picked = wins[randomNumber];
		computerImageId = 'img' + picked;
		position[picked] = -1;
		enterMove();
	}
	//Look for a block next!
	//
	if (computerMoved === false && blocks.length >= 1) {
		maxRandom = blocks.length;
		randomNumber = Math.floor(Math.random() * maxRandom);
		picked = blocks[randomNumber];
		computerImageId = 'img' + picked;
		position[picked] = -1;
		enterMove();
	}
	//
	// Pick the center if the player has played a corner first - opposite player is first choice
	//
	if (computerMoved === false && easy === false && position[4] === 0) {
			picked = 4;
			computerImageId = 'img' + picked;
			position[picked] = -1;
			enterMove();
	}
	//
	// Fill the corner in-between if player has picked two edges
	//
	if (computerMoved === false && easy === false) {
		if (position[1] === 1 && position[3] === 1 && position[0] === 0) {
			picked = 0;
			computerImageId = 'img' + picked;
			position[picked] = -1;
			enterMove();
		} else if (position[1] === 1 && position[5] === 1 && position[2] === 0) {
			picked = 2;
			computerImageId = 'img' + picked;
			position[picked] = -1;
			enterMove();
		} else if (position[5] === 1 && position[7] === 1 && position[8] === 0) {
			picked = 8;
			computerImageId = 'img' + picked;
			position[picked] = -1;
			enterMove();
		} else if (position[3] === 1 && position[7] === 1 && position[6] === 0) {
			picked = 6;
			computerImageId = 'img' + picked;
			position[picked] = -1;
			enterMove();
		}
	}

	//
	//Fill arrays for corner, edge, and random types of moves
	//
	corners = [];
	if (position[0] === 0) {
		corners.push(0);
	}
	if (position[2] === 0) {
		corners.push(2);
	}
	if (position[6] === 0) {
		corners.push(6);
	}
	if (position[8] === 0) {
		corners.push(8);
	}
	edges = [];
	if (position[1] === 0) {
		edges.push(1);
	}
	if (position[3] === 0) {
		edges.push(3);
	}
	if (position[5] === 0) {
		edges.push(5);
	}
	if (position[7] === 0) {
		edges.push(7);
	}
	//
	// Make a corner move if player is going for edges
	//
	if (computerMoved === false && easy === false && corners.length >= 1) {
		var edgeSum = position[1] + position[3] + position[5] + position[7];
		if (edgeSum >= 1) {
			maxRandom = corners.length;
			randomNumber = Math.floor(Math.random() * maxRandom);
			picked = corners[randomNumber];
			computerImageId = 'img' + picked;
			position[picked] = -1;
			enterMove();
		}
	}
	//
	// Make an edge move if player is going for corners
	//
	if (computerMoved === false && easy === false && edges.length >= 1) {
		var cornerSum = position[0] + position[2] + position[6] + position[8];
		if (cornerSum >= 1) {
			maxRandom = edges.length;
			randomNumber = Math.floor(Math.random() * maxRandom);
			picked = edges[randomNumber];
			computerImageId = 'img' + picked;
			position[picked] = -1;
			enterMove();
		}
	}
	//
	//Fill for random types of moves
	//
	anyOldPlace = [];
	for (i = 0; i <= 8; i++) {
		if (position[i] === 0) {
			anyOldPlace.push(i);
		}
	}
	//
	// If no other moves, make it random
	//
	if (computerMoved === false) {
		maxRandom = anyOldPlace.length;
		randomNumber = Math.floor(Math.random() * maxRandom);
		picked = anyOldPlace[randomNumber];
		computerImageId = 'img' + picked;
		position[picked] = -1;
		enterMove();
	}
	newClickImageId = 'idReset';
	oldClickImageId = 'idReset';
	computerMoved = false;
//
// Call the function to check for a winner now that the computer has made it's move
//
	whoWins(); 
}
//
// The function for registering a win
//
function whoWins() {
	var box = [];
	for (i = 0; i <= 7; i++) {
		sum = calculateSum(line[i][0], line[i][1], line[i][2]);	
		if (sum === -3) {
			alert('Sorry, the computer won.');
			position = [4,4,4,4,4,4,4,4,4];
		}
		if (sum === 3) {
			alert('Congratulations, you win!!!');
			position = [4,4,4,4,4,4,4,4,4];
		}
	}
}
//
// The function for displaying the computer's move
//
function enterMove() {
	document.getElementById(computerImageId).src = "images/green-kitty.png";
	computerMoved = true;
}
//
//Calculate the sum for a direction
//
function calculateSum(input1, input2, input3) {
	var valueSum = 0;
	var increment = input3 - input2;
	var j;
	for (j = input1; j <= input3; j += increment) {
		valueSum = valueSum + position[j];
	}
	return valueSum;
}
//
// This function will keep the computer from trying too hard
//
function easyGame() {
	easy = true;
}
//
// This function will reload the page for a new game
//
function newGame() {
	position = [0,0,0,0,0,0,0,0,0];
	sumArray = [];
	wins = [];
	blocks = [];
	corners = [];
	edges = [];
	anyOldPlace = [];
	newClickImageId = 'idReset';
	oldClickImageId = 'idReset';
	currentClickedId = 'idReset';
	easy = false;
	computerMoved = false;
	for (i = 0; i <= 8; i++) {
		var resetId = 'img' + i;	
			document.getElementById(resetId).src = "images/black-kitty.png";
    }
}