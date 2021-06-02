import numpy as np
from brain.utils.constants import LR, EPOCHS
from brain.losses import LOSS

class LinearRegression:

    def __init__(self, learning_rate=LR, epochs=EPOCHS, cost_function='MSE', gamma1=0, gamma2=0):

        self.lr = learning_rate
        self.epochs = epochs
        self.cost = cost_function
        self.g1 = gamma1
        self.g2 = gamma2
        self.X, self.Y = None, None
        self.W, self.B = None, None
        self.dW, self.dB = None, None
        self.Z, self.info = None, None
        self.predictions, self.da = None, None

    def initialize(self):
        self.W = 2 * np.random.random((1, self.X.shape[0])) - 1
        self.B = 2 * np.random.random((1, 1)) - 1

    def fit(self, X, Y):
        self.X = X.T
        self.Y = Y.reshape((1, -1))
        self.initialize()
        self.optimize()

    def predict(self, X):
        self.predictions = np.matmul(self.W, X.T) + self.B
        return self.predictions

    def optimize(self):
        
        for i in range(1, self.epochs+1):

            self.Z = np.matmul(self.W, self.X) + self.B
            self.da = LOSS[self.cost].backward(self.Y, self.Z)
            self.dW = np.matmul(self.da, self.X.T)
            self.dB = np.sum(self.da, axis=1)

            self.W -= self.lr * self.dW
            self.B -= self.lr * self.dB

    
