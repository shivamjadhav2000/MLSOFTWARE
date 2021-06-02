import numpy as np

def Accuracy_Score(Y, Yhat):
    truths = np.mean(Y == Yhat)
    accuracy = truths * 100
    return accuracy