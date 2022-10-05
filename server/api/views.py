from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer

from rest_framework.decorators import api_view, renderer_classes

import joblib
import pandas as pd
import io 

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

    df.to_csv(f'api/models/{name}')
    return Response('File uploaded!', status=200)