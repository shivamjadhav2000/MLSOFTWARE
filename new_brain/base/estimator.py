class BaseEstimator:
    def __init__(self):
        self.epochs = 100
        self.W, self.B = None, None
        self.losses, self.scores = [], []
        self.X, self.y = None, None
        self.epsilon = 1e-6
        self.metirc_results = dict()

    def __call__(self, X):
        pass

    def fit(self, X, y):
        pass

    def initialize(self):
        pass

    def optimize(self):
        pass

    def get_parameters(self):
        pass

    def get_losses(self):
        return self.losses

    def get_scores(self):
        return self.scores

    def score_metric(self):
        pass

    def loss_metric(self):
        pass

    def get_performance_metrics(self):
        return self.metric_results
