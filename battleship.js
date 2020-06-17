// The view is responsible for updating the display
var view = {
	displayMessage: function(msg) {
		var msgArea = document.getElementById("messageArea");
		msgArea.innerHTML = msg;
	},
	
	displayShot: function (location, hitOrMiss){
		var location = document.getElementById(location);
		location.setAttribute("class", hitOrMiss);
	}
};



/* Model - takes care of: params(sizes:board,ship| no.:ships| loc:ship), 
						  status(no.:hits,sunk|)
						  also: a method to handle fire 
	These props are categorized in the reverse manner below*/
	
var model = {

	boardSize: 7,
	shipLength: 3,
	numShips: 3,
	shipsSunk: 0,
	
	//ships	data "You can store anything in an array" structure
	//objects stored in an array: locate by ships[index].prop[propIndx]			   	
	ships: [	{ locations: [0, 0, 0], hits: [0, 0, 0] },
				{ locations: [0, 0, 0], hits: [0, 0, 0] },
				{ locations: [0, 0, 0], hits: [0, 0, 0] }	],
		
				
	fire: function(guess) {				//In this function, you won't know any prop! USE 'THIS'
										//Declare each thing you use
		
		for(var i = 0; i < this.ships.length; i++){				//Use THIS! ,can use this.numShips too
			
			var ship = this.ships[i];
			var guessIndex = ship.locations.indexOf(guess);		//indexOf is a powerful search function :D
			if( guessIndex >= 0 ){
				
				ship.hits[guessIndex] = 1;
				
				view.displayShot(guess, "hit");
				view.displayMessage("HIT!");
				
				if( ship.hits.indexOf(0) < 0 ){					//can also write an isSunk method
					view.displayMessage("You sank my Ship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayShot(guess, "miss");						//Do both view things here too
		view.displayMessage("You missed.");
		return false;
	},
	
	generateShipLocations: function() {
		var locations;
		for(var i = 0; i < this.ships.length; i++) {
			do {
				locations = this.generateShip();
			} while(this.collision(locations, i));
			this.ships[i].locations = locations;
		}
	},
	
	
	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;
		var newShipLocations = [];
		
		if(direction === 1){				//horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			
			for(var i = 0; i < this.shipLength; i++) {
				newShipLocations.push(row + "" + (col + i));
			}
			
		} else {							//vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
			
			for(var i = 0; i < this.shipLength; i++) {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		
		return newShipLocations;
	
	},
	
	collision: function(locations, shipsFilled) {
		
		for(var i = 0; i < shipsFilled; i++) {	
			currentCheckLocations = this.ships[i].locations;
			for(var j = 0; j < this.shipLength; j++) {
				if(currentCheckLocations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}

};



/* Controller - takes care of:  guesses(get, process, track), tell model, detect game end */

var controller = {
	guessesHit: [],
	guessesMissed: [],
	
	processGuess: function(guess){
        var location = parseGuess(guess);
        if(location){
            
            if(this.guessesHit.indexOf(location) >= 0) {
            	view.displayMessage("Hit already. Nice try.");
            } else if(this.guessesMissed.indexOf(location) >= 0) {
            	view.displayMessage("Missed once. Waste another shell?");
            } else {
            	
            	var hit = model.fire(location);               	//fire method RETURNS true if hit
            	if(hit) {
            		this.guessesHit.push(location);
            	} else {
            		this.guessesMissed.push(location);
            	}
            	
            	if( hit && model.shipsSunk === model.numShips ){
                	view.displayMessage("You sank all my battleships in " + (this.guessesHit.length + this.guessesMissed.length) + " guesses!");
                
                	var input = document.getElementById("guessInput");
                	input.setAttribute("disabled");
                	var button = document.getElementById("fireButton");
                	button.setAttribute("disabled");
            	}
        	}
        }
	}
    
};



function parseGuess(guess){
    if( guess === null || guess.length !== 2 ){
        alert("Oops, please enter a valid board number!");
    } else {
        var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
        var row = alphabet.indexOf(guess.charAt(0));            //You can't index a string directly
        var col = guess.charAt(1);
        
        if( row < 0 || isNaN(row) || isNaN(col) ){
            alert("Oops, that isn't on the board!");
        } else if ( col < 0 || col >= model.boardSize ){
            alert("Oops, that's off the board!");
        } else {
            return row + col;
        }
    }
    return null;
}

function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    
    var guessInput= document.getElementById("guessInput");
    guessInput.onkeypress = handleEnterPress;
    
    model.generateShipLocations();
}

function handleFireButton() {
    var guessInput= document.getElementById("guessInput");
    var guess = guessInput.value.toUpperCase();
    controller.processGuess(guess);
    
    guessInput.value = "";                                       //Convenience :)
}

function handleEnterPress(e) {
    var fireButton = document.getElementById("fireButton");
    if(e.keyCode === 13){
        fireButton.click();
        return false;
    }
}

window.onload = init;






