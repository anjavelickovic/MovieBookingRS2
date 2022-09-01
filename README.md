# Movie Tickets Booking

Movie Tickets Booking is a microservice application for reserving tickets for movies.

## Required software

<ul>
  <li><a style="display: inline" href="https://dotnet.microsoft.com/en-us/download/dotnet/5.0/"><img src="https://miro.medium.com/max/800/1*_C0iRh_fgu8rc0qhQNDCDw.png" height="24" width="48" ></a></li>
  <li><a style="display: inline" href="https://angular.io"><img src="https://angular.io/assets/images/logos/angular/shield-large.svg" height="48" width="48" ></a></li>
  <li><a style="display: inline" href="https://www.docker.com"><img src="https://avatars.githubusercontent.com/u/5429470?s=280&v=4" height="48" width="48" ></a></li>
</ul>



## Running the application

1. Create file `docker-compose.env` with the following format:

```
OMDB_API_KEY=your_omdb_api_key
IMDB_API_KEY=your_imdb_api_key
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_ROOT_PASSWORD=your_mysql_root_password
POSTGRES_USER=your_postgres_username
POSTGRES_PASSWORD=your_postgres_password
MSSQL_USER=your_mssql_username
MSSQL_PASSWORD=your_mssql_password
PGADMIN_MAIL=your_pgadmin_mail
PGADMIN_PASSWORD=your_pgadmin_password
```

Place it in the MovieBooking directory and insert your data.

2. Position terminal in MovieBooking directory and run next command:

``` 
docker-compose --env-file=./docker-compose.env -f docker-compose.yml -f docker-compose.override.yml up -d --build 
``` 
 
3. Position terminal in MovieBookingSPA directory and run next commands:
``` 
npm i
ng serve
``` 

## Microservices

### Identity

<p align="justify"> Identity microservice is responsible for providing user authentication and authorization.

Authentication verifies the identity of a user attempting to gain access to some resource. Users need to enter their username/email and password on login page to be successfully authenticated, and as a response they get access and refresh token. Access tokens are actually identifying user and are sent with each call to some resource and they are shorter-lived, while refresh tokens are used to request a new access token (when it expires) without forcing user authentication once again and they are longer-lived. Here, JSON Web Tokens (JWTs) are used.

Authorization verifies if previously already authenticated user is permitted to execute some action. For instance, here, normal users aren't allowed to create or delete movies, while administrators are.

There are two types of roles: normal users or <code>Customers</code>, and administrators or <code>Admins</code>.
 </p>

### Movie
Movie microservice is used for data management related to movies. Movies are created using IMDb identifier for particular movie (e. g. for <i>Harry Potter and the Sorcerer's Stone</i> identifier is tt0241527), which can be obtained by finding IMDb page for desired movie and copying last part of the url. This microservice relies on two APIs for fetching movie information: 
* <a href="https://imdb-api.com/">IMDb API</a> (for trailer)
* <a href="https://www.omdbapi.com//">OMDb API</a> (for everything else like movie title, poster, synopsis, genres etc)

For both APIs you'll need a key, which you can get by registering to said sites. Naturally, only administrators can add new movies.

Users can search movies by certain criteria (by title, year, runtime, rating, genres, etc).

### Theater Hall

Theater Hall microservice manages theater halls. Theater hall is described by
* name
* terms in which the projection of the movie can be held 
* number of seats

Administrators are the only ones who can create, update or delete them.

It is used by projection, reservations and administration microservice via id and name.

MongoDB is used for storing the data.

### Projection

Projection microservice manages movie projections. Movie projection is described by 
* details about movie,
* details about theater hall where the projection of the movie is held
* date and term in which the projection of the movie is held 
* number of reserved seats
* price 

Administrators are the only ones who can create, update or delete them. 

It communicates with reservations microservice via gRPC to update number of reserved seats when reservations are made or deleted.

MongoDB is used for storing the data.

### Discount

  Discount microservice stores coupons for movie ticket discounts. Only Administrators can create, update or delete coupons. 
  Using the gRPC Discount microservice sends this coupon information to Reservations microservice.
  
  The database used for this microservice is *PostgreSQL*.

  To create the database follow the instructions:
   1. Login to pgadmin at https://localhost:5050/
   2. Add a new Server with the following characteristics:
    - General:
      - Name: DiscountServer
    - Connection:
      - Host name/address: discountdb
      - Port: 5432 
      - Maintenance database: postgres 
      - Username: your_postgres_user 
      - Password: your_postgres_password
   3. Query tool
      ```
      CREATE TABLE Coupon (
        ID SERIAL PRIMARY KEY NOT NULL,
        MovieID VARCHAR(200),
        MovieName VARCHAR(200),
        Amount INTEGER, 
        CreationDate DATE,
        ModifiedDate DATE
       );
      ```
### Reservations

Reservations microservice manages customer reservation of tickets for movie projections. Movie reservation is described by 
* details about movie projection
* number of ticket that customer wants to reserve

Both, users and admins can add, update, delete and confirm reservations on their account.

It communicates with projection microservice (as mentioned in Projection) and with discount microservice via gRPC to update price of the resrvation based on discount amount.
Also, it communicates with administration microservice via RabbitMQ when customer confirms reservations (described in administration).

Redis cache is used for storing the data.


### Administration
 Administration microservice permanently saves previous reservation data.
 This service communicates with Reservations microservice when User officialy confirm that he has finished online ticket booking.

 Database that is used for this microservice is MSSQL.
 
 
## Authors

* [Nemanja Živanović](https://github.com/NemanjaZivanovic)
* [Anja Veličković](https://github.com/anjavelickovic)
* [Milica Simić](https://github.com/milicas19) 
