# from requests import Response
from rest_framework import viewsets
# from rest_framework.permissions import IsAuthenticated
from core.multi_crud import multi_create
from .serializer import *
from .filters import *
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

CACHE_TTL = 60 * 60 * 24

class SystemCountryAPIView(viewsets.ModelViewSet):
    # permission_classes = IsAuthenticated
    queryset = SystemCountry.objects.all()
    serializer_class = SystemCountrySerializer
    filter_class = SystemCountryFilter

    @method_decorator(cache_page(CACHE_TTL))    
    def dispatch(self, *args, **kwargs):
        return super(SystemCountryAPIView, self).dispatch(*args, **kwargs)

    @multi_create(serializer_class=SystemCountrySerializer)
    def create(self, request, **kwargs):
        pass

    # @multi_update(serializer_class=SystemCountrySerializer)
    # def put(self, request, pk=None, *args, **kwargs):
    #     pass


class SystemCurrencyAPIView(viewsets.ModelViewSet):
    # permission_classes = IsAuthenticated

    @method_decorator(cache_page(CACHE_TTL))    
    def dispatch(self, *args, **kwargs):
        return super(SystemCurrencyAPIView, self).dispatch(*args, **kwargs)

    serializer_class = SystemCurrencySerializer
    queryset = SystemCurrency.objects.all()


class SystemUnitTypeAPIView(viewsets.ModelViewSet):
    # permission_classes = IsAuthenticated
    serializer_class = SystemUnitTypeSerializer
    queryset = SystemUnitType.objects.all()
    filter_class = SystemUnitTypeFilter

    @method_decorator(cache_page(CACHE_TTL))    
    def dispatch(self, *args, **kwargs):
        return super(SystemUnitTypeAPIView, self).dispatch(*args, **kwargs)


class SystemExpenseCategoryAPIView(viewsets.ModelViewSet):
    serializer_class = SystemExpenseCategorySerializer
    queryset = SystemExpenseCategory.objects.all()
    filter_class = SystemExpenseCategoryFilter

    @method_decorator(cache_page(CACHE_TTL))    
    def dispatch(self, *args, **kwargs):
        return super(SystemExpenseCategoryAPIView, self).dispatch(*args, **kwargs)


class SystemFailureCategoryAPIView(viewsets.ModelViewSet):
    serializer_class = SystemFailureCategorySerializer
    queryset = SystemFailureCategory.objects.all()
    filter_class = SystemFailureCategoryFilter

    @method_decorator(cache_page(CACHE_TTL))    
    def dispatch(self, *args, **kwargs):
        return super(SystemFailureCategoryAPIView, self).dispatch(*args, **kwargs)


class SystemJobTypeAPIView(viewsets.ModelViewSet):
    serializer_class = SystemJobTypeSerializer
    queryset = SystemJobType.objects.all()
    filter_class = SystemJobTypeFilter

    @method_decorator(cache_page(CACHE_TTL))    
    def dispatch(self, *args, **kwargs):
        return super(SystemJobTypeAPIView, self).dispatch(*args, **kwargs)

    @multi_create(serializer_class=SystemJobTypeSerializer)
    def create(self, request, **kwargs):
        pass
