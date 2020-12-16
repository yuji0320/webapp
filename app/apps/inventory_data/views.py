from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .filters import *
from .serializer import *


class InventoryMasterAPIView(viewsets.ModelViewSet):
    permission_classes = (
        IsAuthenticated,
    )
    serializer_class = InventoryMasterSerializer
    queryset = (
        InventoryMaster.objects.select_related(
            'company', 'manufacturer', 'unit', 'created_by', 'modified_by'
        )
    )
    filter_class = InventoryMasterFilter
