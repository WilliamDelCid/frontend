
# Prueba Tecnica

Este readme es creado con la finalizada de poder instalar y probar la
prueba tecnica enviada.

Ruta de FrontEnd Angular 17+: 
 - [GitHub FrontEnd](https://github.com/WilliamDelCid/frontend)

Ruta de BackEnd Spring Boot 3+: 
 - [GitHub BackEnd](https://github.com/WilliamDelCid/backend)

Pasos para instalar el backend.
1. Descargar el proyecto desde el repositorio.
2. Cambiar las credenciales en el archivo src/main/resources/application.properties y colocar las credenciales para conectarse a su gestor de base de datos MySQL.
3. Crear la base de datos en su gestor de base de datos para que JPA pueda encontrarla, las tablas se crearan de forma automatica.
4. En el proyecto se encuentra un archivo data.sql este insertara de manera
automatica datos para que se pueda llevar a cabo las pruebas
5. Ejecutar con Run el archivo BackendApplication

    Nota: Si se ejecutara por segunda vez el backend cambiar del archivo 
    application.properties el valor en spring.sql.init.mode a never ya que 
    intentara ingresar la data por segunda vez.

Pasos para instalar el frontend.
1. Descargar el proyecto desde el repositorio.
2. Dentro del proyecto en la terminal asegurandose que esta en el proyecto ejecutar el comando npm install para descargar los paquetes y luego con el backend levantado ejecutar el comando ng serve -o e ir a la ruta generada 
http://localhost:4200/
