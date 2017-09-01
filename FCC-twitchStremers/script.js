var channels = ["freecodecamp", "ESL_SC2", "OgamingSC2"]
var data;

function getTwitchData(channel){
  $.getJSON('https://wind-bow.gomix.me/twitch-api/streams/' + channel + '?callback=?', function(data) {
    formatData(data, channel);
    window.data = data;
  });
}

function formatData(data, channel) {
  var content = document.querySelector("#" + channel + " " + ".description");
  var logo = document.querySelector("." + channel + ".icon");
  var name = document.querySelector(".channelName");
  var link = document.querySelector("#" + channel + " " + ".channelName");

  if (data.stream === null) {
    content.textContent = "Offline";

    var a = document.createElement("a");
    var aText = document.createTextNode(channel);
    var url = "https://www.twitch.tv/" + channel;

    a.setAttribute("href", url);
    a.setAttribute("target", "_blank");
    link.appendChild(a);
    a.appendChild(aText);


  } else {
    content.textContent = data.stream.channel.status;
    var img = document.createElement("img");
    img.src = data.stream.channel.logo;
    logo.appendChild(img);

    var a = document.createElement("a");
    var aText = document.createTextNode(channel);
    a.setAttribute("href", data.stream.channel.url);
    a.setAttribute("target", "_blank");
    link.appendChild(a);
    a.appendChild(aText);
  }
}

(function(){
  channels.forEach(function(channel){
    getTwitchData(channel);
  });
})();
