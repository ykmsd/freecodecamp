(function () {
  var timerTime = document.getElementById("timerTime");
  var switchButton = document.getElementById("switchButton");
  var changeTimeButtons = document.querySelectorAll("#changeTimeButtons button");

  var sessionLength = 20;
  var breakLength = 5;

  var timerActive = "notActive";
  var breakTime = false;
  var isPaused = false;
  var countdown, minutes, seconds;


// Change the time to "minustes: seconds" form and update the view
  function updateTheTimer (length) {
    var duration = length;
    minutes = parseInt((duration / 60), 10);
    seconds = parseInt((duration % 60), 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    timerTime.textContent = minutes + ":" + seconds;
  }

  for (var i = 0; i < changeTimeButtons.length; i++) {
    changeTimeButtons[i].onclick = function(e) {

      var clickedButton = e.target;
       if (e.target.parentElement.id === "sessionLengthSetUp") {

          if (e.target.className === "plus") {
            ++sessionLength;
          } else {
            if (sessionLength <= 1) {
              sessionLength;
            } else {
              --sessionLength;
            }
          }

        document.getElementById("sessionTime").textContent = sessionLength;
        timerTime.textContent = sessionLength;
        updateTheTimer(sessionLength * 60);
        timerActive = "notActive";
        clearInterval(countdown);

      } else {
        if (e.target.className === "plus") {
          ++breakLength;
        } else {
          if (breakLength <= 1){
            breakLength;
          } else {
            --breakLength;
          }
        }
        document.getElementById("breakTime").textContent = breakLength;
      }
    };
  }

  switchButton.onclick = function(){
    if (timerActive === "notActive") {
      timerActive = "active";
      isPaused = false;
      runTimer(sessionLength);

    } else if (timerActive === "paused") {
      timerActive = "active";
      isPaused = false;

    } else if (timerActive === "active") {
      isPaused = true;
      pauseTimer();
    }

    changeView();
  }

  function changeView () {
    if (timerActive === "active" || timerActive === "notActive") {
      switchButton.textContent = "Pause";
      switchButton.id = "switchButtonActive";
      document.querySelector("body").className = "active";
      document.querySelector(".timerIsRunning").style.display = "block";

    } else if (timerActive === "paused") {
      switchButton.textContent = "Start";
      switchButton.id = "switchButton";
      document.querySelector("body").className = "";
    }
  }

  function runTimer(duration){
    var timer = duration * 60 - 1;

    // assign it to the variable so that it can stop with that
    countdown = setInterval(function(){
        if(!isPaused) {
          updateTheTimer(timer);

          -- timer;

          if(breakTime) {
            document.querySelector(".timerIsRunning").textContent = "Break Time";
          } else {
            document.querySelector(".timerIsRunning").textContent = "Session Time";
          }

          if (timer < 0) {
           breakTime = !breakTime;
            if (breakTime) {
              timer = breakLength * 60;
            } else {
              timer = sessionLength * 60;
            }
         }
       }
    }, 1000);
  };

    function pauseTimer(){
      document.querySelector(".timerIsRunning").style.display = "none";
      timerActive = "paused";
    };



})();
