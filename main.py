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
import tqdm
import time

eel.init("APP")
@eel.expose
def trymedaddy():
    print("im inside you honey!!")
    for i in tqdm.tqdm(range(10)):
	        time.sleep(0.5)
    return "im comming daddy!!!"
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
        print("before sc",X[0:10,:])
        sc = StandardScaler()
        X = sc.fit_transform(X)
        print("After sc",X[0:10,:])
        if Algorithm=="LogisticRegression":
            ob=LogisticRegression(learning_rate=0.05,epochs=1000)
            ob.fit(X,Y) 
            path = "./APP"
            c, a = ob.get_cst_acc()
            plot_cost_acc(c, a,False, path)
        elif Algorithm=="KNN":
            ob=KNN(neighbours=2, p=2)
            ob.fit(X,Y) 
            YPred=np.array(ob.predict(X))
            YPred=np.reshape(YPred,(YPred.shape[0],1))
            
            print(YPred[0:10,:],Y[0:10,:])
            # print("shape of Ypred",YPred,"shape of Y",Y)
            path = "./APP"
            plot_cost_acc(Y,YPred,False,path)
            # c, a = ob.get_cst_acc()
            # plot_cost_acc(c, a, True, path)
        return 1
    else:
        return 0 
    
    
    
    
eel.start('index.html',size=(1000,700))