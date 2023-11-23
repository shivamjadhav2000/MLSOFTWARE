import eel
import numpy as np
import pandas as pd
import os
from sklearn.preprocessing import StandardScaler, LabelEncoder
from brain_utils import split_data, run
import sys
import atexit

outfile = open("logfile.txt", "wt")
sys.stderr = outfile
sys.stdout = outfile
def close_file():
    outfile.close()

atexit.register(close_file)
myDataFrame=None
myFeatures=None
DataFrame = None
X, Y = None, None
CHOICES = None
categorical = None
numerical = None
build_stat = True
ComparedResults = None
TrainResults = None
TestResults = None
PATH = None
MyAlgorithm=None

"""
0 : file path doesnt exist
1 : file type errors
"""
def heat_map(columns, corr):
    ans = []
    for idx, value in enumerate(corr):
        ans.append({'name' : columns[idx], 'data' : [{'x' : x[0], 'y' : x[1]} for x in list(zip(columns, value))]})
    return ans
def check_for_errors(file_pth):
    """
    This part of code checks for for any errors in loading or opening the dataset.
    """
    if not os.path.exists(rf'{file_pth}'):
        return "entered file path is invalid"

    file_type = os.path.split(file_pth)[-1].split('.')[-1]

    if file_type == 'csv':
        data = pd.read_csv(file_pth)

    elif file_type == 'xlsx':
        data = pd.read_excel(file_pth)

    else:
        return "file type is not supported , only 'csv' and 'xlsx' are accepted "

    """
    This part of code checks for for NaN values in the dataset.
    """

    data.dropna(axis=1, inplace=True)

    return data

def preprocessing_data(target=0, algo='C'):
    global numerical
    global categorical
    global CHOICES
    global DataFrame
    global myDataFrame

    new_cats = [cat for cat in CHOICES if cat in categorical]
    new_nums = [num for num in CHOICES if num in numerical]

    if new_cats:
        cat_data = myDataFrame[new_cats]

    if new_nums:
        num_data = myDataFrame[new_nums]


    if new_cats and new_nums:
        cat_data = myDataFrame[new_cats].aggregate(LabelEncoder().fit_transform)
        DataFrame = pd.concat([num_data, cat_data], axis=1)
        DataFrame = pd.DataFrame(StandardScaler().fit_transform(DataFrame.values), columns=DataFrame.columns)

    if new_nums and not new_cats:
        num_data = pd.DataFrame(data=StandardScaler().fit_transform(num_data), columns=num_data.columns)
        DataFrame = num_data

    if new_cats and not new_nums:
        cat_data = myDataFrame[new_cats].aggregate(LabelEncoder().fit_transform)
        cat_data = pd.DataFrame(data=StandardScaler().fit_transform(cat_data), columns=cat_data.columns)
        DataFrame = cat_data


    if target != 0:
        target_feature = target
        if algo=='R':
            target = myDataFrame[target_feature].values.reshape((-1, 1))
            target = StandardScaler().fit_transform(target)
            DataFrame[target_feature] = target

        elif algo=='C':
            target = myDataFrame[target_feature].values.reshape((-1,1))
            DataFrame[target_feature] = target.astype(int)
@eel.expose
def main_init():
    if(PATH!=None):
        return True
    else:
        return False


@eel.expose
def main(file_pth=PATH):
    try:
        global myDataFrame
        global myFeatures
        global categorical
        global numerical
        global PATH
        if(len(file_pth)==0 and PATH !=None):
            file_pth=PATH
        if file_pth.startswith('"') and file_pth.endswith('"'):
            file_pth = file_pth[1:-1]
        
        data = check_for_errors(file_pth)
        
        if isinstance(data, str):
            return data
        else:
            
            PATH = file_pth
            myDataFrame = data
            
            columns = list(data.columns)
            myFeatures = columns
            column_dtypes = np.array(data.dtypes).astype(str).tolist()
            
            categorical = [columns[idx] for idx, tp in enumerate(column_dtypes) if tp == 'object']
            numerical = [columns[idx] for idx, tp in enumerate(column_dtypes) if tp != 'object']

            myDataFrameNumerical = myDataFrame[numerical]
            correlationmatrix = myDataFrameNumerical.corr().values.tolist()
            correlationmatrixKeys = list(myDataFrameNumerical.corr().to_dict().keys())
            formattedCorrelationMatrix = heat_map(correlationmatrixKeys, correlationmatrix)
            
            return (
                np.array(data.head(10)).tolist(),
                columns,
                numerical,
                categorical,
                formattedCorrelationMatrix
            )
    except Exception as e:
        print(f"Error: {e}", flush=True)
        return "An error occurred. Please check the input file.", None, None, None, None

