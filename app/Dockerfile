FROM python:3.6

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV PYTHONDONTWRITEBYTECODE 1
ENV DOCKER true

RUN apt-get update
RUN apt-get install -y default-mysql-client
ADD ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install django-debug-toolbar

CMD /bin/bash