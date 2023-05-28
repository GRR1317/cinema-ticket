# Cinema Ticket

### Run App

`
git clone https://github.com/agaraman0/cinema-ticket.git
`

`
npm install
`

`
docker-compose up --build
`

Above will spin up node and mongo db server

### APIs

#### Create Cinema

```curl
curl -X POST -H "Content-Type: application/json" -d '{"seats": 100}' http://localhost:8080/cinemas
```

Response return with cinema id

```
{"cinemaId":"6473391f831fcf3f00b65b6b"}
```

#### Book Seats

```curl
curl -X POST http://localhost:8080/cinemas/:cinemaId/seats/1
```

Response return with seat id and status
```
{"seat":"1","status":"Booked"}
```

#### Book first available consecutive seats

```curl
curl -X POST http://localhost:8080/cinemas/64733a45e9349133f66928c2/consecutive
```

Response seat number and status

```
{"seats":[2,3],"status":"Booked"}
```


## Improvements and Tries

+ I tried to acquire distributed lock but that did not work as expected
+ Api endpoints can be a bit refined
+ Api Responses can be more structured