@eel.expose
def GetFeatureValues(featureName):
    global myFeatures
    global myDataFrame
    if featureName in myFeatures:
        mask = [3, 4, 1, 6, 7]
        info = np.array(list(myDataFrame[featureName].describe()))[mask]
        info[2] = np.median(myDataFrame[featureName])
        return info.tolist()
    return 'featureName invalid'

@eel.expose
def get_user_choices(choices): #choices = [] ==>> list of all choices numerical union categoricals
    global CHOICES
    global DataFrame
    CHOICES = choices
    return True



    
## main build function
@eel.expose
def build(algorithm, params=None, target_feature=0):
    try:
        global MyAlgorithm
        global DataFrame
        global CHOICES
        global X
        global Y
        global build_stat
        global ComparedResults
        global TrainResults
        global TestResults
        MyAlgorithm=algorithm
        print("algorithm, params=None, target_feature=0==",algorithm,params, target_feature,flush=True)
        ## For Supervised Learning (i.e, with Y)
        algorithm = list(algorithm)
        if target_feature != 0:
            if True:
                build_stat = False
                preprocessing_data(target_feature, algorithm[0])

            ch = CHOICES.copy()
            y_choices = ch.pop(ch.index(target_feature))
            x_choices = ch
            X = DataFrame.loc[:, x_choices].values

            if algorithm[0] == 'C':
                Y = DataFrame.loc[:, y_choices].values.ravel().astype(int)
            else:
                Y = DataFrame.loc[:, y_choices].values.ravel()

            data = split_data(X, y=Y, algorithm=algorithm)
            train_results, test_results = run(data, params, algorithm)
            if 'weights' in train_results.keys():
                train_results['weights']=train_results['weights'].tolist()
                train_results['biases']=train_results['biases'].tolist()
            compared_results = dict()
            if 'best_centroid' in train_results.keys():
                train_results['best_centroid']=train_results['best_centroid'].tolist()
                train_results['centroids']=train_results['centroids'].tolist()
            for key in test_results.keys():
                compared_results[key] = (train_results[key], test_results[key])
            ComparedResults=compared_results
            TrainResults = train_results
            TestResults = test_results
            return {'success':True,'msg':'Training completed successfully'}

        ## For Unsupervised Learning (i.e, without Y)
        else:
            if True:
                build_stat = False
                preprocessing_data()
            X = DataFrame.values
            data = split_data(X, algorithm=algorithm)
            train_results, test_results = run(data, params, algorithm)
            if 'weights' in train_results.keys():
                train_results['weights']=train_results['weights'].tolist()
                train_results['biases']=train_results['biases'].tolist()
            if 'best_centroid' in train_results.keys():
                train_results['best_centroid']=train_results['best_centroid'].tolist()
                train_results['centroids']=train_results['centroids'].tolist()
            compared_results = dict()
            for key in test_results.keys():
                compared_results[key] = (train_results[key], test_results[key])
            ComparedResults=compared_results
            TrainResults = train_results
            TestResults = test_results
            return {'success':True,'msg':'Traning completed successfully'}
    except Exception as e:
        print(f"An error occurred: {e}", flush=True)
        return {'success':False,'msg':str(e)} 


## helper function to get meta data from availaible dataset

@eel.expose
def getMetaData(Algo):
    global CHOICES
    global myDataFrame
    if Algo=='RL' or Algo=='RR' or Algo=="RP" or Algo=="CL" or Algo=='CS' or Algo=='CK':
        return {'datasetSize':len(myDataFrame),'totalSelectedFeatures':CHOICES}
    return 'algo not valid'
## helper function to display results at review and analysis page
@eel.expose

def getResults():
    return {'myAlgorithm':MyAlgorithm,'ComparedResults':ComparedResults,'TrainResults':TrainResults,'TestResults':TestResults}

@eel.expose

def write_parameters(parameters, fileName):
    global PATH
    PATH = PATH.replace('\\', '/')
    save_path = PATH.split('/')
    save_path[-1] = fileName+'.txt'
    save_path = '/'.join(save_path)

    with open(save_path, 'w') as f:
        # Write the parameters to the file
        f.write(str(parameters))
    params = {
        'file_name': fileName+'.txt',
        'file_path': save_path
    }
    return params

eel.init("web")

# app = eel.Bottle()

# eel.init('web', app=app, host='localhost', port=8080)
eel.start("index.html",size=(1000,700))
