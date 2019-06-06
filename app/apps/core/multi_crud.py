from rest_framework.response import Response
from rest_framework import status


# 一括登録
def multi_create(serializer_class=None):
    def __multi_create(func):
        def __wrapper(self, request, *args, **kwargs):
            many = False
            if isinstance(request.data, list):
                many = True
            serializer = serializer_class(data=request.data, many=many)
            if serializer.is_valid():
                serializer.save()
                headers = self.get_success_headers(serializer.data)
                data = serializer.data
                result = func(self, request, *args, **kwargs)
                if result is not None:
                    return result
                if many:
                    data = list(data)
                return Response(data,
                                status=status.HTTP_201_CREATED,
                                headers=headers)
            else:
                return Response(serializer.errors,
                                status=status.HTTP_400_BAD_REQUEST)
        return __wrapper
    return __multi_create


# 一括編集
def multi_update(serializer_class=None):
    def __multi_update(func):
        def __wrapper(self, request, *args, **kwargs):
            many = False
            if isinstance(request.data, list):
                many = True
            serializer = serializer_class(data=request.data, many=many)
            if serializer.is_valid():
                request_data_mapping = {data["id"]: data for data in request.data}
                data_mapping = {item['id']: item for item in serializer.validated_data}

                ret = []
                for data_id, data in data_mapping.items():
                    update_data = request_data_mapping.get(data_id, None)
                    if update_data is None:
                        ret.append(self.child.create(data))
                    else:
                        ret.append(self.queryset.filter(id=data["id"]).update_or_create(update_data))

                headers = self.get_success_headers(serializer.data)
                data = serializer.data
                result = func(self, request, *args, **kwargs)
                if result is not None:
                    return result
                if many:
                    data = list(data)
                return Response(data,
                                status=status.HTTP_200_OK,
                                headers=headers)
            else:
                return Response(serializer.errors,
                                status=status.HTTP_400_BAD_REQUEST)

        return __wrapper
    return __multi_update
