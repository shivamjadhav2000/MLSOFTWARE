import numpy as np

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
        self.best_idx = None
        self.min_loss = None

    def __call__(self, X, Y=None):
        cost = []
        distances = np.zeros((X.shape[0], self.K))
        for trail in range(self.trials):

            for i in range(self.K):
                temp = np.square(X - self.centroids[trail, i, :]).sum(axis=1)
                dist = np.sqrt(temp)
                distances[:, i] = dist

            clusters = np.argmin(self.distances, axis=1)

            cost.append(self.loss_metric(self.X, self.centroids[trail], self.K))

        cost = np.array(cost)
        best_idx = cost.argmin()
        params = {
        'min_loss' : cost[best_idx],
        'loss_per_trial' : cost,
        }
        return params

    def fit(self, X):
        self.X = X
        self.M = self.X.shape[0]
        self.distances = np.zeros((self.X.shape[0], self.K))
        self.centroids = np.zeros((self.trials, self.K, self.X.shape[1]))
        self.form_clusters()
        self.best_idx = np.array(self.cost).argmin()
        self.min_loss = self.cost[self.best_idx]
        self.best_centroid = self.centroids[self.best_idx]

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

            self.cost.append(self.loss_metric(self.X, self.centroids[trail], self.K))

    def get_centroids(self):
        return self.centroids

    def get_parameters(self):
        params = {
        'min_loss' : self.min_loss,
        'best_centroid' : self.best_centroid,
        'best_trial' : self.best_idx+1,
        'K' : self.K,
        'max_iters' : self.iters,
        'centroids' : self.centroids,
        'loss_per_trial' : self.cost,
        'trials' : self.trials
        }

        return params

    def loss_metric(self, X, centroids, K):
        cost = 0
        distances = np.zeros((X.shape[0], K))

        for i in range(K):
            temp = np.sum(np.square(centroids[i] - X), axis=1)
            dist = np.sqrt(temp)
            distances[:, i] = dist

        clusters = np.argmin(distances, axis=1)

        for i in range(K):
            filtr = clusters==i
            temp = np.mean(distances[filtr][:, i])
            cost += temp

        return cost/K
