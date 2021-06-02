import numpy as np
from brain.utils.constants import EPSILON

def forward(Y, Yhat):

    Term1 = -Y * np.log(Yhat + EPSILON)
    Term2 = -(1 - Y) * np.log(1 - Yhat + EPSILON)
    numerator = np.sum(Term1 + Term2)
    denominator = Y.size
    cost = numerator / denominator
    return cost

def backward(Y, Yhat):

    numerator = Yhat - Y
    denominator = Y.size
    gradient = numerator / denominator
    return gradient