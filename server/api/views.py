from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer

from rest_framework.decorators import api_view, renderer_classes

import joblib
import pandas as pd
import io 

import os
from os import listdir
from os.path import isfile, join

from package import models, encoder, process_dataset

from sklearn.metrics import accuracy_score, classification_report
from sklearn.metrics import mean_squared_error, roc_auc_score, roc_curve
from sklearn.metrics import confusion_matrix
from sklearn.metrics import f1_score



# Create your views here.
@api_view(['GET', 'POST'])
@renderer_classes([JSONRenderer])
def upload(request):
    """Handle table upload. Save tables at api/files
    """    
    try:
        file = request.data['file']
    except:
        return Response('No file found in request.', status=500)
    try:
        name = str(file)
        file = file.read().decode(request.data['encoding'])
        df = pd.read_csv(io.StringIO(file))
    except:
        return Response(f'Failed to open file with decode {request.data["encoding"]}', status=500)
    df = df.loc[:,~df.columns.str.startswith('Unname')]
    df.to_csv(f'api/files/{name}', index=False)
    return Response('File uploaded!', status=200)


@api_view(['GET', 'POST'])
@renderer_classes([JSONRenderer])
def get_files_available(request):
    """Return files uploaded, they're all files inside api/files
    """  
    onlyfiles = [f for f in listdir('api/files/') if isfile(join('api/files/', f))]
    onlyfiles = sorted(onlyfiles)
    return Response(onlyfiles, status=200)


@api_view(['GET', 'POST'])
@renderer_classes([JSONRenderer])
def delete_df(request):
    """Delete table from api/files
    """
    os.remove(join('api/files/', request.data['file']))
    return Response('Removed!', status=200)

@api_view(['GET', 'POST'])
@renderer_classes([JSONRenderer])
def visualize_df(request):
    """Return records of selected table in JSON format.
    """
    df = pd.read_csv(join('api/files/', request.data['file']))
    df = df.loc[:,~df.columns.str.startswith('Unname')]
    df = df.to_dict('records')
    return Response(df, status=200)

@api_view(['GET', 'POST'])
@renderer_classes([JSONRenderer])
def predict(request):
    """This function use model inside api/models folder to predict selected table
    """
    df_original = pd.read_csv(join('api/files/', request.data['file']))
    
    try:
        df = encoder.encode_DataFrame(df_original)
        df = process_dataset.processColumns(df)
        train_cols, target = process_dataset.generate_labels(df)
        X = process_dataset.scaleData(df[train_cols], useSaved=False)
    except Exception as e:
        print(e)
        return Response('Could not process dataset, check if columns are correct', status = 500)

    model = joblib.load('api/models/model')
    preds = model.predict(X)

    res = pd.DataFrame()
    res['id_fechou_probs'] = preds
    res['id_fechou'] = models.convertPredicted(preds)
    res.to_csv(join('api/files/', request.data['file'].replace('.csv', '') + '_predicted.csv'))

    return Response(preds, status=200)


@api_view(['GET', 'POST'])
@renderer_classes([JSONRenderer])
def compare_to(request):
    """Function used to create metrics of model by comparin predictions table with true value table.
    """
    df_pred = pd.read_csv(join('api/files/', request.data['file_pred']))
    df_true = pd.read_csv(join('api/files/', request.data['file_true']))

    if 'id_fechou' not in df_true.columns:
        return Response('Table selected does not contain id_fechou', status=500)
    
    if len(df_pred) != len(df_true):
        return Response('Tables selected does not have the same lenght', status=500)

    res = {}
    res['acc'] = accuracy_score(df_pred['id_fechou'], df_true['id_fechou'])
    res['classf'] = classification_report(df_pred['id_fechou'], df_true['id_fechou'])

    res['mse'] = mean_squared_error(df_pred['id_fechou'], df_true['id_fechou'])
    res['auc'] = roc_auc_score(df_pred['id_fechou'], df_true['id_fechou'])
    res['roc'] = roc_curve(df_pred['id_fechou'], df_true['id_fechou'])

    tn, fp, fn, tp = confusion_matrix(df_pred['id_fechou'], df_true['id_fechou']).ravel()

    res['fpr'] = fp / (fp + tn) # false positive rate
    res['fnr'] = fn / (tp + fn) # false negative rate
    res['tnr'] = tn / (tn + fp) #true negative rate
    res['tpr'] = tp / (tp + fn) #true negative rate

    res['f1'] = f1_score(df_pred['id_fechou'], df_true['id_fechou'])

    res['pred_table'] = request.data['file_pred']
    res['true_table'] = request.data['file_true']
    return Response(res, status=200)
