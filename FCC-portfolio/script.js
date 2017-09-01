(function(){
  document.getElementById("workArray").onclick =
  function(){
    var list = document.getElementById("workList");
    var triangle = document.getElementById("triangle");
    if (list.style.display === "none") {
      list.style.display = "block";
      triangle.textContent = "▼"
    } else {
      list.style.display = "none";
      triangle.textContent = "▶︎"
    }
  }
})();
