# -*- coding:utf-8 -*-
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from .views import index
from system_master import urls as system_urls
from system_users import urls as user_urls
# 認証情報API
from rest_framework_jwt.views import obtain_jwt_token
from rest_framework_jwt.views import refresh_jwt_token
# Swagger関係(API Lists)
from rest_framework_swagger.views import get_swagger_view

# swagger viewの定義
schema_view = get_swagger_view(title='API Lists')

# router リストの取得、登録
routeLists = [
    system_urls.routeList,
    user_urls.routeList,
]

router = routers.DefaultRouter()
for routeList in routeLists:
    for route in routeList:
        router.register(route[0], route[1])


urlpatterns = [
    path('', index, name='index'),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/system_master/', include(system_urls.router.urls)),
    path('api/system_user/', include(user_urls.router.urls)),
    # 認証関係
    path('api-token-auth/', obtain_jwt_token),
    path('api-token-refresh/', refresh_jwt_token),
    # swagger
    path('swagger/', schema_view),
]
