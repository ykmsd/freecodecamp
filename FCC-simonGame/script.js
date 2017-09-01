var app = {
  onOffButton: document.querySelector(".onOffButton"),
  circles: document.querySelectorAll(".circle"),
  isActive: false,
  counter: 0,
  currentPlay: 0,
  timeOuts: [],
  init: function(){
    app.onOffButton.addEventListener("click", function(){
      if(!app.isActive) {
        UIController.onOffButton();
        app.isActive = true;
        app.startButton();
        app.strictButton();
        game.initGame();
      } else {
        UIController.onOffButton();
        app.isActive = false;
        UIController.startButton();
        game.resetGame();
        UIController.resetCounter();
        UIController.strictButton();
      }
    });
  },
  startButton: function(){
    var startButton = document.querySelector(".start");
    startButton.onclick = function(){
      if(!game.isGameOn && app.isActive) {
        UIController.startButton();
        game.gameStart();
      }
    };
  },
  strictButton: function(){
    var strictButton = document.querySelector(".strict");
    strictButton.onclick = function(){
        if(app.isActive) {
          UIController.strictButton();
          game.strictMode();
        }
    };
  },
  displayCongrats: function(){
    var congratsMessage = document.querySelector(".congrats");
    congratsMessage.onclick = function(){
      game.gameStart();
      UIController.hideCongrats();
    }
  }
}

app.init();

var game = {
  isStrictOn: false,
  initGame: function(){
    this.isPlayerTurn = false;
    this.isGameOn = false;
    this.playerMusicOrder = [];
    this.musicOrder = [];
    this.gameCounter = 0;
    this.i = 0;
  },
  gameStart: function (){
    this.initGame();
    UIController.resetCounter();
    this.playGame();
  },
  playGame: function(){
    this.isGameOn = true;
    this.isPlayerTurn = false;
    game.musicOrder.push(Math.floor(Math.random() * 4));
    if (game.musicOrder.length > 20) {
      UIController.displayCongrats();
      app.displayCongrats();
    } else {
      this.playerMusicOrder = [];
      this.gameCounter++;
      game.playMusic();
    }
  },
  playMusic: function(){
    this.isPlayerTurn = false;
    var musicOrder = this.musicOrder;
    game.i = 0;
    this.playDemo();
    setTimeout(function(){
      UIController.updateCounter();
    }, 500);
  },
  playDemo: function(){
    setTimeout(
      function(){
        var element = app.circles[game.musicOrder[game.i]];
        UIController.audioPlay(element);
        UIController.flashLight(element);
        game.i++;
        if (game.i < game.musicOrder.length) {
          game.playDemo();
        } else if (game.i === game.musicOrder.length) {
          game.playerTurn();
        }
      }, 500)
  },
  playerTurn: function(){
    game.isPlayerTurn = true;
    setTimeout(function(){
      game.playerMusic();
    }, 500);
  },
  playerMusic: function(){
    var counter = 0;
    for (var i = 0; i < app.circles.length; i++) {
      app.circles[i].onclick = function(e){
        if(game.isPlayerTurn) {
          var index = e.target.id;
          game.playerMusicOrder.push(Number(index));
            if (game.playerMusicOrder[counter] === game.musicOrder[counter]) {
              counter++;
              UIController.audioPlay(app.circles[index]);
              UIController.flashLight(app.circles[index]);
              if (counter === game.musicOrder.length){
                setTimeout(function(){
                  game.playGame();
                }, 500);
              }
            } else {
            game.error(e.target);
            }
        }
      }
    }
  },
  error: function(element){
    element.classList.add("error");
    UIController.counterText.textContent = "!!";
    app.circles[0].firstElementChild.play();
    app.circles[1].firstElementChild.play();
    app.circles[2].firstElementChild.play();
    app.circles[3].firstElementChild.play();
    game.playerMusicOrder = [];
    app.timeOuts.push(
      setTimeout(function(){
        element.classList.remove("error");
      }, 1000)
    );

    if(game.isStrictOn) {
      setTimeout(function(){
        game.gameStart();
      }, 1000)
    } else {
      setTimeout(function(){
        game.playMusic();
      }, 1000)
    }
  },
  strictMode: function(){
    if (game.isStrictOn) {
      game.isStrictOn = false;
    } else {
      game.isStrictOn = true;
    }
  },
  resetGame: function(){
    game.initGame();
  }
};

var UIController = {
  onOffButton: document.querySelector(".onOffButton"),
  switchBar: document.querySelector(".switch"),
  counterText: document.querySelector(".counter"),
  onOffButton: function(){
    if(!app.isActive) {
      UIController.switchBar.classList.add("on");
      UIController.counterText.classList.remove("counterOff");
    } else {
      UIController.switchBar.classList.remove("on");
      UIController.counterText.classList.add("counterOff");
    }

  },
  startButton: function(){
    if(app.isActive) {
      document.querySelector(".start").classList.add("active");
    } else {
      document.querySelector(".start").classList.remove("active");
    }
  },
  strictButton: function(){
    if(!game.isStrictOn && app.isActive) {
      document.querySelector(".strict").classList.add("active");
    } else {
      document.querySelector(".strict").classList.remove("active");
    }
  },
  updateCounter: function(){
    if (game.gameCounter < 10) {
      UIController.counterText.textContent = "0" + game.gameCounter;
    } else {
      UIController.counterText.textContent = game.gameCounter;
    }
  },
  resetCounter: function(){
    UIController.counterText.textContent = "--";
  },
  flashLight: function(element){
    element.classList.add("flash");
    app.timeOuts.push(
      setTimeout(
        function(){
          element.classList.remove("flash");
        }, 300)
    );
  },
  displayCongrats: function(){
    document.querySelector(".congrats").style.display = "block";
  },
  hideCongrats: function(){
    document.querySelector(".congrats").style.display = "none";
  },
  // when button is rapidly clicked, to make sure it plays all the sound
  audioPlay: function(element){
        var className = element.classList[0];
        var musicId = Number(document.querySelector("." + className).id) + 1;
        var audio = document.querySelector("." + className).firstElementChild;
        audio.src =
        "https://s3.amazonaws.com/freecodecamp/simonSound" + musicId + ".mp3";
        audio.play();
    }
};
