let X=[]
let Y=[]
let cols
let fpath=''
 //general helperfunction 
function handleToggle(){
  var element = document.body;
  document.getElementById("navCont").classList.toggle("navLightMode")
  document.getElementById("subNavCont").classList.toggle("subNavDarkMode")
  document.getElementById("dataBody").classList.toggle("data-visualization-section-darkMode")
  var anchorTemp = document.getElementsByTagName("a")
  var navbarHover =document.getElementsByTagName("p")
  var FileUploadModal=document.getElementById("FileUploadModal")
  FileUploadModal.classList.toggle("bg-dark")
  var targetTable=document.getElementById("targetTable")
  document.getElementById("dropdownButton").classList.toggle("btn-dark")
  targetTable.classList.toggle("table-dark")
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





//about chart.js






//control display of dynamic columns rendering get data from python as all columns 
function handlecolums(){
    let inputf=document.getElementById("inputFile").value
    let THEAD=document.getElementById("THEAD")
    let TBODY=document.getElementById("TBODY")
    let ctx4 = document.getElementById('myChart3').getContext('2d');
    let targetDropdown=document.querySelector("#targetDropdown")

    fpath=inputf
    eel.main(inputf)((r)=>{
        if(r){
            let rows=r[0]
            let cols=r[1]
            let NumericalValues = r[2]
            let CategoricalValues = r[3]
            let formattedCorrelationMatrix=r[4]
            //filling radial graph
            const data = {
                labels: [
                  'NumericalValues',
                  'CategoricalValues'
                  ],
                datasets: [{
                  label: 'features',
                  data: [NumericalValues.length,CategoricalValues.length],
                  backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                  ],
                  hoverOffset: 4
                }]
              };
            const myChart4 =new Chart(ctx4,{
            type: 'doughnut',
            data: data
            }
            )
            let theadcontent=`<tr><th scope="col">SNO</th>`
            let tbodycontent=``
            cols.forEach((i,idx)=>{
            theadcontent=theadcontent+`<th scope="col">${i}</th>`
            })
            rows.forEach((i,idx)=>{
            tbodycontent=tbodycontent+`<tr><th scope="row">${idx+1}</th>`
            i.forEach((j)=>{
                tbodycontent=tbodycontent+`<td>${j}</td>`
            })
            tbodycontent=tbodycontent+`</tr>`
            })
            theadcontent=theadcontent+`</tr>`
            THEAD.innerHTML=theadcontent
            TBODY.innerHTML=tbodycontent
            
            eel.GetFeatureValues(NumericalValues[0])((res)=>{
                featureName=NumericalValues[0]
                var BoxPlotoptions = {
                    series: [
                    {
                      // name: 'box',
                      type: 'boxPlot',
                      data: [
                        {
                          x: featureName,
                          y: res
                        }
                      ]
                    },
                    
                  ],
                    chart: {
                    type: 'boxPlot',
                    height: 350
                  },
                  colors: ['#008FFB', '#FEB019'],
                  title: {
                    text: `BoxPlot -${featureName}`,
                    align: 'left'
                  }
                 
                  };
                 var HeatMapOptions = {
                  series: formattedCorrelationMatrix,
                  chart: {
                  height: 350,
                  type: 'heatmap',
                },
                dataLabels: {
                  enabled: false
                },
                colors: ["#008FFB"],
                title: {
                  text: 'HeatMap Chart (Single color)'
                },
                };
                var chart1 = new ApexCharts(document.querySelector("#myChart1"), BoxPlotoptions);
                chart1.render();
                var chart2 = new ApexCharts(document.querySelector("#myChart2"), HeatMapOptions);
                console.log(document.querySelector("#myChart2"),"chart2=",chart2)
                chart2.render();

                let temp =``
                NumericalValues.forEach((i,idx)=>{
                    if(idx==0){
                      temp=temp+`<button class="dropdown-item active" onclick="handleBoxPlot('${i}')" >${i}</button>`
                    }
                    else{
                      temp=temp+`<button class="dropdown-item " onclick="handleBoxPlot('${i}')" >${i}</button>`

                    }
                })
                targetDropdown.innerHTML=temp

            })
        }
    
    })
    

}
function handleBoxPlot(featureName){
    eel.GetFeatureValues(featureName)((res)=>{
        console.log(res)
        var options = {
            series: [
            {
              name: 'box',
              type: 'boxPlot',
              data: [
                {
                  x: featureName,
                  y: res
                }
              ]
            },
            
          ],
            chart: {
            type: 'boxPlot',
            height: 350
          },
          colors: ['#008FFB', '#FEB019'],
          title: {
            text: `BoxPlot -${featureName}`,
            align: 'left'
          }
         
          };
          document.querySelector("#myChart1").innerHTML=""  
        var chart = new ApexCharts(document.querySelector("#myChart1"), options);
        chart.render();
        
    })
}
//handle logic for selecting X or dependent variable columns 
function handleColX(event){
    let tempX=event.target.innerHTML
    if(!X.includes(tempX)){
       X.push(tempX)
       event.target.style.backgroundImage='linear-gradient(45deg,#ee0979  ,#ff6a00 )' 
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
       event.target.style.backgroundImage="linear-gradient(45deg,#ee0979  ,#ff6a00 )" 
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
    let Build=document
    inputPathCont.style.display='none'
    Xcolumns.style.display='none'
    Ycolumns.style.display='none'

    
    
}
//Run model
function build(){
    let AlgorithmArray=document.getElementsByName("Algorithm")
    let Algorithm=""
    for(i = 0; i < AlgorithmArray.length; i++){
        if(AlgorithmArray[i].checked){
            Algorithm=AlgorithmArray[i].value
        }
    }
    
    if(X.length && Y.length && Algorithm.length){
        let element=document.getElementById("buildImg")
        element.style="-webkit-animation:spin 6s linear infinite;-moz-animation:spin 6s linear infinite;animation:spin 6s linear infinite;"
        eel.display(fpath,X,Y,Algorithm)((r)=>{
            let fig1=r[0]
            let fig2=r[1]
             temp.innerHTML=`
             <div style="
             display: flex;
             align-items: center;
             flex-direction:row;
             ">
               <img src='accuracy.png' width="600" />
               <br> <img src='cost.png' width="600"/>
               <br>
               <button onclick="handleVizOff()">Back</button>
             </div>`
             X=[]
             Y=[]
             element.style=""
        })
    }
    
        
    
    
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
