import numpy as np
from new_brain.base import BaseEstimator
from sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix, accuracy_score

class KNN(BaseEstimator):

    """
    P : Parameter for Minkowski Distance.
        P = 1 for Manhattan Distance
        P = 2 for Eucledian Distance

        Note : P > 0 and should be an integer

    K : Hyper parameter for # of neighbours
    """

    def __init__(self, neighbours=11, p=2, get_probs=False):
        super(KNN, self).__init__()
        self.K = neighbours
        self.P = p
        self.probs = get_probs
        self.probabilities = []
        self.num_classes = None
        self.num_features = None
        self.num_samples = None

    def fit(self, X, Y):
        self.X = X
        self.Y = Y
        self.num_features = self.X.shape[1]
        self.num_samples = self.X.shape[0]
        self.num_classes = np.unique(self.Y).size

    def __call__(self, X):

        predictions = []
        self.probabilities = []
        for point in X:

            dist = np.power(self.X - point, self.P)
            dist = np.power(np.sum(dist, axis=1), 1/self.P)
            preds = np.argsort(dist)[:self.K]
            preds = list(self.Y[preds])
            unq_pts = sorted(np.unique(self.Y))
            predictions.append(np.argmax([preds.count(i) for i in unq_pts]))
            self.probabilities.append([preds.count(i) / self.K for i in unq_pts])

        self.probabilities = np.array(self.probabilities) * 100
        predictions = np.array(predictions)
        return predictions if not self.probs else self.probabilities

    def get_probs(self):
        return self.probabilities

    def one_hot(self, Y):
        unq = len(np.unique(Y))
        encd = np.zeros((unq, Y.size))
        encd[Y, np.arange(Y.size)] = 1
        Y = encd
        return Y

    def loss_metric(self, y_true, y_pred):
        m = y_pred.shape[1]
        epsilon = 1e-6
        cost = np.sum( np.sum( y_true * np.log( y_pred+epsilon), axis=0 ) )
        return -cost/m

    def get_parameters(self):
        y_pred = self(self.X)
        avg = 'binary' if np.unique(self.Y).size==2 else None
        score = accuracy_score(self.Y, y_pred.ravel())
        precision = precision_score(self.Y, y_pred.ravel(), average=avg)
        recall = recall_score(self.Y, y_pred.ravel(), average=avg)
        f1 = f1_score(self.Y, y_pred.ravel(), average=avg)
        cf = confusion_matrix(self.Y, y_pred.ravel())

        y_true, y_pred = self.one_hot(self.Y.reshape((1, -1))), self.one_hot(y_pred.reshape((1, -1)))
        loss = self.loss_metric(y_true, y_pred)

        params = {
        'K' : self.K,
        'P' : self.P,
        'score' : score,
        'loss' : loss,
        'num_classes' : self.num_classes,
        'num_features' : self.num_features,
        'num_samples' : self.num_samples,
        'precision' : precision.tolist(),
        'recall' : recall.tolist(),
        'f1_score' : f1.tolist(),
        'confusion_matrix' : cf.tolist()
        }

        return params

from sklearn.datasets import load_iris
from sklearn.preprocessing import StandardScaler
data = load_iris()
x = data.data
y = data.target
x = StandardScaler().fit_transform(x)
lr = KNN()
lr.fit(x, y)
print(f"precision : {lr.get_parameters()['precision']}")
print(f"recall : {lr.get_parameters()['recall']}")
print(f"f1_score : {lr.get_parameters()['f1_score']}")
