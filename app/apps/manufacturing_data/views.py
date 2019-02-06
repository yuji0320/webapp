from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .serializer import *


class JobOrderAPIView(viewsets.ModelViewSet):
    permission_classes = (
        IsAuthenticated,
    )
    serializer_class = JobOrderSerializer
    queryset = JobOrder.objects.all()
