let ComparedResults=null
let trainResults=null
let targetDisplay=document.getElementById('targetDisplay')
let kmeansTargetDisplay=document.getElementById('kmeansTargetDisplay')
let trainCont1=document.getElementById('trainCont1')
let testCont1=document.getElementById('testCont1')
targetDisplay.className="hide"
kmeansTargetDisplay.className="hide"
trainCont1.className="hide"
testCont1.className="hide"
let myAlgorithm=null
targetStat=document.getElementById('targetStat')
let trainingParameters=['num_samples','num_features','num_classes','score','loss','batch_size','biases','epochs','weights','lamda','learning_rate']
let featureList=[`loss`,`num_classes`,`score`,`num_features`,`num_samples`]
let kmeansCommonParms=['loss_per_trial']
let kmeansiterableParams=['min_loss','best_centroid','best_trial','K','max_iters','centroids','loss_per_trial','trials']
let numClasses=null
eel.getResults()(r=>{
    ComparedResults=r.ComparedResults
    trainResults=r.TrainResults
    myAlgorithm=r.myAlgorithm
    if(myAlgorithm!='K'){
        targetDisplay.className=''
    //f1-score and precision table head update train and test results
    featureList.forEach((i,idx)=>{
        let temp=``
        if(ComparedResults[i]!==undefined){
            temp+=`<td>${i}</td><td>${ComparedResults[i][0]}</td><td>${ComparedResults[i][1]}</td>`
        }
        document.getElementById(`target_${i}`).innerHTML=temp
    })
        if(ComparedResults['f1_score']!==undefined){
        trainCont1.className=""
        testCont1.className=""
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
        if(trainResults[i]!==undefined){
            if(Number(trainResults[i]) === trainResults[i] && trainResults[i] % 1 !== 0){
                   document.getElementById(i).innerHTML=`${i}: ${trainResults[i].toString().slice(0,9)}`
            }
            else{
                document.getElementById(i).innerHTML=`${i}: ${trainResults[i]}`
            }
        }
    })

    }
    else{
        kmeansTargetDisplay.className=''
        let trainTrailLoss=ComparedResults[loss_per_trial][0]
        let testTrailLoss=ComparedResults[loss_per_trial][1]
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
            // title: {
            //   text: '$ (thousands)'
            // }
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