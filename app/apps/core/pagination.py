from rest_framework import pagination
from rest_framework.response import Response
import math


class CustomPagination(pagination.PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 5000

    def get_paginated_response(self, data):
        pages = math.ceil(self.page.paginator.count / self.page_size)

        return Response({
            'count': self.page.paginator.count,
            'pages': pages,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })
