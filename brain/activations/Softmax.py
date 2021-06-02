import numpy as np

def forward(X):
    T = np.exp(X)
    return T / np.sum(X, axis=0)

def backward():
    pass