FROM nikolaik/python-nodejs:python3.11-nodejs18
EXPOSE 5000

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1


WORKDIR /dream
COPY . .

# build frontend
#WORKDIR /dream/frontend
#RUN npm ci
#RUN npm run build

# backend
WORKDIR /dream/backend

# Install pip requirements
RUN python -m pip install -r requirements.txt


# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-python-configure-containers
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /dream/backend
RUN chown -R appuser /dream

# back to root
WORKDIR /dream/logs
RUN chown -R appuser /dream

USER appuser
RUN touch access.log && chmod 777 access.log
RUN touch error.log && chmod 777 error.log

WORKDIR /dream
# During debugging, this entry point will be overridden. For more information, please refer to https://aka.ms/vscode-docker-python-debug
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--access-logfile", "logs/access.log", "--error-logfile" , "logs/error.log" ,"backend.main:app"]
