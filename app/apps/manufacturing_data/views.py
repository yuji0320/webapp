from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from manufacturing_data.filters import JobOrderFilter
from .serializer import *


class JobOrderAPIView(viewsets.ModelViewSet):
    permission_classes = (
        IsAuthenticated,
    )
    serializer_class = JobOrderSerializer
    queryset = JobOrder.objects.all()
    filter_class = JobOrderFilter
