import eel
import numpy as np
import pandas as pd
import os
from sklearn.preprocessing import StandardScaler, LabelEncoder, OneHotEncoder
from brain_utils import split_data, run

myDataFrame=None
myFeatures=None
DataFrame = None
X, Y = None, None
CHOICES = None
categorical = None
numerical = None
build_stat = True
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
    global DataFrame
    CHOICES = choices
    # preprocessing_data()
    return True

def preprocessing_data(target=0, algo='C'):
    global numerical
    global categorical
    global CHOICES
    global DataFrame
    global myDataFrame

    new_cats = [cat for cat in CHOICES if cat in categorical]
    new_nums = [num for num in CHOICES if num in numerical]
    cat_data = myDataFrame[new_cats]
    num_data = myDataFrame[new_nums]

    if target != 0:
        # target = new_cats.pop(new_cats.index(target)) if target in new_cats else new_nums.pop(new_nums.index(target))
        num_data = pd.DataFrame(data=StandardScaler().fit_transform(num_data), columns=num_data.columns)
        cat_data = myDataFrame[new_cats].aggregate(LabelEncoder().fit_transform)
        cat_data = pd.DataFrame(data=StandardScaler().fit_transform(cat_data), columns=cat_data.columns)
        DataFrame = pd.concat([num_data, cat_data], axis=1)
        target_feature = target

        if algo=='R':
            target = myDataFrame[target_feature].values.reshape((-1, 1))
            target = StandardScaler().fit_transform(target)
            DataFrame[target_feature] = target

        elif algo=='C':
            target = myDataFrame[target_feature].values.reshape((-1,1))
            DataFrame[target_feature] = target.astype(int)

    else:
        DataFrame = pd.DataFrame(data=StandardScaler().fit_transform(myDataFrame[CHOICES]), columns=CHOICES)

## main build function
@eel.expose
def build(algorithm, params=None, target_feature=0):
    print("inside build algo=",algorithm,"params=",params)
    global DataFrame
    global CHOICES
    global X
    global Y
    global build_stat
    print("parms = ",params,"algorithm = ",algorithm,"target_features = ",target_feature)
    ## For Supervised Learning (i.e, with Y)
    if target_feature != 0:
        if build_stat:
            preprocessing_data(target_feature, list(algorithm)[0])

        ch = CHOICES.copy()
        y_choices = ch.pop(ch.index(target_feature))
        x_choices = ch
        X = DataFrame.loc[:, x_choices].values
        Y = DataFrame.loc[:, y_choices].values.ravel()

        data = split_data(X, y=Y)
        train_results, test_results = run(data, params, algorithm)
        compared_results = dict()
        for key in test_results.keys():
            compared_results[key] = (train_results[key], test_results[key])

        return compared_results, train_results, test_results

    ## For Unsupervised Learning (i.e, without Y)
    else:
        if build_stat:
            build_stat = False
            preprocessing_data()
        X = DataFrame.values


## helper function to get meta data from availaible dataset

@eel.expose
def getMetaData(Algo):
    global CHOICES
    global myDataFrame
    if Algo=='RL' or Algo=='RR' or Algo=="RP" or Algo=="CL":
        return {'datasetSize':len(myDataFrame),'totalSelectedFeatures':CHOICES}


eel.start("main.html",size=(1000,700))
