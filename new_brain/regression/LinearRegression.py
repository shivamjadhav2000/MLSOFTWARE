import numpy as np
from new_brain.base import BaseEstimator
from sklearn.metrics import r2_score
from math import ceil

class LinearRegression(BaseEstimator):
    def __init__(self, lr=1e-3, *, epochs=100, lambd=0, batch_size=None):
        super(LinearRegression, self).__init__()
        self.epochs = epochs
        self.lr = lr
        self.batch_size = batch_size
        self.lambd = lambd
        self.num_features = None
        self.num_samples = None

    def fit(self, X, Y):
        self.X = X.T
        self.Y = Y.reshape((1, -1))
        self.num_features = self.X.shape[0]
        self.num_samples = self.X.shape[1]
        self.initialize()
        self.create_mini_batches()
        self.optimize()

    def initialize(self):
        self.W = np.random.random((1, self.num_features)) * 0.01
        self.B = np.random.random((1, 1)) * 0.01

    def optimize(self):
        for _ in range(self.epochs):
            losses, scores = [], []
            for X, Y in zip(self.X, self.Y):
                Z = np.matmul(self.W, X) + self.B
                loss = self.loss_metric(Y, Z)
                score = self.score_metric(Y, Z)
                losses.append(loss)
                scores.append(score)

                if self.lambd:
                    reg_term = (self.lambd/Y.shape[1]) * np.sum(self.W)
                    dW = (np.matmul(Z - Y, X.T) / Y.shape[1]) + reg_term

                else:
                    dW = (np.matmul(Z - Y, X.T) / Y.shape[1])

                dB = np.sum(Z-Y, axis=1, keepdims=True)
                self.W -= self.lr * dW
                self.B -= self.lr * dB

            self.losses.append(np.mean(loss))
            self.scores.append(np.mean(score))

    def score_metric(self, y_true, y_pred):
        score = r2_score(y_true.ravel(), y_pred.ravel())
        return score

    def loss_metric(self, y_true, y_pred):
        numerator = np.sum(np.square(y_true - y_pred))
        denominator = 2 * y_true.size
        cost = numerator / denominator
        return cost

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
        params = {
        'weights' : self.W,
        'biases' : self.B,
        'lamda' : self.lambd,
        'batch_size' : self.batch_size,
        'learning_rate' : self.lr,
        'epochs' : self.epochs,
        'loss' : self.losses[-1],
        'score' : self.scores[-1],
        'num_features' : self.num_features,
        'num_samples' : self.num_samples,
        }

        return params


