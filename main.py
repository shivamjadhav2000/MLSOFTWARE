import eel
import numpy as np
import pandas as pd
import os
from sklearn.preprocessing import StandardScaler, LabelEncoder, OneHotEncoder

myDataFrame=None
myFeatures=None
train_data = None
CHOICES = None
categorical = None
numerical = None
"""
0 : file path doesnt exist
1 : file type errors
"""
def heat_map(columns, corr):
    ans = []
    for idx, value in enumerate(corr):
        ans.append({'name' : columns[idx], 'data' : [{'x' : x[0], 'y' : x[1]} for x in list(zip(columns, value))]})
    return ans

eel.init("APP")
@eel.expose
def main(file_pth):
    file_pth = file_pth[1:-1]
    data = check_for_errors(file_pth)
    global myDataFrame
    global myFeatures
    global categorical
    global numerical
    myDataFrame=data
    correlationmatrix=myDataFrame.corr().values.tolist()
    correlationmatrixKeys=list(myDataFrame.corr().to_dict().keys())
    formattedCorrelationMatrix=heat_map(correlationmatrixKeys,correlationmatrix)
    columns = list(data.columns)

    myFeatures=columns
    column_dtypes = np.array(data.dtypes).astype(str).tolist()
    categorical = [columns[idx] for idx,tp in enumerate(column_dtypes) if tp=='object']
    numerical =   [columns[idx] for idx,tp in enumerate(column_dtypes) if tp=='int64']
    return np.array(data.head(10)).tolist(), columns, numerical, categorical,formattedCorrelationMatrix


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

@eel.expose
def GetFeatureValues(featureName):
    global myFeatures
    global myDataFrame
    if featureName in myFeatures:
        mask = [3, 4, 1, 6, 7]
        info = np.array(list(myDataFrame[featureName].describe()))[mask]
        info[2] = np.median(myDataFrame[featureName])
        return info.tolist()

@eel.expose
def get_user_choices(choices): #choices = [] ==>> list of all choices numerical union categoricals
    global CHOICES
    CHOICES = choices
    preprocessing_data()
    print(train_data)
    return train_data.tolist()

def preprocessing_data():
    global numerical
    global categorical
    global CHOICES
    data = myDataFrame[CHOICES]
    new_cats = [cat for cat in CHOICES if cat in categorical]
    new_nums = [num for num in CHOICES if num in numerical]

    cat_data = myDataFrame[new_cats]
    num_data = myDataFrame[new_nums]

    num_data = pd.DataFrame(data=StandardScaler().fit_transform(num_data), columns=num_data.columns)
    cat_data = data.aggregate(LabelEncoder().fit_transform)
    cat_data = pd.DataFrame(data=StandardScaler().fit_transform(cat_data), columns=cat_data.columns)

    global train_data
    train_data = pd.concat([num_data, cat_data], axis=1).values

eel.start("main.html",size=(1000,700))
