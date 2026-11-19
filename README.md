# Reboot Tech - Frontend

Aplicación web para la gestión y seguimiento de servicios técnicos de reparación de equipos informáticos. Permite al personal de Reboot Tech administrar clientes, trabajadores y reparaciones, mientras que los clientes pueden consultar el estado de sus equipos mediante un código de atención.

## Funcionalidades principales

- **Consulta pública:** permite consultar el estado de una reparación mediante el código de atención, sin necesidad de iniciar sesión.
- **Autenticación:** permite el acceso de los trabajadores mediante usuario y contraseña.
- **Administración:** permite gestionar las cuentas de los trabajadores y consultar estadísticas de los servicios.
- **Recepción:** permite buscar y registrar clientes, registrar solicitudes de reparación, consultar pedidos y gestionar las confirmaciones de repuestos.
- **Técnicos:** permite visualizar solicitudes disponibles, asignarse reparaciones, registrar diagnósticos, solicitar repuestos y documentar las soluciones realizadas.

## Tecnologías y bibliotecas utilizadas

| Tecnología o biblioteca | Uso en el proyecto |
|---|---|
| **Angular 22** | Framework principal utilizado para desarrollar la aplicación web y organizar sus componentes y páginas. |
| **TypeScript** | Lenguaje utilizado para implementar la lógica de la aplicación. |
| **Bootstrap 5** | Biblioteca CSS utilizada para diseñar las interfaces y adaptar sus elementos a diferentes tamaños de pantalla. |
| **Bootstrap Icons** | Biblioteca de iconos utilizada en los diferentes componentes de la aplicación. |
| **RxJS** | Biblioteca que proporciona los Observables utilizados para gestionar operaciones asíncronas, como las solicitudes HTTP al backend y el procesamiento de sus respuestas. |

## Requisitos previos

Para ejecutar el proyecto se necesita:

- Node.js compatible con Angular 22.
- npm.
- Git.
- El backend de Reboot Tech en funcionamiento.

## Instalación y ejecución

**1. Clonar el repositorio**

```bash
git clone https://github.com/FabrizioFernandez2008/RebootTech.git
```

**2. Ingresar a la carpeta del proyecto**

```bash
cd RebootTech
```

**3. Instalar las dependencias**

```bash
npm install
```

**4. Iniciar la aplicación**

```bash
npm start
```

**5. Abrir la aplicación**

Ingresar desde el navegador a:

http://localhost:4200

## Conexión con el backend

El frontend se comunica con el backend mediante una API REST.

Para utilizar todas las funcionalidades, el backend debe estar ejecutándose previamente en:

http://localhost:8081

La dirección base de la API es:

http://localhost:8081/api

El backend se encuentra en el repositorio [RebootTech-API](https://github.com/FabrizioFernandez2008/RebootTech-API).
