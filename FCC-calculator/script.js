(function(){
	var buttons = document.querySelectorAll("button");
	var displayAnswer = document.getElementById("answer");
	var displayLog = document.getElementById("history");
	var answer = ""; // for calculation
	var entry = ""; // current input
	var current = ""; // current entry   
	var log = ""; // history 
	var reset = "";
	var operators = ["+", "-", "×", "÷"];
	
	// Round answers e.g. 1.005 * 100 = 100.5 instead of 100.49999...
	function decimals (log) {
		var regex = /\+|\-|\*|\//;
		var array = log.split(regex);
		var lengthInArray = array.map(function(number){
			if (number.toString().indexOf(".") > -1) {
				return number.split(".")[1].length;
			} else {
				return 0;
			}
		});
		var greatestDecimalPlace = lengthInArray.reduce(
			function(a, b){
				return Math.max(a,b);
			});
		return greatestDecimalPlace;
	}

	function toFixed (value, log) {
		var precision = decimals(log);
		var power = Math.pow(10, precision);
		return (Math.round((value) * power) / power).toString();
	}
	
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].onclick = function(e){
			var entry = e.target.textContent;

			// reset log and answer after "equal" 
			if (reset) {
			if (operators.indexOf(entry) !== -1) {
				
			} else {
				answer = "";
				log = "";
			}
			} 

			reset = false;	


			// All clear or Clear entry 
			if (entry === "AC") {
				answer = "";
				current = "";
				entry = "";
				log = "";
				displayAnswer.innerHTML = "0";
				displayLog.innerHTML = "0";
			} else if (entry === "CE") {
				log = log.slice(0, -current.length);
				answer = answer.slice(0, -current.length);
				displayLog.textContent = log;
				displayAnswer.textContent = "0";
				current = answer;
				entry = "";
			}

			// prevents more than one decimal
			if (entry === "." && current.indexOf(".") > -1) {
				entry = "";
			}

			// prevents improper first degit 
			if (answer.length === 0 && isNaN(entry) && entry !== "." || answer.length === 0 && entry === "0") {
					entry = "";
			}

			// prevents extra operators 
			if (current !== "noChange") {
				if (current === "" & isNaN(entry) && entry !== "." || isNaN(current) && isNaN(entry) && entry !== ".") {
					entry = "";
				}	
			}

			// combining number
			while (Number(entry) || entry === "0") {
				if (isNaN(current) && Number(entry)) {
				current = "";
				}
				current += entry;
				answer += entry;
				log+= entry;
				displayAnswer.textContent = current;
				displayLog.textContent = log;
				entry = "";

			}

			// Operators 
			if (entry === ".") {
				if (current === "" || isNaN(current[current.length - 1])) {
					current = "0.";
					answer += entry;
					log += current;
					displayAnswer.textContent = current;
					displayLog.textContent = log;
				} else {
					current = current.concat(".");
					answer += entry; 
					log = answer;
					displayAnswer.textContent = current;
					displayLog.textContent = log;
				}
				entry = "";

			} else if (entry === "÷") {
				current = "/";
				answer = eval(answer) + current;
				log += "÷";
				displayAnswer.textContent = "÷";
				displayLog.textContent = log;
				entry = "";
			} else if (entry === "×") {
				current = "*";
				answer = eval(answer) + current;
				log += "×";
				displayAnswer.textContent = "×";
				displayLog.textContent = log;
				entry = "";
			} else if (entry === "-") {
				current = "-";
				answer = eval(answer) + current;
				log += current; 
				displayAnswer.textContent = "-";
				displayLog.textContent = log;
				entry = "";
			} else if (entry === "+") {
				current = "+";
				answer = eval(answer) + current;
				log += current;
				displayAnswer.textContent = "+";
				displayLog.textContent = log;
				entry = "";
			} else if (entry === "=") {
				if (current[current.length-1] === ".") {
					entry = "";
				} else {
					answer = toFixed(eval(answer), log);
					current = answer;
					displayAnswer.textContent = answer;
					log += entry + answer;
					displayLog.textContent = log;
					log = answer;
					entry = "";
					current = "noChange";
					reset = true;
				}
			}
		}

	
	}
})();

