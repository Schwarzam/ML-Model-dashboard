from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer

from rest_framework.decorators import api_view, renderer_classes

# Create your views here.
@api_view(['GET', 'POST'])
@renderer_classes([JSONRenderer])
def get_info(request):
    return Response('salveee')