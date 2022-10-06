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

# Create your views here.
@api_view(['GET', 'POST'])
@renderer_classes([JSONRenderer])
def upload(request):
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
    onlyfiles = [f for f in listdir('api/files/') if isfile(join('api/files/', f))]
    onlyfiles = sorted(onlyfiles)
    return Response(onlyfiles, status=200)


@api_view(['GET', 'POST'])
@renderer_classes([JSONRenderer])
def delete_df(request):
    os.remove(join('api/files/', request.data['file']))
    return Response('Removed!', status=200)

@api_view(['GET', 'POST'])
@renderer_classes([JSONRenderer])
def visualize_df(request):
    df = pd.read_csv(join('api/files/', request.data['file']))
    df = df.loc[:,~df.columns.str.startswith('Unname')]
    df = df.to_dict('records')
    return Response(df, status=200)

@api_view(['GET', 'POST'])
@renderer_classes([JSONRenderer])
def predict(request):
    df = pd.read_csv(join('api/files/', request.data['file']))
    
    model = joblib.load('api/models/model')
    
    df = encoder.encode_DataFrame(df)
    df = process_dataset.processColumns(df)

    train_cols, target = process_dataset.generate_labels(df)
    X = process_dataset.scaleData(df[train_cols], useSaved=False)
    preds = model.predict(X)
    return Response(preds, status=200)


@api_view(['GET', 'POST'])
@renderer_classes([JSONRenderer])
def predict(request):
    df_original = pd.read_csv(join('api/files/', request.data['file']))
    
    try:
        df = encoder.encode_DataFrame(df_original)
        df = process_dataset.processColumns(df)
        train_cols, target = process_dataset.generate_labels(df)
        X = process_dataset.scaleData(df[train_cols], useSaved=False)
    except:
        return Response('Could not process dataset, check if columns are correct', status = 500)

    model = joblib.load('api/models/model')
    preds = model.predict(X)

    res = pd.DataFrame()
    res['id_fechou_probs'] = preds
    res['id_fechou'] = models.convertPredicted(preds)
    res.to_csv(join('api/files/', request.data['file'].replace('.csv', '') + '_predicted.csv'))

    return Response(preds, status=200)

# @api_view(['GET', 'POST'])
# @renderer_classes([JSONRenderer])
# def visualize_df(request):
#     df = pd.read_csv(join('api/models/', request.data['file']))
#     df = df.loc[:,~df.columns.str.startswith('Unname')]
#     df = df.to_dict('records')
#     return Response(df, status=200)