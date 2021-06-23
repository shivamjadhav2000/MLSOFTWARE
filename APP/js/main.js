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
// function dummyTesting1(){
//   eel.dummyTesting()(r=>{
//     console.log(r)
//   })
// }
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
async function handleBuildSpinR(Algo){
  AlgorithmParamsData={}
 let BuildImg= document.getElementById(`BuildImg${Algo}`)
 let targetForm=document.forms[`modelBase${Algo}`]
 let lr=targetForm.elements['lr'].value
 let lambd=targetForm.elements['lambd'].value
 let epochs=targetForm.elements['epochs'].value
 let batch_size=targetForm.elements[`batch_size${Algo}`].value
 let trainingStatusTarget=document.getElementById(`trainingStatusTarget${Algo}`)
 trainingStatusTarget.className="alert alert-danger"
 trainingStatusTarget.innerHTML="Traing is started"
 if(Algo!='RL'){
   let degree=targetForm.elements['degree'].value
  AlgorithmParamsData["degree"]=degree.length?parseInt(degree):3
}
 AlgorithmParamsData['degree']=3
 AlgorithmParamsData["lr"]=lr.length?parseFloat(lr):parseFloat('0.001');
 AlgorithmParamsData["lambd"]=lambd.length?parseFloat(lambd):parseFloat('0.2');
 AlgorithmParamsData["epochs"]=epochs.length?parseInt(epochs):parseInt('100');
 AlgorithmParamsData["batch_size"]=batch_size.length?parseInt(batch_size):parseInt('24');

 TargetVariable=document.forms[`modelBase${Algo}`].elements['Y'].value;
 BuildImg.className="spinner"
 eel.build(ChosenAlgorithm,AlgorithmParamsData,TargetVariable)((r)=>{
   BuildImg.className=""
   trainingStatusTarget.className="alert alert-success"
   trainingStatusTarget.innerHTML="Traing is successfull"
   console.log("build responsce for Algorithm =",Algo,"res=",r)
 })
}
async function handleBuildSpinK(Algo){
  AlgorithmParamsData={}
  let BuildImg= document.getElementById(`BuildImg${Algo}`)
  let targetForm=document.forms[`modelBase${Algo}`]
  let degree=targetForm.elements['degree'].value
  let K=targetForm.elements['K'].value
  let trials =targetForm.elements['trials'].value
  let max_iters=targetForm.elements['max_iters'].value
  let trainingStatusTarget=document.getElementById(`trainingStatusTarget${Algo}`)
  trainingStatusTarget.className="alert alert-danger"
  trainingStatusTarget.innerHTML="Traing is started"
  AlgorithmParamsData["K"]=K.length?parseInt(K):3
  AlgorithmParamsData["trials"]=trials.length?parseInt(trials):3
  AlgorithmParamsData["max_iters"]=max_iters.length?parseInt(max_iters):1
  AlgorithmParamsData["degree"]=degree.length?parseInt(degree):3
  BuildImg.className="spinner"
  eel.build(ChosenAlgorithm,AlgorithmParamsData,TargetVariable=0)((r)=>{
    console.log("build responsce for algorithm =",Algo,"res=",r)
    BuildImg.className=""
    trainingStatusTarget.className="alert alert-success"
    trainingStatusTarget.innerHTML="Traing is successfull"
  })


}
async function handleBuildSpinC(Algo){
  AlgorithmParamsData={}
  let BuildImg= document.getElementById(`BuildImg${Algo}`)
  let targetForm=document.forms[`modelBase${Algo}`]
  let degree=targetForm.elements['degree'].value
  BuildImg.className="spinner"
  let trainingStatusTarget=document.getElementById(`trainingStatusTarget${Algo}`)
  trainingStatusTarget.className="alert alert-danger"
  trainingStatusTarget.innerHTML="Traing is started"
  if(Algo==='CK'){
  let K=targetForm.elements['K'].value
  let P=targetForm.elements['P'].value
  AlgorithmParamsData["neighbours"]=K.length?parseInt(K):9;
  AlgorithmParamsData["p"]=P.length?parseInt(P):2;
  TargetVariable=document.forms[`modelBase${Algo}`].elements['Y'].value;
  AlgorithmParamsData["degree"]= degree.length?parseInt(degree):3
}
  else if(Algo==='CS'){
    AlgorithmParamsData={}
    TargetVariable=document.forms[`modelBase${Algo}`].elements['Y'].value;
    let C=targetForm.elements['C'].value
    let kernel =targetForm.elements['kernel'].value
    let gamma =targetForm.elements['gamma'].value
    let class_weight =targetForm.elements['class_weight'].value
    let max_iters =targetForm.elements['max_iters'].value
    AlgorithmParamsData["C"]=C.length?parseInt(C):1
    AlgorithmParamsData["kernel"]=kernel.length?kernel:'rbf'
    AlgorithmParamsData["gamma"]=gamma.length?gamma:'scale'
    AlgorithmParamsData["class_weight"]=class_weight.length?class_weight:'None'
    AlgorithmParamsData["degree"]= degree.length?parseInt(degree):3
    AlgorithmParamsData["max_iter"]=max_iters.length?parseInt(max_iters):-1

  }
  eel.build(ChosenAlgorithm,AlgorithmParamsData,TargetVariable)((r)=>{
    console.log("build responsce for algorithm =",Algo,"res=",r)
    BuildImg.className=""
    trainingStatusTarget.className="alert alert-success"
    trainingStatusTarget.innerHTML="Traing is successfull"
  })

 }


function handleAlgorithmFormDisplay(event){
  event.preventDefault()
  let l=['RL','RR','RP','CL','CS','CK','K']
  ChosenAlgorithm=event.target.Algorithm.value
   for(let i=0;i<l.length;i++){
     document.getElementById(l[i]).className='hide'
   }
   document.getElementById(ChosenAlgorithm).className='show'
  if (ChosenAlgorithm==='RL' || ChosenAlgorithm==='RR' || ChosenAlgorithm==='RP' || ChosenAlgorithm==='CL' ){
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

  else if(ChosenAlgorithm === 'CS' || ChosenAlgorithm === 'CK')
  {
    eel.getMetaData(ChosenAlgorithm)(r=>{
      data=r
      // document.getElementsByName(`batch_size${ChosenAlgorithm}`)[0].placeholder=`enter Batch size range between 1-${data.datasetSize}`
      targetSelect=document.getElementById(`Select${ChosenAlgorithm}`)
      let temp=`<option value="">Select Dependent Variable</option>`
      for(let i=0;i<data.totalSelectedFeatures.length;i++){
        temp+=`<option value=${data.totalSelectedFeatures[i]}>${data.totalSelectedFeatures[i]}</option>`
      }
      targetSelect.innerHTML=temp
  })
}


}
