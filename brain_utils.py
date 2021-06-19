from new_brain.classification import (
    LogisticRegression,
    KNN,
    SVC
)
from new_brain.regression import LinearRegression
from new_brain.clustering import KMeans
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures
import numpy as np

## Trains, Tests and returns results of the user datas
def run(data, params, algorithm):

    degree = params['degree']
    algorithm = list(algorithm)
    del params['degree']

    if algorithm[0]=='K':
        X_train, X_test = data
        obj, train_results = fit(X_train, None, params, algorithm, degree)
        test_results = predict(obj, X_test, None, degree, algorithm)
        return train_results, test_results


    X_train, X_test, y_train, y_test = data
    obj, train_results = fit(X_train, y_train, params, algorithm, degree)
    test_results = predict(obj, X_test, y_test, degree, algorithm)
    return train_results, test_results

## Returns training evaluation metrics and model object
def fit(X, y, params, algorithm, degree):
    degree = degree
    algorithm = list(algorithm)
    X, y = X, y

    if algorithm[0] == 'R':
        if algorithm[1] == 'L':
            obj = LinearRegression(**params)
            obj.fit(X, y)
            return obj, obj.get_parameters()

        else:
            X = PolynomialFeatures(degree=degree).fit_transform(X)
            obj = LinearRegression(**params)
            obj.fit(X, y)
            return obj, obj.get_parameters()

    elif  algorithm[0] == 'C':

        X = PolynomialFeatures(degree=degree).fit_transform(X)

        if algorithm[1] == 'L':
            obj = LogisticRegression(**params)
            obj.fit(X, y)
            return obj, obj.get_parameters()

        if algorithm[1] == 'K':
            obj = KNN(**params)
            obj.fit(X, y)
            return obj, obj.get_parameters()

        if algorithm[1] == 'S':
            if params['class_weight'] == 'None':
                params['class_weight'] = None

            if params['kernel'] == 'polynomial':
                params['kernel'] = 'poly'

            obj = SVC(**params)
            obj.fit(X, y)
            return obj, obj.get_parameters()

    elif algorithm[0] == 'K':

        X = PolynomialFeatures(degree=degree).fit_transform(X)
        obj = KMeans(**params)
        obj.fit(X)
        return obj, obj.get_parameters()

### Returns Testing evaluation metrics
def predict(obj, X_test, y_test, degree, algorithm):
    degree = degree
    algorithm = list(algorithm)

    if algorithm[0] == 'R' and algorithm[1] == 'L':
        test_results = obj(X_test, y_test)
        return test_results

    X_test = PolynomialFeatures(degree=degree).fit_transform(X_test)
    test_results = obj(X_test, y_test)
    return test_results

### Creates stratified splits of the data (X_train, X_test, y_train, y_test)
def split_data(X, test_size=.2, y=None, algorithm=None):

    algorithm = list(algorithm)
    if algorithm[0] == 'K':
        length = np.arange(len(X))
        X_train, X_test = train_test_split(length, test_size=test_size)
        X_train, X_test = X[X_train], X[X_test]
        return (X_train, X_test)

    elif algorithm[0] == 'C':
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, stratify=y)
        return (X_train, X_test, y_train, y_test)

    else:
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size)
        return (X_train, X_test, y_train, y_test)
