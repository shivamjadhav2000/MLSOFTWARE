import brain
from brain.classification import LogisticRegression
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
def display(fpath,x,y):
    dataset=pd.read_csv(fpath)
    X=dataset[x].values
    Y=dataset[y].values
    sc = StandardScaler()
    X = sc.fit_transform(X)
    lg=LogisticRegression(learning_rate=0.05,epochs=1000)
    lg.fit(X,Y)
    path = "./APP"
    c, a = lg.get_cst_acc()
    plot_cost_acc(c, a, True, path)

    return 1
    
eel.start('index.html',size=(1000,700))