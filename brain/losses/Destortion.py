import numpy as np

def forward(X, centroids, K):
    cost = 0
    distances = np.zeros((X.shape[0], K))

    for i in range(K):
        temp = np.sum(np.square(centroids[i] - X), axis=1)
        dist = np.sqrt(temp)
        distances[:, i] = dist

    clusters = np.argmin(distances, axis=1)

    for i in range(K):
        filtr = clusters==i
        temp = np.mean(distances[filtr][:, i])
        cost += temp
    
    return cost/K