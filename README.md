# Django Development With Docker Compose

Featuring:

- Docker v1.11.2
- Docker Compose v1.7.1
- Docker Machine v0.7.0
- Python 3.6

## OS X Instructions

1: install Docker for mac

2: Move to directory and build

```
$ cd webapp
$ ./docker-compose.sh dev up --build
```

3: execute migrations

```
$ docker exec -it <dev app container name or id> ./manage.py migrate
```

4: Load master data from django fixtures

If data doesn't import "manage.py migrate"

```
$ docker exec -it <dev app container name or id> ./manage.py loaddata initial_data.json
```

5: Access to localhost
