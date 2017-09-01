var app = {
  isPlayerTurn: false,
  gameInPlay: false,
  playerOne: "One",
  playerTwo: "Two",
  winCombos: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
  ],
  playerOneScore: 0,
  playerTwoScore: 0,
  timeOuts: [],
  initialiseVars: function(){
    this.numFilledIn = 0,
    this.currentBoard = {
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
      6: "",
      7: "",
      8: "",
      9: ""
    };
  },
  init: function(){
    app.initialiseVars();
    game.chooseTheSymbol();
    game.resetAll();
    var playerSymbol, computerSymbol;

  }
};

var game = {
    chooseTheSymbol: function(){
    var symbolButtons = document.querySelectorAll("#chooseTheSymbol button");

    for (var i = 0; i < symbolButtons.length; i++){
      symbolButtons[i].onclick = function(){
        app.playerSymbol = this.textContent;
        app.computerSymbol = app.playerSymbol === "X" ? "O" : "X";
        UIController.toggleChooseTheSymbol("fade");
        game.firstGame();
      }
    }
  },
  firstGame: function(){
    app.gameInPlay = true;
    game.turn = game.whoStarts();
    UIController.drawLines();
    if (game.turn === 1){
      game.play();
    } else {
      game.computerTurn();
    }
  },
  whoStarts: function(){
    var randomNumber = Math.floor(Math.random() * 2 + 1); // Choose 1 or 2 randomly
    return randomNumber;
  },
  play: function(){
    app.timeOuts.push (
      setTimeout(function(){
        UIController.showMessage(app.playerOne);
      }, 200)
    );

    app.isPlayerTurn = true;
    var checkBoxes = document.querySelectorAll("ul li");

    if(app.isPlayerTurn) {
      for (var i = 0; i < checkBoxes.length; i++){
        checkBoxes[i].onclick = function(e){
          var box = e.target;
          game.playerTurn(box);
        }
      }
    }
  },
  playerTurn: function(box){
    if (app.isPlayerTurn && box.textContent === ""){

      var symbol = app.playerSymbol;
      var number = box.id;

      game.updateBoard(number, symbol);
      UIController.updateBoard(box, symbol);

      game.endTurn(symbol);
    }
  },
  computerTurn: function(){
    app.isPlayerTurn = false;
    app.timeOuts.push(
      setTimeout(function(){
        UIController.showMessage(app.playerTwo)
      }, 800)
    );
    computer.computerWhichMove();
  },
  endTurn: function(symbol){
    app.numFilledIn++;
    if(app.gameInPlay) {
      if (game.checkWin(symbol)[0]) {
        if (app.isPlayerTurn) {
          app.playerOneScore++;
          UIController.showWinningCombination(symbol);
          app.timeOuts.push(
            setTimeout(function(){
            UIController.showResultMessage("win");
            UIController.updateScore();
            game.reset();
            }, 1800)
          );
          app.gameInPlay = false;

        } else {
          app.playerTwoScore++;
          UIController.showWinningCombination(symbol);
          app.timeOuts.push(
            setTimeout(function(){
            UIController.showResultMessage("lost");
            UIController.updateScore();
            game.reset();
            }, 1800)
          );
          app.gameInPlay = false;
        }
      } else {
        if (app.numFilledIn >= 9) {
          console.log("draw");
          setTimeout(function(){
            UIController.showResultMessage("draw");
            game.reset();
          }, 1800)
        }
        else if (app.isPlayerTurn) {
          var player = "human";
          app.timeOuts.push(
            setTimeout(function(){UIController.hideMessage(app.playerOne)
            }, 400)
          );
          app.isPlayerTurn = false;
          game.computerTurn();

        } else {
          player = "computer";
          app.timeOuts.push(
            setTimeout(function(){
              UIController.hideMessage(app.playerTwo);
              game.play();
            }, 600)
          );
        }
      }
    }
  },
  checkWin: function(symbol){
    // check current status
    var currentBoard = app.currentBoard;
    var wins = app.winCombos;
    // to put the actual winning combination
    var winningCombo = [];
    // check if there is any winning combination arrays in the current board
    var winner = wins.some(function(combination) {
      var winning = true;
      for (var i = 0; i < combination.length; i++) {
        if(currentBoard[combination[i]] !== symbol) {
          winning = false;
      }
    }
    if (winning) {
      winningCombo = combination;

    }
    return winning;
    });
    return [winner, winningCombo];
  },
  updateBoard: function(number, symbol){
    app.currentBoard[number] = symbol;
  },
  reset: function(){
    app.initialiseVars();
    app.timeOuts.push(
      setTimeout(function() {
          UIController.hideResultMessage();
          UIController.resetBoard();
          UIController.hideMessage();
          game.firstGame();
        }, 1200)
    );
  },
  resetAll: function(){
    document.querySelector("#gameInfo button").onclick = function(){
      app.timeOuts.forEach(function(timer){
        clearTimeout(timer);
      });
      document.getElementById("myCanvas").style.opacity = 0;
      app.playerOneScore = 0;
      app.playerTwoScore = 0;
      UIController.resetScore();
      UIController.toggleChooseTheSymbol();
      UIController.hideMessage();
      UIController.hideResultMessage();
      UIController.resetBoard();
      app.init();
    }
  }
};

