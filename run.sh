start_django() {
    echo "Starting Django server..."
    cd ./api-server
    poetry run ./manage.py "$@"
}

start_nextjs() {
    echo "Starting Next.js server..."
    npm run dev --prefix ./frontend-server
}

stop_processes() {
    echo "Stopping Django and Next.js servers..."
    pkill -f "python manage.py runserver"
    pkill -f "npm run dev"
}

trap stop_processes EXIT


if [ "$1" = "runserver" ]; then
    start_django "${@:1}" &
    start_nextjs 2>&1 | sed 's/^/[Next  ] /'
else
    start_django "$@" &
fi


wait