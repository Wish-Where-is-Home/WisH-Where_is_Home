FROM python:3

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y \
    gdal-bin \
    libgdal-dev

ENV GDAL_LIBRARY_PATH=/usr/lib/libgdal.so

WORKDIR .

COPY . .
RUN pip install -r requirements.txt

CMD bash -c "sleep 5 && python manage.py runserver 0.0.0.0:8000"


