FROM nginx:alpine


WORKDIR /usr/share/nginx/html/

# Copia los archivos del frontend
COPY views views/

COPY css css/

COPY assets assets/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
