from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from manufacturing_data.filters import JobOrderFilter
from .serializer import *
# from core.multi_create import multi_create


class JobOrderAPIView(viewsets.ModelViewSet):
    permission_classes = (
        IsAuthenticated,
    )
    serializer_class = JobOrderSerializer
    queryset = JobOrder.objects.all()
    filter_class = JobOrderFilter

    # @multi_create(serializer_class=JobOrderSerializer)
    # def create(self, request):
    #     pass
