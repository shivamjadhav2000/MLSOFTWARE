import numpy as np
from brain.utils.constants import EPSILON

def forward(Y, Yhat):

    numerator =  - np.sum(Y * np.log(Yhat + EPSILON), axis=0)
    denominator = Y.shape[1]
    cost = np.sum(numerator) / denominator
    return cost

def backward(Y, Yhat):
    
    numerator = Yhat - Y
    denominator = Y.shape[1]
    gradient = (Yhat - Y) / denominator