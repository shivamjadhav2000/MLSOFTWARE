let X=[]
let Y=[]
let cols
let fpath=''
//control handleUploadFile
function handleUploadFile(){
    document.getElementById("inputPathCont").style.display='block'
    let main1=document.getElementById("main1")
    main1.style.display='block'
} 

//control display of dynamic columns rendering get data from python as all columns 
function handlecolums(){
    
    let inputf=document.getElementById("inputFile").value
    fpath=inputf
    eel.run(inputf)((r)=>{
        if(r){
            cols=r
            let targetX=document.getElementById("Xcolumns")
    let targetY=document.getElementById("Ycolumns")
    
    targetY.style.display="none"

    
    let t='<p>select Independent variables</p>'
    cols.forEach((i)=>{
        t=t+'<button onclick="handleColX(event)" name="btn">'+i+'</button>'
    })
    t=t+'<br><button id="nextbtn" onclick="handletransitonXtoY()">Next</button>'
    targetX.innerHTML=t
    targetX.style.display="block"
        }
    
    })
    

}
//handle logic for selecting X or dependent variable columns 
function handleColX(event){
    let tempX=event.target.innerHTML
    if(!X.includes(tempX)){
       X.push(tempX)
       event.target.style.backgroundImage='linear-gradient(45deg,rgba(9, 255, 0, 0.863),rgba(9, 238, 58, 0.822)) ' 
    }
    else{
        let index = X.indexOf(tempX);
        X.splice(index, 1);
       event.target.style.backgroundImage='linear-gradient(45deg,white,white)'
    }

}

//control display of dynamic columns rendering get data from python as remaining columns 

function handletransitonXtoY(){
    document.getElementById("Xcolumns").style.display='none'
    let t='<p>select dependent   variable</p>'
    let targetY=document.getElementById("Ycolumns")
    cols.forEach((i)=>{
          if(!X.includes(i)){
            t=t+'<button onclick="handleColY(event)" name="btn">'+i+'</button>'
          }
    })
    t=t+'<br><button id="nextbtn" onclick="handletransitonYtoD()">Next</button>'
    targetY.style.display='block'
    targetY.innerHTML=t
}
//handle logic for selecting Y or independent variable columns
function handleColY(event){
    let tempY=event.target.innerHTML
    if(!Y.includes(tempY)){
       Y.push(tempY)
       event.target.style.backgroundImage='linear-gradient(45deg,rgba(9, 255, 0, 0.863),rgba(9, 238, 58, 0.822)) ' 
    }
    else{
        let index = Y.indexOf(tempY);
        Y.splice(index, 1);
       event.target.style.backgroundImage='linear-gradient(45deg,white,white)'
    }

}
function handletransitonYtoD(){
    
    let main=document.getElementById("main")
    let temp=document.getElementById("temp")
    let inputPathCont=document.getElementById("inputPathCont")
    let Xcolumns=document.getElementById("Xcolumns")
    let Ycolumns=document.getElementById("Ycolumns")
    inputPathCont.style.display='none'
    Xcolumns.style.display='none'
    Ycolumns.style.display='none'
    eel.display(fpath,X,Y)((r)=>{
          temp.innerHTML=`<img src=${r}/>'<br><button onclick="handleVizOff()">Back</button>`
          X=[]
          Y=[]
    })
    
}
//handle vizualization
function vizualize(){
    let form=document.querySelector("form")
    let temp=document.getElementById("temp")
    form.style.display='none'
    temp.style.display="block"
    temp.style.padding="2%"
}
//handle vizualization off
function handleVizOff(){
    let form=document.querySelector("form")
    let temp=document.getElementById("temp")
    form.style.display='block'
    temp.style.display='none'

}
