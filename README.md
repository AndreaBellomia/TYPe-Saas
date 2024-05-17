TYPe-Saas 

This software is designed to streamline communication between users and administrators, improving efficiency in handling requests and tasks. Through an intuitive ticketing system, users can open tickets to report issues or make requests, while administrators can track progress, send update messages, and monitor ticket status.

This project was created by [Next.js](https://nextjs.org/) and [Django](https://www.djangoproject.com/)

## Requirements 

- `Docker`
- `poetry`
- `Python 3.10^`
- `NodeJS 21^`


## Prepare

1) Docker
```bash
docker compose -f docker/dev-compose.yml build
docker compose -f docker/dev-compose.yml up -d
```

2) Django
```bash
poetry install
poetry run ./api-server/manage.py migrate 
poetry run ./api-server/manage.py createsuperuser 
# insert info for create a super user
```
3) Next
```bash
npm install --prefix ./frontend-server
```

## Run project

### Using bash script
```bash
bash run.sh <django command>
```
### Using regular command
```bash
# terminal 1
poetry run ./api-server/manage.py runserver
# terminal 2
npm run dev --prefix ./frontend-server
```


## General info

Login system, 
- You can create any new user form admin page of django
- For login to django api with difference user or not admin user, use `http://localhost:8000/accounts/login/`
- api serve url -> `http://localhost:8000/` 
- frontend server url -> `http://localhost:3000/`
