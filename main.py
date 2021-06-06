import eel
import numpy as np
import pandas as pd
import os
from sklearn.preprocessing import StandardScaler, LabelEncoder, OneHotEncoder

"""
0 : file path doesnt exist
1 : file type errors
"""

@eel.expose
def main(file_pth):
    # file_pth = file_pth[1:-1]
    data = check_for_errors(file_pth)
    columns = data.columns
    column_dtypes = np.array(data.dtypes).astype(str).tolist()
    categorical = len([tp for tp in column_dtypes if tp=='object'])
    numerical = len(columns) - categorical
    return np.array(data.head(10)).tolist(), columns, numerical, categorical


def check_for_errors(file_pth):

    """
    This part of code checks for for any errors in loading or opening the dataset.
    """
    error = -1
    if not os.path.exists(file_pth):
        error = 0
        return error

    file_type = os.path.split(file_pth)[-1].split('.')[-1]

    if file_type == 'csv':
        data = pd.read_csv(file_pth)

    elif file_type == 'xlsx':
        data = pd.read_excel(file_pth)

    else:
        error = 1
        return error

    """
    This part of code checks for for NaN values in the dataset.
    """

    # columns_mask = list(data.isna().sum() == len(data))
    # data_columns = data.columns
    # masked_columns = data_columns[columns_mask]
    # data.drop(labels=masked_columns, axis=1, inplace=True)

    data.dropna(axis=1, inplace=True)

    return data
