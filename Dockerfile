FROM nginx:alpine

WORKDIR /usr/share/nginx/html/

# Copiar los archivos del frontend necesarios
COPY views/ ./

COPY css/ css/
COPY assets/ assets/
COPY js/ js/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]