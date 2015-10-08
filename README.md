Chalmers tentastatistik
=======================

Since Chalmers publish the statistics for exams in an humongous excel document, hidden in the dark depths of the [studentportalen](https://student.portal.chalmers.se/sv/chalmersstudier/minkursinformation/Sidor/min-kursinformation.aspx).
Have I coded an web app to easy show statistics of different chalmers courses.

How to hack on this?
--------------------
- start mongod
- create ```config/db.js```, export url to a mongod DB.   (TODO: add env.json)
- run ```node bin/www```, to download and parse excel files (TODO: fix gulpfile)
- quit node
- open server.js and comment downloadAndParse()
- run ```gulp```

TODO
-------

### Host on a web server
I will as soon as possible host this at my web server and link from an domain.

### Implement  Top-lists
For example Top 3 hardest courses (most fails) on Chalmers, Top 3 easiest...

### Implement public API
To easy get access to course statics some cool end-points needs to be implemented and some boring documentation needs to be written.

### Add db config to environment
To make installation easier, add a env.json containing db connection.

### Fix Gulp-file
Since nodeomon restarts on server side changes and the server starts with downloading the statistics and updates db, one have to make a fix for this

License
-------

Copyright 2015, Johan Bowald  <johan@bowald.se>

MIT
