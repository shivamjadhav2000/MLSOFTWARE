from new_brain.base import BaseEstimator
from sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix
from math import ceil
import numpy as np

class LogisticRegression(BaseEstimator):
    def __init__(self, lr=1e-2, *, epochs=100, lambd=None, batch_size=None):
        super(LogisticRegression, self).__init__()
        self.lr = lr
        self.epochs = epochs
        self.lambd = lambd
        self.batch_size = batch_size
        self.num_classes = None
        self.num_features = None
        self.num_samples = None

    def __call__(self, X):
        Z = np.matmul(self.W, X.T) + self.B
        A = self.activation(Z).argmax(axis=0)
        return A

    def fit(self, X, Y):
        self.X_copy, self.Y_copy = X, Y
        self.X = X.T
        self.Y = Y.reshape((1, -1))
        self.num_classes = np.unique(self.Y).size
        self.num_features = self.X.shape[0]
        self.num_samples = self.X.shape[1]

        self.create_mini_batches()

        self.initialize()
        self.optimize()

    def initialize(self):
        self.W = np.random.random((self.num_classes, self.num_features)) * 0.01
        self.B = np.random.random((self.num_classes, 1)) * 0.01

    def optimize(self):
        for _ in range(self.epochs):
            scores = []
            losses = []
            for X, Y in zip(self.X, self.Y):
                Y = self.one_hot(Y)
                Z = np.matmul(self.W, X) + self.B
                A = self.activation(Z)
                loss = self.loss_metric(Y, A)
                score = self.score_metric(np.argmax(Y, axis=0), np.argmax(A, axis=0))
                losses.append(loss)
                scores.append(score)

                if self.lambd:
                    reg_term = (self.lambd/Y.shape[1]) * np.sum(self.W)
                    dW = (np.matmul(A - Y, X.T) / Y.shape[1]) + reg_term

                else:
                    dW = (np.matmul(A - Y, X.T) / Y.shape[1])

                dB = np.sum(A-Y, axis=1, keepdims=True)
                self.W -= self.lr * dW
                self.B -= self.lr * dB

            self.losses.append(np.mean(loss))
            self.scores.append(np.mean(score))

    def loss_metric(self, y_true, y_pred):
        m = y_pred.shape[1]
        epsilon = 1e-6
        cost = np.sum( np.sum( y_true * np.log( y_pred+epsilon), axis=0 ) )
        return -cost/m

    def score_metric(self, y_true, y_pred):
        correct = np.sum(y_true==y_pred)
        total = y_true.shape[0]
        return correct/total

    def activation(self, Z):
        t = np.exp(Z)
        return t / np.sum(t, axis=0)

    def one_hot(self, Y):
        unq = len(np.unique(Y))
        encd = np.zeros((unq, Y.size))
        encd[Y, np.arange(Y.size)] = 1
        Y = encd
        return Y

    def create_mini_batches(self):
        if self.batch_size is None:
            self.X, self.Y = [self.X], [self.Y]

        else:
            x_batches, y_batches = [], []
            n_batches = ceil(self.X.shape[1] / self.batch_size)
            start, end = 0, self.batch_size
            for _ in range(n_batches):
                if _ == n_batches-1:
                    x_batches.append(self.X[:, start:])
                    y_batches.append(self.Y[:, start:])
                else:
                    x_batches.append(self.X[:, start:end])
                    y_batches.append(self.Y[:, start:end])
                    start += self.batch_size
                    end += self.batch_size

            self.X = x_batches
            self.Y = y_batches

    def get_parameters(self):

        avg = 'binary' if np.unique(self.Y_copy).size==2 else None
        y_pred = self(self.X_copy)
        precision = precision_score(self.Y_copy, y_pred.ravel(), average=avg)
        recall = recall_score(self.Y_copy, y_pred.ravel(), average=avg)
        f1 = f1_score(self.Y_copy, y_pred.ravel(), average=avg)
        cf = confusion_matrix(self.Y_copy, y_pred.ravel())

        params = {
        'weights' : self.W,
        'biases' : self.B,
        'lamda' : self.lambd,
        'batch_size' : self.batch_size,
        'learning_rate' : self.lr,
        'epochs' : self.epochs,
        'losses' : self.losses[-1],
        'scores' : self.scores[-1],
        'num_classes' : self.num_classes,
        'num_features' : self.num_features,
        'num_samples' : self.num_samples,
        'precision' : precision.tolist(),
        'recall' : recall.tolist(),
        'f1_score' : f1.tolist(),
        'confusion_matrix' : cf.tolist()
        }

        return params
