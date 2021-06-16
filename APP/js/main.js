let data=null
let ChosenAlgorithm=''
let AlgorithmParamsData={}
let TargetVariable=''

function handleToggle(){
  var element = document.body;
  document.getElementById("navCont").classList.toggle("navLightMode")
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
async function handleBuildSpinR(Algo){
  if(Algo!='RL'){
    AlgorithmParamsData["degree"]=3
  }
 let BuildImg= document.getElementById(`BuildImg${Algo}`)
 let targetForm=document.forms[`modelBase${Algo}`]
 let lr=targetForm.elements['lr'].value
 let lambd=targetForm.elements['lambd'].value
 let epochs=targetForm.elements['epochs'].value
 let batch_size=targetForm.elements[`batch_size${Algo}`].value
 AlgorithmParamsData["lr"]=lr.length?parseFloat(lr):parseFloat('0.001');
 AlgorithmParamsData["lambd"]=lambd.length?parseFloat(lambd):parseFloat('0.2');
 AlgorithmParamsData["epochs"]=epochs.length?parseInt(epochs):parseInt('100');
 AlgorithmParamsData["batch_size"]=batch_size.length?parseInt(batch_size):parseInt('24');
 console.log(AlgorithmParamsData)
//  AlgorithmParamsData["degree"]=3
 TargetVariable=document.forms[`modelBase${Algo}`].elements['Y'].value;
 BuildImg.className="spinner"
 eel.build(ChosenAlgorithm,AlgorithmParamsData,TargetVariable)((r)=>{
   BuildImg.className=""
   console.log("hiiii")
    console.log(r)
 })
}
async function handleBuildSpinCL(){

  let BuildImg= document.getElementById("BuildImg2")
  let lr=document.forms['modelBaseCL'].elements['lr'].value
  let lambd=document.forms['modelBaseCL'].elements['lambd'].value
  let epochs=document.forms['modelBaseCL'].elements['epochs'].value
  let batch_size=document.forms['modelBaseCL'].elements['batch_sizeCL'].value
  AlgorithmParamsData["lr"]=lr.length?parseFloat(lr):parseFloat('0.001');
  AlgorithmParamsData["lambd"]=lambd.length?parseFloat(lambd):parseFloat('0.2');
  AlgorithmParamsData["epochs"]=epochs.length?parseInt(epochs):parseInt('100');
  AlgorithmParamsData["batch_size"]=batch_size.length?parseInt(batch_size):parseInt('24');
  AlgorithmParamsData["degree"]=3
 //  AlgorithmParamsData["degree"]=3
  TargetVariable=document.forms['modelBaseCL'].elements['Y'].value;
  BuildImg.className="spinner"
  eel.build(ChosenAlgorithm,AlgorithmParamsData,TargetVariable)((r)=>{
    console.log("hiiii")
    console.log(r)
    BuildImg.className=""
  })
 }
//  function handleAlgorithmFormDisplay(Algo){
//    let l=['RL','RR','RP','CL','CS','CK','K']
//    for(let i=0;i<l.length;i++){
//      document.getElementById(l[i]).className='hide'
//    }
//    document.getElementById(Algo).className='show'


//  }

function handleAlgorithmFormDisplay(event){
  event.preventDefault()
  let l=['RL','RR','RP','CL','CS','CK','K']
  ChosenAlgorithm=event.target.Algorithm.value
   for(let i=0;i<l.length;i++){
     document.getElementById(l[i]).className='hide'
   }
   document.getElementById(ChosenAlgorithm).className='show'
  

  eel.getMetaData(ChosenAlgorithm)(r=>{
    data=r
    document.getElementsByName(`batch_size${ChosenAlgorithm}`)[0].placeholder=`enter Batch size range between 1-${data.datasetSize}`
    targetSelect=document.getElementById(`Select${ChosenAlgorithm}`)
    let temp=`<option selected>Select Dependent Variable</option>`
    for(let i=0;i<data.totalSelectedFeatures.length;i++){
      temp+=`<option>${data.totalSelectedFeatures[i]}</option>`
    }
    targetSelect.innerHTML=temp
  })

}
