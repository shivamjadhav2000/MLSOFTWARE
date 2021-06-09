 //general helperfunction 
 function handleToggle(){
  
  var element = document.body;
  document.getElementById("navCont").classList.toggle("navLightMode")
  document.getElementById("subNavCont").classList.toggle("subNavDarkMode")
  var anchorTemp = document.getElementsByTagName("a")
  var navbarHover =document.getElementsByTagName("p")
   element.classList.toggle("dark-mode");
   for(let i=0;i<anchorTemp.length;i++){
     anchorTemp[i].classList.toggle("myanchorToggle")
   }
   for(var j=0;j<navbarHover.length;j++){
     if(navbarHover[j].className==="navItem"){
    navbarHover[j].className="navItemDark"
     }
     else {
      navbarHover[j].className="navItem"
     }
  }

}