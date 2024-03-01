# SwapSeats- A Ticket-sharing Application

A ticket sharing application using microservice architecture. A user can sign-up to buy and sell tickets.
The ticket is 'Locked' while buying for a certain duration of time and is 'unlocked' or released again if the payment fails to proceed.


## Architecture
This application consists of several services which are deployed over a kubernetes cluster. They use clusterIP services for communication between each other.
Ingress Nginx load balancer is used to expose the app to the outside environment over a secure channel.


## Development
The app is developed using skaffold which runs all the services in a watchfull manner. On every change, a docker image is created and pushed to dockerHub, deployed locally and the pod is restarted. 


## Services
|Service||
|--|--|
|NATS Streaming Server|"event bus"
|auth|sign-up/in/out|
|tickets|Ticket creation/editing|
|orders|Order creation/editing|
|expiration|Watch for order to be created. Cancel them after 15 minutes|
|payments|Handles credit card payments. Cancels orders if payment fails, completes if payment succeeds.
|Common|A shared npm package that provides interfaces for events.

*Auth* service
|Route|Method|Body|Purpose|
|:--------:|:--------:|:--------:|:--------:|
|api/users/signup|POST|{email: string, password: string}|Signup for an account|
|api/users/signin|POST|{email: string, password: string}|Signin to an existing account|
|api/users/signout|POST|{}|Signout of an account|
|api/users/currentuser|GET|-|Return info about the user|


## Dedication

* I would like to express my deepest gratitude to Stephen Grider, the creator of the Microservices with Node JS and React course on Udemy.
* It is thanks to Stephen's exceptional expertise and guidance that this project came to fruition.
* This project is a testament to my growth as a Software Engineer and the invaluable lessons I have learned on this incredible learning journey.
* I hope it serves as a tribute to Stephen Grider's incredible mentorship.
