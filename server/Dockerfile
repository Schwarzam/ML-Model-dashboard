FROM python:3.10.7-buster
ENV PYTHONUNBUFFERED 1
WORKDIR /server
COPY requirements.txt requirements.txt


RUN pip install --upgrade cython
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt --default-timeout=10000
COPY . .