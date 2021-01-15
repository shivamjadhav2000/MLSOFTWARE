import numpy as np
from brain.activations import Sigmoid
from brain.losses import LOSS
from brain.utils.constants import LR, EPOCHS

class LogisticRegression:

    def __init__(self, learning_rate=LR, epochs=EPOCHS, lambd=0, cost='BinaryCrossEntropy'):
         
        self.lr = learning_rate
        self.epochs = epochs
        self.lambd = lambd
        self.W, self.B = None, None
        self.dW, self.dB = None, None
        self.X, self.Y = None, None
        self.cost_function = cost
        self.Z, self.A = None, None
        #addition start
        self.Costs=[]
        self.Acc=[]
        #addition end

    def fit(self, X, Y):
        
        self.X = X.T
        self.Y = Y.T
        self.initialize()
        self.optimize()

    def predict(self, X):

        Z = np.matmul(self.W, X.T) + self.B
        predictions = Sigmoid.forward(Z)
        predictions=np.round(predictions)
        return predictions

    def initialize(self):
        self.W = np.random.random((1, self.X.shape[0])) * 0.01
        self.B = np.random.random((1, 1)) * 0.01

    def optimize(self):

        for i in range(1, self.epochs+1):

            self.Z = np.matmul(self.W, self.X) + self.B
            self.A = Sigmoid.forward(self.Z)
            da = LOSS[self.cost_function].backward(self.Y, self.A)
            self.dW = np.matmul(da, self.X.T)
            self.dB = np.sum(da , axis=1, keepdims=True)
            self.W -= self.lr * self.dW
            self.B -= self.lr * self.dB
            #addition start
            self.Costs.append(LOSS[self.cost_function].forward(self.Y,self.A))
            prediction=self.predict(self.X.T)
            self.Acc.append((np.sum(prediction==self.Y)/self.Y.shape[0])*100)
    def Vizualize(self):
        return self.Costs,self.Acc
    def summary(self):
        pass
