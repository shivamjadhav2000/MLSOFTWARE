import numpy as np

def forward(Y, Yhat):
    
    numerator = np.sum(np.square(Yhat - Y))
    denominator = 2 * Y.size
    cost = numerator / denominator
    return cost

def backward(Y, Yhat):
    
    numerator = Yhat - Y
    denominator = Y.size
    gradient = (Yhat - Y) / denominator
    return gradient