import numpy as np

def forward(Z):
    return np.maximum(Z, 0)

def backward(Z):
    return np.where(Z>=0, 1, 0)