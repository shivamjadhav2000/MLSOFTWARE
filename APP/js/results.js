let ComparedResults=null
let trainResults=null
targetDisplay=document.getElementById('targetDisplay')

targetStat=document.getElementById('targetStat')
let featureList=['num_samples','num_features','num_classes','score','loss','batch_size','biases','epochs']
let trainingParameters=['loss','num_classes',]
let numClasses=null
eel.getResults()(r=>{
    ComparedResults=r.ComparedResults
    trainResults=r.trainResults
    featureList.forEach((i,idx)=>{
        let temp=``
        if(ComparedResults[i]!==undefined){
            temp+=`<td>${i}</td><td>${ComparedResults[i][0]}</td><td>${ComparedResults[i][1]}</td>`

        }
        document.getElementById(i).innerHTML=temp
    })
        if(ComparedResults['f1_score']!==undefined){
        let train=`<th scope="col">Features</th>`
        let test=`<th scope="col">Features</th>`
        let temp=``
        numClasses=Number(ComparedResults['num_classes'][0])
        for(let i=0;i<numClasses;i++){

            temp+=`<th scope="col">${i+1}</th>`
        }
        train+=temp
        test+=temp
        console.log(train,test)
        document.getElementById("trainSetIterableHead").innerHTML=train
        document.getElementById("testSetIterableHead").innerHTML=test
        temp=``
        train=``
        test=``
        let iterableFeature=['f1_score','precision']
        
        iterableFeature.forEach((i,idx)=>{
            train+=`<tr><th scope="row">${i}</th>`
            test+=`<tr><th scope="row">${i}</th>`
            for(let j=0;j<numClasses;j++){
                train+=`<td>${ComparedResults[i][0][j].toFixed(3)}</td>`
                test+=`<td>${ComparedResults[i][1][j].toFixed(3)}</td>`
            }
            train+=`</tr>`
            test+=`</tr>`
        })
        document.getElementById("trainSetIterableBody").innerHTML=train
        document.getElementById("testSetIterableBody").innerHTML=test
        
        
    }
    if(ComparedResults['confusion_matrix']!==undefined){
        let confusion_matrix=ComparedResults['confusion_matrix']
        let confusion_matrix_train=confusion_matrix[0]
        let confusion_matrix_test=confusion_matrix[1]
        console.log("confusion_matrix_train =",confusion_matrix_train,"confusion_matrix_test =",confusion_matrix_test)
        let tempHead=`<tr><th scope="col"></th>`
        for(let i=0;i<numClasses;i++){
            tempHead+=`<th scope="col">${i}</th>`
        }
        tempHead+='</tr>'
        document.getElementById("trainConfusionMatrixHead").innerHTML=tempHead
        document.getElementById("testConfusionMatrixHead").innerHTML=tempHead
        train=``
        test=``
        for(let i=0;i<numClasses;i++){
            train+=`<tr><th scope="row">${i}</th>`
            test+=`<tr><th scope="row">${i}</th>`
            for(let j=0;j<numClasses;j++){
                console.log("i=",i,"j=",j)
               train+=`<td>${confusion_matrix_train[i][j]}</td>`
               test+=`<td>${confusion_matrix_test[i][j]}</td>`
            }
            train+=`</tr>`
            test+=`</tr>`
        }
        document.getElementById('trainConfusionMatrixBody').innerHTML=train
        document.getElementById('testConfusionMatrixBody').innerHTML=test
    }

})