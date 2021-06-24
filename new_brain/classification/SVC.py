from sklearn.svm import SVC as SV
import sklearn.utils._weight_vector
import numpy as np
from new_brain.base import BaseEstimator
from sklearn.metrics import accuracy_score, confusion_matrix, precision_score, recall_score, f1_score

class SVC(BaseEstimator):
    def __init__(self, C=1.0, kernel='rbf', degree=3, gamma='scale',
                class_weight=None, max_iter=-1):
        super(SVC, self).__init__()
        self.estimator = None
        self.param_grid = {
            'C' : C,
            'kernel' : kernel,
            'degree' : degree,
            'gamma' : gamma,
            'class_weight' : class_weight,
            'max_iter' : max_iter,
        }

    def __call__(self, x, y):

        num_samples = x.shape[0]
        num_features = x.shape[1]
        num_classes = np.unique(y).size

        preds =  self.estimator.predict(x)

        score = accuracy_score(y, preds)
        loss = (1 - score) * 10

        avg = None

        precision = precision_score(y, preds, average=avg, zero_division=1).tolist()
        recall = recall_score(y, preds, average=avg, zero_division=1).tolist()
        f1 = f1_score(y, preds, average=avg).tolist()
        cf = confusion_matrix(y, preds).tolist()

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

    def fit(self, X, Y):
        self.X = X
        self.y = Y
        self.estimator = SV(**self.param_grid)
        self.estimator.fit(self.X, self.y)
        self.scores = self.score_metric()
        self.losses = self.loss_metric()

    def loss_metric(self):
        loss = (1 - self.scores) * 10
        return loss

    def score_metric(self):
        y_pred = self.estimator.predict(self.X)
        score = accuracy_score(self.y, y_pred)
        return score

    def get_parameters(self):

        avg = None
        y_pred = self.estimator.predict(self.X)
        precision = precision_score(self.y, y_pred.ravel(), average=avg, zero_division=1)
        recall = recall_score(self.y, y_pred.ravel(), average=avg, zero_division=1)
        f1 = f1_score(self.y, y_pred.ravel(), average=avg)
        cf = confusion_matrix(self.y, y_pred.ravel())

        self.param_grid['num_classes'] = np.unique(self.y).size
        self.param_grid['num_features'] = self.X.shape[1]
        self.param_grid['num_samples'] = self.y.size
        self.param_grid['loss'] = self.losses
        self.param_grid['score'] = self.scores
        self.param_grid['precision'] = precision.tolist()
        self.param_grid['recall'] = recall.tolist()
        self.param_grid['f1_score'] = f1.tolist()
        self.param_grid['confusion_matrix'] = cf.tolist()

        return self.param_grid
