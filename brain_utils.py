from new_brain.classification import (
    LogisticRegression,
    KNN,
    SVC
)
from new_brain.regression import LinearRegression
from new_brain.clustering import KMeans
from sklearn.model_selection import train_test_split
import numpy as np

## Trains, Tests and returns results of the user datas
def run(data, params, algorithm, y=1):

    if y:
        X_train, X_test, y_train, y_test = data
        obj, train_results = fit(X_train, y_train, params, algorithm)
        test_results = predict(obj, X_test, y_test)
        return train_results, test_results

    else:
        X_train, X_test = data
        obj, train_results = fit(X_train, params, algorithm)
        test_results = predict(obj, X_test)
        return train_results, test_results

## Returns training evaluation metrics and model object
def fit(X, y, params, algorithm):
    algorithm = list(algorithm)
    X, y = X, y

    if algorithm[0] == 'R':
        obj = LinearRegression(**params)
        obj.fit(X, y)
        return obj, obj.get_parameters()

    elif  algorithm[0] == 'C':
        if algorithm[1] == 'L':
            obj = LogisticRegression(**params)
            obj.fit(X, y)
            return obj, obj.get_parameters()

        if algorithm[1] == 'K':
            obj = KNN(**params)
            obj.fit(X, y)
            return obj, obj.get_parameters()

        if algorithm[1] == 'S':
            obj = SVC(**params)
            obj.fit(X, y)
            return obj, obj.get_parameters()

    elif algorithm[0] == 'K':
        obj = KMeans(**params)
        obj.fit(X)
        return obj, obj.get_parameters()

### Returns Testing evaluation metrics
def predict(obj, X_test, y_test):
    test_results = obj(X_test, y_test)
    return test_results

### Creates stratified splits of the data (X_train, X_test, y_train, y_test)
def split_data(X, test_size=.2, y=0):

    if type(y)==int:
        length = np.arange(len(X))
        X_train, X_test = train_test_split(X, test_size=test_size)
        X_train, X_test = X_train[X_train], X_test[X_test]
        return (X_train, X_test)

    else:
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, stratify=y)
        return (X_train, X_test, y_train, y_test)
