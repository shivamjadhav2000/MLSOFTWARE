import numpy as np

class KNN:

    """
    P : Parameter for Minkowski Distance.
        P = 1 for Manhattan Distance
        P = 2 for Eucledian Distance

        Note : P > 0 and should be an integer

    K : Hyper parameter for # of neighbours

    """

    def __init__(self, neighbours=11, p=2):
        self.K = neighbours
        self.P = p
        self.X, self.Y = None, None
        self.probabilities = []

    def fit(self, X, Y):
        self.X = X
        self.Y = Y

    def predict(self, X):

        predictions = []
        for point in X:

            dist = np.power(self.X - point, self.P)
            dist = np.power(np.sum(dist, axis=1), 1/self.P)
            preds = np.argsort(dist)[:self.K]
            preds = list(self.Y[preds])
            unq_pts = sorted(np.unique(self.Y))
            predictions.append(np.argmax([preds.count(i) for i in unq_pts]))
            self.probabilities.append([preds.count(i)/self.K for i in unq_pts])

        return predictions

    def get_probs(self):

        self.probabilities = np.array(self.probabilities) * 100
        return self.probabilities