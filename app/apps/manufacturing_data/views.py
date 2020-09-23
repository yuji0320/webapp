from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from manufacturing_data.filters import *
from .serializer import *
from core.multi_crud import multi_create


class JobOrderAPIView(viewsets.ModelViewSet):
    permission_classes = (
        IsAuthenticated,
    )
    serializer_class = JobOrderSerializer
    queryset = (
        JobOrder.objects
        .select_related(
            'company', 'publisher', 'designer', 'customer', 'delivery_destination', 'order_currency', 
            # 'created_by', 'modified_by',
        )
    )
    filter_class = JobOrderFilter

    # @multi_create(serializer_class=JobOrderSerializer)
    # def create(self, request):
    #     pass


class DirectCostBudgetAPIView(viewsets.ModelViewSet):
    permission_classes = (
        IsAuthenticated,
    )
    serializer_class = DirectCostBudgetSerializer
    queryset = DirectCostBudget.objects.all()


class BillOfMaterialAPIView(viewsets.ModelViewSet):
    permission_classes = (
        IsAuthenticated,
    )
    serializer_class = BillOfMaterialSerializer
    queryset = (
        BillOfMaterial.objects.select_related(
            'company', 'job_order', 'type', 'manufacturer', 'unit', 'currency', 'failure',
            # 'created_by', 'modified_by'
        )
    )
    filter_class = BillOfMaterialFilter

    @multi_create(serializer_class=BillOfMaterialSerializer)
    def create(self, request, **kwargs):
        pass


class MakingOrderAPIView(viewsets.ModelViewSet):
    permission_classes = (
        IsAuthenticated,
    )
    serializer_class = MakingOrderSerializer
    queryset = (
        MakingOrder.objects.select_related(
            'company', 'bill_of_material', 'manufacturer', 'unit', 'currency', 'supplier',
            'bill_of_material__job_order', 
            'bill_of_material__type',
        )
    )
    filter_class = MakingOrderFilter

    # @multi_create(serializer_class=MakingOrderSerializer)
    # def create(self, request, **kwargs):
    #     pass


class ReceivingProcessAPIView(viewsets.ModelViewSet):
    permission_classes = (
        IsAuthenticated,
    )
    serializer_class = ReceivingProcessSerializer
    queryset = (
        ReceivingProcess.objects.select_related(
            'order', 'unit', 'currency', 'created_by', 'modified_by', 
            'order__currency', 'order__supplier', 'order__manufacturer', 'order__unit', 
            'order__bill_of_material', 'order__bill_of_material__job_order', 'order__bill_of_material__manufacturer',
            'order__bill_of_material__currency', 'order__bill_of_material__type', 
        )
    )
    # queryset = (ReceivingProcess.objects.select_related('order',))
    filter_class = ReceivingProcessFilter


class ManHourAPIView(viewsets.ModelViewSet):
    permission_classes = (
        IsAuthenticated,
    )
    serializer_class = ManHourSerializer
    queryset = (
        ManHour.objects.select_related(
            'staff', 'type', 'failure', 'created_by', 'modified_by', 'job_order', 'staff__company', 
            'staff__user', 'staff__company'
        )
    )
    filter_class = ManHourFilter


# class PartsSearchAPIView(viewsets.ModelViewSet):
#     permission_classes = (
#         IsAuthenticated,
#     )
#     serializer_class = PartsSearchSerializer
#     queryset = BillOfMaterial.objects.all()
#     filter_class = PartsSearchFilter
