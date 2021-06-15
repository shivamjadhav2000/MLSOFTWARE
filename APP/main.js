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
  let toggleImg=document.getElementById("toggleImg").src.split("/")
  toggleImg=toggleImg[toggleImg.length-1]
  document.getElementById("toggleImg").src=toggleImg==="half-moon.png"?"assests/sunny.png":"assests/half-moon.png"
  var anchorTemp = document.getElementsByTagName("a")
  var navbarHover =document.getElementsByTagName("span")
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

//File reupload Cleaning
function handleFileUploadCleaning(){
  document.querySelector("#myChart3").innerHTML=""
  document.getElementById("THEAD").innerHTML=""
  document.getElementById("TBODY").innerHTML=""
  document.querySelector("#myChart1").innerHTML=""
  document.querySelector("#myChart2").innerHTML=""
  document.querySelector("#targetDropdown").innerHTML=""
}
//control display of dynamic columns rendering get data from python as all columns 
function handleFileUpload(){
  handleFileUploadCleaning()
    document.getElementById("data-visualization-section-Cont").className=""

    let inputf=document.getElementById("inputFile").value
    let THEAD=document.getElementById("THEAD")
    let TBODY=document.getElementById("TBODY")
    // let ctx4 = document.getElementById('myChart3').getContext('2d');
    let targetDropdown=document.querySelector("#targetDropdown")

    fpath=inputf
    eel.main(inputf)((r)=>{
        if(r){
            let rows=r[0]
            let cols=r[1]
            let NumericalValues = r[2]
            let CategoricalValues = r[3]
            let CCC=["Gender","Purchased","Age","EstimatedSalary"]
            let totalValues=r[2].length+r[3].length
            eel.get_user_choices(CCC)(r=>{console.log("r from main in main.js",r)})
            let formattedCorrelationMatrix=r[4]
            var options = {
              series: [(NumericalValues.length/totalValues)*100,(CategoricalValues.length/totalValues)*100],
              chart: {
              height: 350,
              type: 'radialBar',
            },
            plotOptions: {
              radialBar: {
                dataLabels: {
                  name: {
                    fontSize: '22px',
                  },
                  value: {
                    fontSize: '16px',
                  },
                  total: {
                    show: true,
                    label: 'Total',
                    formatter: function () {
                      return totalValues
                    },

                    
                  }
                }
              }
            },
            labels:['NumericalValues','CategoricalValues'] 
            };
            var chart = new ApexCharts(document.querySelector("#myChart3"), options);
            chart.render();
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
            document.getElementById("dropdownContainer").className=""
        }
    
    })
    

}
function handleBoxPlot(featureName){
    eel.GetFeatureValues(featureName)((res)=>{
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