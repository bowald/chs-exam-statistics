# Chalmers tentastatistik
Chalmers publish the statistics for exams in an humongous excel document, hidden in the dark depths of the [studentportalen](https://student.portal.chalmers.se/sv/chalmersstudier/minkursinformation/Sidor/min-kursinformation.aspx). So I thought there should be an webapp to see the statistics… and now it is. Feel free to contribute!

## Requirements

### NodeJS
NodeJS can be found [here](https://nodejs.org/en/)

### MongoDB
Instructions for downloading and running mongoDB can be found [here](https://docs.mongodb.com/manual/administration/install-community/)
Basicly download mongoDB and from a terminal run `mongod`, this will start a mongo daemon at port: 27017. To connect to your database run `mongo` and write ```use chs-exam-statistics```

## Setup
Start mongod,
From a terminal run:
- `npm install`
- `npm run build`
- `npm run start`
This will host a server at: `http://localhost:3000/`

Custom Environment
----------
When running a local version there is no need to set any environment variables.

| Variable       | Description                                          | Default                                                                          |
|----------------|------------------------------------------------------|----------------------------------------------------------------------------------|
| PORT           | Port that the webserver is hosted on                 | 3000                                                                             |
| MONGO_URI      | URI to your mongodb                                  | mongodb://localhost:27017/chs-exam-statistics                                    |
| STATISTICS_URL | URL to where statistic document is hosted            | https://document.chalmers.se/download?docid=00000000-0000-0000-0000-00001C968DC6 |
| FILENAME       | Name that will be given to local copy of excel file | statistik.xlsx                                                                   |


To set a variable, Instead of running `npm run start` run command below with variables of your choice.
```
PORT=1337 node server.js
```

TODO
-------

### Show newly added exam results
Create a view to show exam newly added exams.

### News
Add view with updates of the site.

### Upgrade Frontend Framework
AngularJS is old... Update to React or whatever framework the kids likes today.

License
-------
Copyright 2015, Johan Bowald  <johan@bowald.se>

MIT