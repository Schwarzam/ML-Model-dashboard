# server

This is the backend of the project, written using Django framework.

Install the dependencies and devDependencies and start the server.
```sh
pip3 install -r requirements.txt
```

```sh
python3 manage.py runserver 0:8000
```
#### server will be listening on port 8000


Basically all functions are inside *api/views.py*.
All routes definitions are inside *server/urls.py*

The *package* folder contains procedures created to process the tables and predictions.
