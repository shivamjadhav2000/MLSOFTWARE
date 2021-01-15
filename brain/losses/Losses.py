from brain.losses import BinaryCrossEntropy
from brain.losses import MeanSquaredError
from brain.losses import CategoricalCrossEntropy
from brain.losses import SparseCategoricalCrossEntropy

LOSS = dict()
LOSS['BinaryCrossEntropy'] = BinaryCrossEntropy
LOSS['MeanSquaredError'] = MeanSquaredError
LOSS['CategoricalCrossEntropy'] = CategoricalCrossEntropy
LOSS['SparseCategoricalCrossEntropy'] = SparseCategoricalCrossEntropy

LOSS['BCE'] = BinaryCrossEntropy
LOSS['MSE'] = MeanSquaredError
LOSS['CCE'] = CategoricalCrossEntropy
LOSS['SCCE'] = SparseCategoricalCrossEntropy