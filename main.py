import brain
from brain.classification import LogisticRegression
from brain.classification import KNN
from brain.utils import plot_cost_acc
import sklearn
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import numpy as np
import eel
import matplotlib.pyplot as plt
import pandas as pd

eel.init("APP")
@eel.expose


def run(filepath):
     #Importing dataset to build model 
    dataset=pd.read_csv(filepath)
    #Taking Dependent and Independent variables
    temp=list(dataset.columns)
    return temp
@eel.expose
def display(fpath,x,y,Algorithm):
    if len(x)>0 and len(y)>0:
        dataset=pd.read_csv(fpath)
        X=dataset[x].values
        Y=dataset[y].values
        sc = StandardScaler()
        X = sc.fit_transform(X)
        if Algorithm=="LogisticRegression":
            ob=LogisticRegression(learning_rate=0.05,epochs=1000)
            ob.fit(X,Y) 
            path = "./APP"
            c, a = ob.get_cst_acc()
            plot_cost_acc(c, a, False, path)

        return 1
    else:
        return 0 
    
    
    
    
eel.start("main.html",size=(1000,700))