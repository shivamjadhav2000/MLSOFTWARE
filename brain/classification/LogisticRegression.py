import numpy as np
from brain.activations import Sigmoid
from brain.losses import LOSS
from brain.utils.constants import LR, EPOCHS
from brain.metrics.classification import Accuracy_Score

class LogisticRegression:

    def __init__(self, learning_rate=LR, epochs=EPOCHS, lambd=0, cost='BCE'):

        self.lr = learning_rate
        self.epochs = epochs
        self.lambd = lambd
        self.W, self.B = None, None
        self.dW, self.dB = None, None
        self.X, self.Y = None, None
        self.cost_function = cost
        self.Z, self.A = None, None
        self.info = None
        self.cost, self.accuracy = None, None

    def fit(self, X, Y):
        
        self.X = X.T
        self.Y = Y.T
        self.initialize()
        self.optimize()

    def predict(self, X):

        self.Z = np.matmul(self.W, X.T) + self.B
        predictions = Sigmoid.forward(self.Z)
        predictions = np.round(predictions).astype(np.int16)
        return predictions.ravel()

    def initialize(self):
        self.W = np.random.random((1, self.X.shape[0])) * 0.01
        self.B = np.random.random((1, 1)) * 0.01

    def optimize(self):

        self.cost = []
        self.accuracy = []
        for i in range(1, self.epochs+1):

            self.Z = np.matmul(self.W, self.X) + self.B
            self.A = Sigmoid.forward(self.Z)
            self.cost.append(LOSS[self.cost_function].forward(self.Y, self.A))
            self.accuracy.append(Accuracy_Score(self.Y, np.round(self.A).ravel()))
            da = LOSS[self.cost_function].backward(self.Y, self.A)
            self.dW = np.matmul(da, self.X.T)
            self.dB = np.sum(da , axis=1, keepdims=True)

            self.W -= self.lr * self.dW
            self.B -= self.lr * self.dB

    def get_cst_acc(self):
        return self.cost, self.accuracy
