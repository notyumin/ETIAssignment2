_This project was made for Assignment 2 of Ngee Ann Polytechnic's Emerging Trends in IT module._ 

# Class Exchange

- [Class Exchange](#class-exchange)
  - [Microservice Architecture Design](#microservice-architecture-design)
  - [Microservice Design Considerations](#microservice-design-considerations)
  - [Container Images](#container-images)
  - [Run Microservices](#run-microservices)

## Microservice Architecture Design

![Architecture Diagram](./architecture_diagram.png)

## Microservice Design Considerations
There are 3 main parts to the ClassExchange stack: Database, Backend, and Frontend. The Backend depends on the Database, and the Frontend depends on the Backend. 

The Database acts as a form of persistent storage to store the data needed by the Backend.

The Backend hosts an API with the 4 basic HTTP Methods: `GET`, `POST`, `PUT` and `DELETE`. This was done to make the backend as modular as possible. Even though there are currently no external dependants on the ClassExchange backend, the simplicity will allow for easier integration with other microservices in the future. 

The Frontend houses the GUI, as well as the client-side logic. To allow the Backend to stay simple, the Frontend has to house most of the complex logic, including Authentication with the Authentication Microservice and sending `GET` and `PUT` requests to the Class Microservice. One notable downside of this is security, because housing most of your logic on the client-side exposes that logic to possible attackers. This is something that can and should be improved in future designs. 

## Container Images
[Backend Image](https://hub.docker.com/repository/docker/tanyumin/etiassignment2_backend)

[Frontend Image](https://hub.docker.com/repository/docker/tanyumin/etiassignment2_frontend)

## Run Microservices
1. CD into the repository folder
```
cd ETAssignment2
```

2. Build and run docker images using docker-compose
```
docker-compose run --build
```

3. Access the front end at http://10.31.11.11:8140!
