## Description

This is simple demo to use GraphQL with nodejs - express

## Installation

Install the dependencies using:

``` 
npm install
```

To start the GraphQL server, run it using `node server.js` or `nodemon server.js` in the root directory of your application.


to run the API
```
http://localhost:3000/api
``` 

Query to test the statistic api : 
```
{
  getItemStatistic(item_id: 481500000004420) {
    total_sold
    total_sold_today
    total_sold_per_week
    total_sold_per_month
    frequently_brought_with
    avg_sold_per_week
    avg_sold_per_month
  }
}

```

