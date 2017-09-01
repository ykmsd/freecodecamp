

function getWikiData(url) {
  $.getJSON(url, function(data){
    formatData(data);
  });
}



function formatData(data){
  var titleArray = [];
  var contentArray = [];
  var urlArray = [];

  if (data[1].length === 0) {
    document.querySelector(".searchResult").textContent = "No result found. Try again with another word."
  } else {
    for (var i = 0; i < data[1].length; i++) {
      var title, content, wikiUrl;
      titleArray.push(data[1][i]);
      contentArray.push(data[2][i]);
      urlArray.push(data[3][i]);
    }
    displayData(titleArray, contentArray, urlArray);
  }
}

function displayData(titleArray, contentArray, urlArray){
  var list = document.createElement("ul");
  document.querySelector(".searchResult").appendChild(list);

  for(var i = 0; i < titleArray.length; i++) {

    var listBox = document.createElement("li");
    var listTitle = document.createElement("h2");
    var listContent = document.createElement("p");

    var a = document.createElement("a");
    a.setAttribute("href", urlArray[i]);
    a.setAttribute("target", "_blank");

    list.appendChild(a);

    listBox.className = "searchBox";
    listTitle.className = "searchTitle";
    listContent.className = "searchText";

    listTitle.appendChild(document.createTextNode(titleArray[i]));
    listContent.appendChild(document.createTextNode(contentArray[i]));

    a.appendChild(listBox);
    listBox.appendChild(listTitle);
    listBox.appendChild(listContent);
  }
}

$(document).ready(function(){
  $("#search").click(function() {
    var searchTerm = $("input#textInput").val();
    var url = "https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&limit=10&search=" + searchTerm;
    $(".searchResult").html("");
    getWikiData(url);
  });

  $("input#textInput").keyup(
    function(e){
      if(e.keyCode === 13) {
        var searchTerm = $("input#textInput").val();
        var url = "https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&limit=10&search=" + searchTerm;
        $(".searchResult").html("");
        getWikiData(url);
      }
    });
});
