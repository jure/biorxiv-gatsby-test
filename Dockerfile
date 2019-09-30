FROM blekhmanlab/rxivist_data

ADD init.sql /docker-entrypoint-initdb.d/z-custom-init.sql
