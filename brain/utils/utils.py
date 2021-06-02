import numpy as np
import matplotlib.pyplot as plt
import plotly.offline as pof
import plotly.graph_objs as go
import os

def OneHotEncode(Y):

    if isinstance(Y, list) or isinstance(Y, tuple):
        Y = np.array(Y)
    else:
        count = len(np.unique(Y))
        if count>2:
            encoded_Y = np.zeros((Y.size, count), dtype=np.int8)
            for i in range(Y.size):
                encoded_Y[i, Y[i]] = 1
            return encoded_Y

        else:
            return Y


def plot_cost_acc(cost, accuracy, interactive=False, path='./'):
    
    if interactive:
        pass

    else:
        plt.figure(1)
        plt.plot(cost, 'r-', alpha=0.7, label='Cost')
        plt.legend()
        plt.savefig(os.path.join(path, 'Cost.png'))
        plt.figure(2)
        plt.plot(accuracy, 'g-', alpha=0.7, label='Accuracy')
        plt.legend()
        plt.savefig(os.path.join(path, 'Accuracy.png'))
        



