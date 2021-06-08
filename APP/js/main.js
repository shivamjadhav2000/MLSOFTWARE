//general helperfunction 
function handleToggle(){
    var element = document.body;
    var anchorTemp = document.getElementsByTagName("a")
     element.classList.toggle("dark-mode");
     for(let i=0;i<anchorTemp.length;i++){
       anchorTemp[i].classList.toggle("myanchorToggle")
     }
  
  }