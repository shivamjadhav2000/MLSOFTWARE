import numpy as np

def forward(Z):

    numerator = np.exp(Z) - np.exp(-Z)
    denominator = np.exp(Z) + np.exp(-Z)
    return numerator / denominator

def backward(Z):
    return 1 - np.square(Z)