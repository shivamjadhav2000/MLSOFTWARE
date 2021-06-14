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

    def __init__(self, neighbours=11, p=2):
        super(KNN, self).__init__()
        self.K = neighbours
        self.P = p
        self.num_classes = None
        self.num_features = None
        self.num_samples = None

    def fit(self, X, Y):
        self.X = X
        self.Y = Y
        self.num_features = self.X.shape[1]
        self.num_samples = self.X.shape[0]
        self.num_classes = np.unique(self.Y).size

    def __call__(self, X, y):

        predictions = []
        for point in X:

            dist = np.power(self.X - point, self.P)
            dist = np.power(np.sum(dist, axis=1), 1/self.P)
            preds = np.argsort(dist)[:self.K]
            preds = list(self.Y[preds])
            unq_pts = sorted(np.unique(self.Y))
            predictions.append(np.argmax([preds.count(i) for i in unq_pts]))

        predictions = np.array(predictions)
        avg = None

        num_samples = X.shape[0]
        num_features = X.shape[1]
        num_classes = np.unique(y).size
        score = accuracy_score(y, predictions)
        loss = self.loss_metric(y, predictions)
        precision = precision_score(y, predictions, average=avg).tolist()
        recall = recall_score(y, predictions, average=avg).tolist()
        f1 = f1_score(y, predictions, average=avg).tolist()
        cf = confusion_matrix(y, predictions).tolist()

        params = {
        'num_samples' : num_samples,
        'num_features' : num_features,
        'num_classes' : num_classes,
        'score' : score,
        'loss' : loss,
        'f1_score' : f1,
        'precision' : precision,
        'recall' : recall,
        'confusion_matrix' : cf
        }

        return params

    def get_probs(self):
        return self.probabilities

    def one_hot(self, Y):
        unq = len(np.unique(Y))
        encd = np.zeros((unq, Y.size))
        encd[Y, np.arange(Y.size)] = 1
        Y = encd
        return Y

    def loss_metric(self, y_true, y_pred):
        score = accuracy_score(y_true, y_pred)
        loss = (1 - score) * 10
        return loss

    def predict(self, X):

        predictions = []
        for point in X:

            dist = np.power(self.X - point, self.P)
            dist = np.power(np.sum(dist, axis=1), 1/self.P)
            preds = np.argsort(dist)[:self.K]
            preds = list(self.Y[preds])
            unq_pts = sorted(np.unique(self.Y))
            predictions.append(np.argmax([preds.count(i) for i in unq_pts]))

        predictions = np.array(predictions)

        return predictions

    def get_parameters(self):
        y_pred = self.predict(self.X)
        avg = None
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
