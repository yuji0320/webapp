from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
# from rest_framework.response import Response
# from rest_framework.decorators import action
# from .models import *
from .serializer import *


class UserCopmanyAPIView(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)
    serializer_class = UserCopmanySerializer
    queryset = UserCopmany.objects.all()


class UserStaffAPIView(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)
    serializer_class = UserStaffSerializer
    queryset = UserStaff.objects.all()

# class UserAPIView(viewsets.ModelViewSet):
#     permission_classes = (IsAuthenticated,)
#     serializer_class = UserSerializer
#     queryset = User.objects.all()
#
#     @action(methods=['get'], detail=False)
#     # ユーザー名の確認用Function
#     def username(self, request):
#         return Response(data={'username': request.user.username})
