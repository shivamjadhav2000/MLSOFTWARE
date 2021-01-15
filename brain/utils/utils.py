import numpy as np
import matplotlib.pyplot as plt
import plotly.offline as pof
import plotly.graph_objs as go

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


def plot_cost_acc(cost, accuracy, interactive=False):
    
    if interactive:
        pass

    else:
        plt.plot(cost, 'r-', accuracy, 'g-', alpha=0.7)
        plt.legend(['Cost', 'Accuracy'])
