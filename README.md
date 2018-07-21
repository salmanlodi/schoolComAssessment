# SchoolCom ASSESSMENT

Assessment submission by salman lodi

## Getting Started

Cloning this repository will get you a copy of the project up and running on your local machine for development and testing purposes.

Below are some required information to understand project structure

Models directory contains all the entities and respective fields associated with them
Routes directory in the repository contains all the files with respect to models and endpoints


### Prerequisites

What things you need to install the software and how to install them

Download and install nodejs and npm from below official site
```
https://nodejs.org/en/
```


### Installing

A step by step series of examples that tell you how to get a development env running

follow the below process:

```
After cloning get into the project directory by command (cd ./schoolcomAssessment/)
```

And then

```
run 'npm install' once to install all the dependencies followed by 'npm start' which will run your application on port 3000 by default
```

## Running the tests

Please note:
```
In user Schema status field is (0 is for inactive user(disabled), 1 is for active user)  and role is (1 for admin, 0 is default for user) 
In registration api validations for email and dob is performed so provide the correct input format  
```

Below is the api document:

1. Create a user / Registration of user

```
url: http://localhost:3000/auth/register
method: post
required query parameters: none
required body parameters: name,email(unique),password,dob (yyyy-mm-dd format),role(1 for admin and 0/undefined for users)
```

2. Login

```
url: http://localhost:3000/auth/login
method: post
required query parameters: none
required body parameters: email , password
```

3. Get all users(all users except soft deleted users and current user with respect to jwt token)

```
url: http://localhost:3000/users/
method: get
required query parameters: none
required body parameters:  none
Headers : x-access-token(jwt token returned at admin role login) 
```

4. Soft delete of user with admin role jwt

```
url: http://localhost:3000/users/soft
method: delete
required query parameters: none
required body parameters: _id
Headers : x-access-token(jwt token returned at admin role login) 
```

4. Hard delete of user with admin role jwt

```
url: http://localhost:3000/users/hard
method: delete
required body parameters: _id
Headers : x-access-token(jwt token returned at admin role login) 
```

* **Api for checking balanced or unbalanced expression**

1. Get all consumers

```
url: http://localhost:3000/balanced
method: post
required query parameters: none
required body parameters: expression
Headers : x-access-token(jwt token returned successfull at login) 
```

## Deployment

The database is deployed on mlabs in testing environment.

This system is built for assessment purpose and will require additional work to deploy on live environment

## Authors

* **SALMAN LODI**  - (https://github.com/salmanlodi)
