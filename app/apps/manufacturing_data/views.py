from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from manufacturing_data.filters import JobOrderFilter, BillOfMaterialFilter, MakingOrderFilter
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


class BillOfMaterialAPIView(viewsets.ModelViewSet):
    permission_classes = (
        IsAuthenticated,
    )
    serializer_class = BillOfMaterialSerializer
    queryset = BillOfMaterial.objects.all()
    filter_class = BillOfMaterialFilter


class MakingOrderAPIView(viewsets.ModelViewSet):
    permission_classes = (
        IsAuthenticated,
    )
    serializer_class = MakingOrderSerializer
    queryset = MakingOrder.objects.all()
    filter_class = MakingOrderFilter
