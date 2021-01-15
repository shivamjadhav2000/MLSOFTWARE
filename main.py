import eel
import matplotlib.pyplot as plt
import pandas as pd
import brain
from brain.classification import LogisticRegression
eel.init("APP")
@eel.expose


def run(filepath):
     #Importing dataset to build model 
    dataset=pd.read_csv(filepath)
    #Taking Dependent and Independent variables
    temp=list(dataset.columns)
    return temp
@eel.expose
def display(fpath,x,y):
    dataset=pd.read_csv(fpath)
    X=dataset[x].values
    Y=dataset[y].values
    lg=LogisticRegression()
    lg.fit(X,Y)
    x,y=lg.Vizualize()

    # Visualising data

    plt.plot(x,y,color="purple")
    plt.scatter(x,y,color="red")
    plt.title("{Linear Regression}")
    plt.xlabel('cost')
    plt.ylabel('Accuracy')
    plt.savefig("APP/output.png")
    return "/output.png"
    
    
    


eel.start('index.html',size=(1000,700))