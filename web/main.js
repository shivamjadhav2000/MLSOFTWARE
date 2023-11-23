let X=[]
let Y=[]
let cols
let fpath=''
eel.main_init()(r=>{
  console.log(r)
  if(r){
    handleFileUpload()

  }
})
 //general helperfunction
 function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
function handleFeatureSelection(event){
  event.preventDefault()
  let checkboxList=[]
document.querySelectorAll('input[type="checkbox"]:checked').forEach((i,idx)=>{
  checkboxList.push(i.value)
})
eel.get_user_choices(checkboxList)(r=>{let PPP=r})
}
 function handleToggle(){
  var element = document.body;
  document.getElementsByTagName("thead")[0].classList.toggle("theadDarkMode")
  document.getElementById("navCont").classList.toggle("navLightMode")
  document.getElementById("subNavCont").classList.toggle("subNavDarkMode")
  document.getElementById("dataBody").classList.toggle("data-visualization-section-darkMode")
  let toggleImg=document.getElementById("toggleImg").src.split("/")
  toggleImg=toggleImg[toggleImg.length-1]
  document.getElementById("toggleImg").src=toggleImg==="half-moon.png"?"assests/sunny.png":"assests/half-moon.png"
  var anchorTemp = document.getElementsByTagName("a")
  document.getElementById("FileUploadModal&&").classList.toggle("bg-dark")
  document.getElementById("featureSelectionModal&&").classList.toggle("bg-dark")
  var targetTable=document.getElementById("targetTable")
  document.getElementById("dropdownButton").classList.toggle("btn-dark")
  document.getElementById("featureSelectionbtn").classList.toggle("btn-dark")
  targetTable.classList.toggle("table-dark")
   element.classList.toggle("dark-mode");
   for(let i=0;i<anchorTemp.length;i++){
     anchorTemp[i].classList.toggle("myanchorToggle")
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
  document.querySelector('.FileUploadCont').style.display="flex"
}
//control display of dynamic columns rendering get data from python as all columns
 function handleFileUpload(){
  handleFileUploadCleaning()

    let FileUploadErrorTarget=document.getElementById("FileUploadErrorTarget")
    // display: flex;justify-content: center;align-items: center;  
    let featureSelectionCont=document.getElementById("featureSelectionCont")
    featureSelectionCont.className='hidden'
    featureSelectionCont.className="hidden"
    let inputf=document.getElementById("inputFile").value
    let THEAD=document.getElementById("THEAD")
    let TBODY=document.getElementById("TBODY")
    // let ctx4 = document.getElementById('myChart3').getContext('2d');
    let targetDropdown=document.querySelector("#targetDropdown")
    let targetCheckBox=document.querySelector("#targetCheckBox")
    // <div class="custom-control custom-checkbox">
    //       <input type="checkbox" class="custom-control-input" id="customCheck1">
    //       <label class="custom-control-label" for="customCheck1">Check this custom checkbox</label>
    //     </div>

    fpath=inputf
    eel.main(inputf)(async (r)=>{
      if(typeof(r)=='string'){
        FileUploadErrorTarget.className=''
        FileUploadErrorTarget.className="alert alert-danger"
        FileUploadErrorTarget.innerHTML=r
        await sleep(3000)
        FileUploadErrorTarget.className='hidden'
      }
        else{
          document.querySelector('.FileUploadCont').style.display="none"

          document.getElementById("data-visualization-section-Cont").className=""

            let rows=r[0]
            let cols=r[1]
            let NumericalValues = r[2]
            let CategoricalValues = r[3]
            let totalValues=r[2].length+r[3].length
            let formattedCorrelationMatrix=r[4]
            featureSelectionCont.className=""
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
            //targetCheckBox pushing feature names
            let targetCheckBoxdata=``
            cols.forEach((i,idx)=>{
              targetCheckBoxdata+=`<div class="form-check ">
              <input class="form-check-input " style="width:20px;height:20px" type="checkbox" value="${i}" id="defaultCheck${idx+1}">
              <label class="form-check-label" for="defaultCheck${idx+1}" style="font-size: larger;padding-left:8px">
                ${i}
              </label>
            </div>`
            })
            targetCheckBox.innerHTML=targetCheckBoxdata
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
                  plotOptions: {
                    heatmap: {
                      colorScale: {
                        ranges: [
                          {
                            from: -1,
                            to: 0.5,
                            color: '#008FFB',
                            name: 'low',
                          },
                          {
                            from: 0.6,
                            to: 1,
                            color: '#34d195',
                            name: 'high',
                          }
                        ]
                      }
                    }
                  },
                  series: formattedCorrelationMatrix,
                  chart: {
                  height: 360,
                  type: 'heatmap',
                },
                dataLabels: {
                  enabled: false
                },
                colors: ['#008FFB', '#FEB019'],
                title: {
                  text: 'HeatMap Chart features Correlation'
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
