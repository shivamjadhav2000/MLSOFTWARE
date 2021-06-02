import numpy as np
class Svm:
    """
       parameters:
       
       lr  : learning rate 0<=l<=1
       
       alfa: Lagrangian multiplier,denoted by α is a vector of the weights of
             all the training points as support vectors.
    """
    def __init__(self,lr=0.01,alfa=0.01,n_iters=1000):
        self.lr=lr
        self.alfa=alfa
        self.n_iters=n_iters
        self.w=None
        self.c=None
    def fit(self,X,y):
        labels=np.unique(y)
        yhat=np.where(y<=labels[0],-1,1)
        n_samples,n_features=X.shape
        self.w=np.zeros(n_features)
        self.c=0
        for i in range(self.n_iters):
            for ind,x_i in enumerate(X):
                condition=(yhat[ind]*(np.dot(x_i,self.w)-self.c)-1>=0)
                if condition:
                    self.w=self.w-self.lr*(2*self.alfa*self.w)
                else:
                    self.w=self.w-self.lr*(2*self.alfa*self.w-np.dot(x_i,yhat[ind]))
                    self.c=self.c-self.lr*yhat[ind]
        
    def predict(self,X):
        linearmod=np.dot(X,self.w)-self.c
        ypred=np.where(linearmod>=0,1,0)
        return ypred





