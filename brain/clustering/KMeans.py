import numpy as np
from brain.losses import LOSS

class KMeans:

    def __init__(self, K=3, trials=3, max_iters=250):
        self.K = K
        self.trials = trials
        self.iters = max_iters
        self.X = None
        self.cost = None
        self.centroids = None
        self.clusters = None
        self.distances = None
        self.M = None

    def fit(self, X):
        self.X = X
        self.M = self.X.shape[0]
        self.distances = np.zeros((self.X.shape[0], self.K))
        self.centroids = np.zeros((self.trials, self.K, self.X.shape[1]))
        self.form_clusters()

    def form_clusters(self):

        self.cost = []
        
        for trail in range(self.trials):
            choice = np.random.choice(replace=False, size=self.K, a=self.M)
            self.centroids[trail, :, :] = self.X[choice]

            for _ in range(self.iters):

                for i in range(self.K):
                    temp = np.square(self.X - self.centroids[trail, i, :]).sum(axis=1)
                    dist = np.sqrt(temp)
                    self.distances[:, i] = dist

                self.clusters = np.argmin(self.distances, axis=1)

                for i in range(self.K):
                    filtr = self.clusters==i
                    self.centroids[trail, i, :] = np.mean(self.X[filtr], axis=0)

            self.cost.append(LOSS['DE'].forward(self.X, self.centroids[trail], self.K))

    def get_centroids(self):
        return self.centroids