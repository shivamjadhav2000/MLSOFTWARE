import numpy as np

def forward(Z):
    return 1 / ( 1 + np.exp(-Z + 1e-8) )

def backward(Z):
    return Z * ( 1 - Z )