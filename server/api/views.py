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
    df.to_csv(f'api/models/{name}', index=False)
    return Response('File uploaded!', status=200)


@api_view(['GET', 'POST'])
@renderer_classes([JSONRenderer])
def get_files_available(request):
    onlyfiles = [f for f in listdir('api/models/') if isfile(join('api/models/', f))]
    return Response(onlyfiles, status=200)


@api_view(['GET', 'POST'])
@renderer_classes([JSONRenderer])
def visualize_df(request):
    df = pd.read_csv(join('api/models/', request.data['file']))
    df = df.loc[:,~df.columns.str.startswith('Unname')]
    df = df.to_dict('records')
    return Response(df, status=200)

# @api_view(['GET', 'POST'])
# @renderer_classes([JSONRenderer])
# def visualize_df(request):
#     df = pd.read_csv(join('api/models/', request.data['file']))
#     df = df.loc[:,~df.columns.str.startswith('Unname')]
#     df = df.to_dict('records')
#     return Response(df, status=200)