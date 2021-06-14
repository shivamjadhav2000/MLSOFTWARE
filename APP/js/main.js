let data=null

function handleToggle(){
  var element = document.body;
  document.getElementById("navCont").classList.toggle("navLightMode")
  document.getElementById("modelBase").classList.toggle("modelBaseDark")

  document.getElementById("subNavCont").classList.toggle("subNavDarkMode")
  let toggleImg=document.getElementById("toggleImg").src.split("/")
  toggleImg=toggleImg[toggleImg.length-1]
  document.getElementById("toggleImg").src=toggleImg==="half-moon.png"?"assests/sunny.png":"assests/half-moon.png"
  var anchorTemp = document.getElementsByTagName("a")
  var navbarHover =document.getElementsByTagName("span")
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
function dummyTesting1(){
  eel.dummyTesting()(r=>{
    console.log(r)
  })
}
function handleAlgo(event){
  event.preventDefault()
  eel.getMetaData(event.target.Algorithm.value)(r=>{
    data=r
    targetSelect=document.getElementsByClassName('custom-select')[0]
    let temp=`<option selected>Select Dependent Variable</option>`
    for(let i=0;i<data.totalSelectedFeatures.length;i++){
      temp+=`<option>${data.totalSelectedFeatures[i]}</option>`
    }
    targetSelect.innerHTML=temp
  })
  
}