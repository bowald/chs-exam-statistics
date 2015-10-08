Chalmers tentastatistik
=======================

Since Chalmers publish the statistics for exams in an humongous excel document, hidden in the dark depths of the [studentportalen](https://student.portal.chalmers.se/sv/chalmersstudier/minkursinformation/Sidor/min-kursinformation.aspx).
Have I coded an web app to easy show statistics of different chalmers courses.

How to hack on this?
--------------------
- create env.json
- start mongod
- run ```npm install```
- run ```gulp``` (gulp serves a node server on PORT in env and a BrowserSync Proxy on port 4000)

Environment
----------
Create a ```env.json``` in project root and set the URI for mongo and a port of your choice.

```
{
  "MONGO_URI": "mongodb://localhost/XXXXXXXXXXX",
  "PORT":3000
}
```

TODO
-------

### Host on a web server
I will as soon as possible host this at my web server and link from an domain.

### Implement  Top-lists
For example Top 3 hardest courses (most fails) on Chalmers, Top 3 easiest...

### Implement public API
To easy get access to course statics some cool end-points needs to be implemented and some boring documentation needs to be written.

License
-------

Copyright 2015, Johan Bowald  <johan@bowald.se>

MIT
