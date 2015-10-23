# BarCamp2015
This repository incude all the resources that used during the presentation on BarCamp Phnom Penh 2015.

Visit my live demo site. :)

https://Joden-Lay.github.io/barcamp2015

### Requirements
- Node.js version >= 4.1.0
- Node.js [http-server](https://github.com/indexzero/http-server "http-server") module

### Start Server

Assume you have Node.js installed on your computer

1. In listed files below, replace the url with your server url (by default localhost:3000)
 - server/public/j.html
 - server/public/js/custom.js
 - server/public/chat/js/chat.js
```js    
// replace with your server url
var server_url = "http://localhost:3000/";
```

2. Open Terminal(unix) or cmd(windows) 
then goto $project_folder/server and type command below to install all dependencies
```sh
npm install
```

3. Now start your node server
```sh
node server/server.js
```

Goto http://localhost:3000 or your configurad server and enjoy testing :)

Goto http://your_server/j.html for access joystick (make your joy is open before goto the game)

### Reference Resources
- [Node.js](https://nodejs.org/en/ "Node.js")
- [express](http://expressjs.com/ "Express")
- [socket.io](http://socket.io/ "socket.io")
- [phaser.io](http://phaser.io/)
- [Virtual JoyStick](http://phaser.io/)


### LICENSE  
(The MIT License)
Copyright (c) 2015 Joden Lay <<joden.lay@gmail.com>>
