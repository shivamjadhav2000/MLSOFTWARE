let ComparedResults=null
let trainResults=null
let targetDisplay=document.getElementById('targetDisplay')
let kmeansTargetDisplay=document.getElementById('kmeansTargetDisplay')
let trainCont1=document.getElementById('trainCont1')
let testCont1=document.getElementById('testCont1')
targetDisplay.style.display="none"
kmeansTargetDisplay.style.display="none"
trainCont1.style.display="none"
testCont1.style.display="none"
let myAlgorithm=null
targetStat=document.getElementById('targetStat')
let trainingParameters=['num_samples','num_features','num_classes','score','loss','batch_size','biases','epochs','weights','lamda','learning_rate']
let featureList=[`loss`,`num_classes`,`score`,`num_features`,`num_samples`]
let kmeansCommonParms=['loss_per_trial']
let kmeansiterableParams=['min_loss','best_centroid','best_trial','K','max_iters','centroids','trials']
let numClasses=null

function handle_write_parameters(param){
    alert("yess its working params=",param)
    if(trainResults!==null){
    eel.write_parameters(trainResults[param])(r=>{
        console.log(r)
    })}
}
eel.getResults()(r=>{
    ComparedResults=r.ComparedResults
    trainResults=r.TrainResults
    myAlgorithm=r.myAlgorithm
    if(myAlgorithm!='K'){

        targetDisplay.style.display='block'
    //f1-score and precision table head update train and test results
    featureList.forEach((i,idx)=>{
        let temp=``
        if(ComparedResults[i]!==undefined){
            temp+=`<td>${i}</td><td>${ComparedResults[i][0]}</td><td>${ComparedResults[i][1]}</td>`
        }
        document.getElementById(`target_${i}`).innerHTML=temp
    })
        if(ComparedResults['f1_score']!==undefined){
        trainCont1.style.display='block'
        testCont1.style.display='block'
        let train=`<th scope="col">Features</th>`
        let test=`<th scope="col">Features</th>`
        let temp=``
        numClasses=Number(ComparedResults['num_classes'][0])
        for(let i=0;i<numClasses;i++){

            temp+=`<th scope="col">${i+1}</th>`
        }
        train+=temp
        test+=temp
        document.getElementById("trainSetIterableHead").innerHTML=train
        document.getElementById("testSetIterableHead").innerHTML=test
        temp=``
        train=``
        test=``
        let iterableFeature=['f1_score','precision']
        //f1_score and precision values update in the respective tables of train and test
        iterableFeature.forEach((i,idx)=>{
            train+=`<tr><th scope="row">${i}</th>`
            test+=`<tr><th scope="row">${i}</th>`
            for(let j=0;j<numClasses;j++){
                train+=`<td>${ComparedResults[i][0][j].toString().slice(0,6)}</td>`
                test+=`<td>${ComparedResults[i][1][j].toString().slice(0,6)}</td>`
            }
            train+=`</tr>`
            test+=`</tr>`
        })
        document.getElementById("trainSetIterableBody").innerHTML=train
        document.getElementById("testSetIterableBody").innerHTML=test
        
        
    }
    //confusion matrix table head and body update of  train and test results
    if(ComparedResults['confusion_matrix']!==undefined){
        let confusion_matrix=ComparedResults['confusion_matrix']
        let confusion_matrix_train=confusion_matrix[0]
        let confusion_matrix_test=confusion_matrix[1]
        //head update

        let tempHead=`<tr><th scope="col"></th>`
        for(let i=0;i<numClasses;i++){
            tempHead+=`<th scope="col">${i}</th>`
        }
        tempHead+='</tr>'
        document.getElementById("trainConfusionMatrixHead").innerHTML=tempHead
        document.getElementById("testConfusionMatrixHead").innerHTML=tempHead
        train=``
        test=``
        //body update
        for(let i=0;i<numClasses;i++){
            train+=`<tr><th scope="row">${i}</th>`
            test+=`<tr><th scope="row">${i}</th>`
            for(let j=0;j<numClasses;j++){
               train+=`<td>${confusion_matrix_train[i][j]}</td>`
               test+=`<td>${confusion_matrix_test[i][j]}</td>`
            }
            train+=`</tr>`
            test+=`</tr>`
        }
        document.getElementById('trainConfusionMatrixBody').innerHTML=train
        document.getElementById('testConfusionMatrixBody').innerHTML=test
    }
    //training parameters results update
    trainingParameters.forEach((i,idx)=>{
        console.log(typeof(trainResults[i]))
        if(trainResults[i]!==undefined){
            if(typeof(trainResults[i])==='object'){
                document.getElementById(i).innerHTML=`<div>${i}</div><div>:</div><div><button onclick="handle_write_parameters(${i})" type="button" class="btn btn-dark">Download</button></div>`


            }
            else if(Number(trainResults[i]) === trainResults[i] && trainResults[i] % 1 !== 0){
                   document.getElementById(i).innerHTML=`<div>${i}</div><div>:</div> <div>${trainResults[i].toString().slice(0,9)}</div>`
            }
            else{
                document.getElementById(i).innerHTML=`<div>${i}</div><div>:</div><div> ${trainResults[i]}</div>`
            }
        }
        else{
        document.getElementById(i).innerHTML=`<div>${i}</div><div>:</div><div>--</div>`
        }
    })

    }
    else{
        kmeansTargetDisplay.style.display='block'
        let trails=[]
        let trainTrailLoss=ComparedResults['loss_per_trial'][0].map((i,idx)=>{
            return i.toFixed(4)
        })
        let testTrailLoss=ComparedResults['loss_per_trial'][1].map((i,idx)=>{
            return i.toFixed(4)
        })
        trainTrailLoss.forEach((i,idx)=>{trails.push(`trail ${idx+1}`)})
        kmeansCommonParms
        var options = {
            series: [{
            name: 'Train',
            data: trainTrailLoss
          }, {
            name: 'Test',
            data: testTrailLoss
          }],
            chart: {
            type: 'bar',
            height: 350
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
              endingShape: 'rounded'
            },
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          xaxis: {
            categories: trails,
          },
          yaxis: {
            title: {
              text: 'Loss'
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return   val + " loss"
              }
            }
          }
          };
  
          var chart = new ApexCharts(document.querySelector("#targetBarplot"), options);
          chart.render();
    }


})