var computer = {
  initialiseVars: function(){
    this.availableBox = [];
  },
  computerWhichMove: function(){
    symbol = app.computerSymbol;
    computer.checkAvailableBox();
    var block = computer.canBlock();
    var win = computer.canWin();

    if (win.length > 0) {
      var choice = win[Math.floor(Math.random() * win.length)];
    } else if (block.length > 0) {
      choice = block[Math.floor(Math.random() * block.length)];
    } else {
      choice = this.availableBox[Math.floor(Math.random() * this.availableBox.length)];
    }

    box = document.getElementById(choice);
    app.timeOuts.push(
      setTimeout(function(){
        game.updateBoard(choice, symbol);
        UIController.updateBoard(box, symbol);
      }, 1000)
    );

    app.timeOuts.push(
      setTimeout(function(){
        game.endTurn(symbol);
      }, 1000)
    );
  },
  checkAvailableBox: function(){
    var currentBoard = app.currentBoard;
    var length = Object.keys(currentBoard).length;
    this.availableBox = [];
    for (var i = 1; i <= length; i++){
      if (currentBoard[i] === ""){
        this.availableBox.push(i);
      }
    }
  },
  canWin: function(){
    var board = app.currentBoard;
    var possibleWins = [];

    app.winCombos.forEach(function(winCombo){
      var missing = [];
      for (var i = 0; i < winCombo.length; i++) {
        if (board[winCombo[i]] === app.computerSymbol) {
        } else {
            missing.push(winCombo[i]);
        }
      }
      if(missing.length === 1 && board[missing] === "") {
        possibleWins.push(missing);
      }
    });
    console.log(possibleWins);
    return possibleWins;
  },
  canBlock: function(){
    var board = app.currentBoard;
    var possibleBlocks = [];
    app.winCombos.forEach(function(winCombo){
      var missing = [];
      for (var i = 0; i < winCombo.length; i++) {
        if (board[winCombo[i]] === app.playerSymbol) {
        } else {
              missing.push(winCombo[i]);
        }
      }
      if (missing.length === 1 && board[missing] === "") {
        possibleBlocks.push(missing[0]);
      }
    });
    return possibleBlocks;
  }
};

var UIController = {
  toggleChooseTheSymbol: function(state){
    if (state === "fade") {
      document.getElementById("chooseTheSymbol").className = "fade";
    } else {
      document.getElementById("chooseTheSymbol").className = "";
    }
  },
  updateBoard: function(box, symbol){
    box.innerHTML = "<span>" + symbol +"</span>";
  },
  resetBoard: function(){
    var boxes = document.querySelectorAll("li");
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].innerHTML = "<span>" + "</span>";
      boxes[i].className = "";
    }
  },
  showMessage: function(who){
    document.getElementById("player" + who + "Turn").className = "fade-in";
  },
  hideMessage: function(who){
    if (who === undefined) {
      document.getElementById("playerTwoTurn").className = "fade-out";
      document.getElementById("playerOneTurn").className = "fade-out";
    } else {
      document.getElementById("player" + who + "Turn").className = "fade-out";
    }
  },
  showWinningCombination: function(symbol){
    var combo = game.checkWin(symbol)[1];
    for (var i = 0; i < combo.length; i++) {
      document.getElementById(combo[i]).className = "winCombination";
    }
  },
  showResultMessage: function(result) {
    document.getElementById(result +"Message").style.display = "block";
  },
  hideResultMessage: function() {
      document.getElementById("winMessage").style.display = "none";
      document.getElementById("lostMessage").style.display = "none";
      document.getElementById("drawMessage").style.display = "none";
  },
  updateScore: function(){
    var newScore;
    if (app.isPlayerTurn) {
      newScore = app.playerOneScore;
      document.getElementById("playerOneScore").textContent = newScore;
    } else {
      newScore = app.playerTwoScore;
      document.getElementById("playerTwoScore").textContent = newScore;
    }
  },
  resetScore: function(){
    document.getElementById("playerOneScore").textContent = 0;
    document.getElementById("playerTwoScore").textContent = 0;
  },
  drawLines: function(){
    var c = document.getElementById("myCanvas");
    c.style.opacity = "1";
    // getContext("2d") can be used to draw text, lines, boxes, circles, and more
    var ctx = c.getContext("2d");
    ctx.strokeStyle = "#80ced6";

    // vertical
    ctx.lineWidth = 2;

    // left line
    ctx.beginPath();
    ctx.moveTo(100, 2); // x, y
    ctx.lineTo(100, 148);
    ctx.stroke();

    // right line
    ctx.beginPath();
    ctx.moveTo(200, 2);
    ctx.lineTo(200, 148);
    ctx.stroke();

    // horizontal
    ctx.lineWidth = 1;

    // top line
    ctx.beginPath();
    ctx.moveTo(2, 50.5);
    ctx.lineTo(298, 50.5);
    ctx.stroke();

    // bottom line
    ctx.beginPath();
    ctx.moveTo(2, 101.5);
    ctx.lineTo(298, 101.5);
    ctx.stroke();
  }
};


app.init();
