Collabit
========
[![Stories in Ready](https://badge.waffle.io/ehaughee/collabit.png)](http://waffle.io/ehaughee/collabit)

Collaborative programming page using Share.JS, the ACE editor, and Node.JS.

Demo: http://collabit.herokuapp.com

![collabit connecting screenshot](http://f.cl.ly/items/280C3U2O0b3X2h1T172v/Screen%20Shot%202013-10-16%20at%208.41.23%20PM.png)
![collabit connected screenshot](http://f.cl.ly/items/003l0S0H2e3h1r123u3K/Screen%20Shot%202013-10-16%20at%208.42.18%20PM.png)

### *nix Install (draft)

1. `brew/apt-get install node npm`
3. `git clone https://github.com/ehaughee/collabit.git`
4. `cd collabit`
5. `npm install`
6. `bower install`
7. `node app.js`
8. Navigate to http://localhost:4000

### Windows Install (draft) -- This is not up to date

1. Install Node: http://nodejs.org/download/
2. Install NPM: https://npmjs.org/doc/README.html#Fancy-Windows-Install
3. Install MinGW: http://sourceforge.net/projects/mingw/files/
4. From MinGW, install the msys and mingw32-base packages
5. Add `C:\MingGW\msys\1.0\bin` and `C:\MingGW\bin` to your PATH
6. Install msysgit: https://code.google.com/p/msysgit/downloads/list?q=full+installer+official+git
   Make sure to select the following option during msysgit install (everything else can be defaults): 
   ![msysgit install instructions](http://f.cl.ly/items/2V2O3i1p3R2F1r2v0a12/mysgit.png)
7. `git clone https://github.com/ehaughee/collabit.git`
8. `cd collabit`
9. `npm install`
10. `bower install`
11. `cd collabit\public\bower_components\ace`
12. `npm install`
13. `node .\Makefile.dryice.js`
14. `node app.js`
15. `cd collabit\public\bower_components\socket.io-client\`
16. `npm install`
15. Navigate to http://localhost:4000
