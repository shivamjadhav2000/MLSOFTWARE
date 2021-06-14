let data=null
let ChosenAlgorithm=''
let AlgorithmParamsData={}
let TargetVariable=''
function handleToggle(){
  var element = document.body;
  document.getElementById("navCont").classList.toggle("navLightMode")
  document.getElementById("modelBase").classList.toggle("modelBaseDark")
  document.getElementById("targetData").classList.toggle("Container1Dark")
  document.getElementById("subNavCont").classList.toggle("subNavDarkMode")
  let inputs=document.getElementsByTagName("input")
  let toggleImg=document.getElementById("toggleImg").src.split("/")
  for(let k=0;k<inputs.length;k++){
    inputs[k].classList.toggle("inputDark")
  }
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
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
async function handleBuildSpin(){
 let BuildImg= document.getElementById("BuildImg")
 AlgorithmParamsData["lr"]=parseFloat(document.forms['modelBase'].elements['lr'].value);
 AlgorithmParamsData["lambda"]=parseFloat(document.forms['modelBase'].elements['lambd'].value);
 AlgorithmParamsData["epochs"]=parseInt(document.forms['modelBase'].elements['epochs'].value);
 AlgorithmParamsData["batch_size"]=parseInt(document.forms['modelBase'].elements['batch_size'].value);
 TargetVariable=document.forms['modelBase'].elements['Y'].value;

 console.log("value=",AlgorithmParamsData)
 BuildImg.className="spinner"
 eel.build(AlgorithmParamsData,ChosenAlgorithm,TargetVariable)((r)=>{
   console.log(r)
   BuildImg.className=""

 })


}

function handleAlgo(event){
  event.preventDefault()
  ChosenAlgorithm=event.target.Algorithm.value
  eel.getMetaData(ChosenAlgorithm)(r=>{
    data=r
    document.getElementsByName("batch_size")[0].placeholder=`enter Batch size range between 1-${data.datasetSize}`
    targetSelect=document.getElementsByClassName('custom-select')[0]
    let temp=`<option selected>Select Dependent Variable</option>`
    for(let i=0;i<data.totalSelectedFeatures.length;i++){
      temp+=`<option>${data.totalSelectedFeatures[i]}</option>`
    }
    targetSelect.innerHTML=temp
  })
  
}