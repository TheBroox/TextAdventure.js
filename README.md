# TextAdventure.js

TextAdventure.js is a text adventure engine that runs on [Node.js](http://nodejs.org/) and makes use of [Express](http://expressjs.com/). The project has four main components; a simple server, a retro command line inspired web interface known as the Terminal, the text adventure engine itself colloquially called the Console and finally the cartridges (games) which are made up of two Javascript objects. Each of these components is further explained in their respective section below.

## Server

The sever is an extremely simple Node.js file. It fires up an instance of an Express server on port 3000 to which it serves the Terminal to. All AJAX requests made to it are quickly passed to the Console to be executed. Responses are then dispatched back to the terminal. To get TextAdventure up and running on port 3000 simply run the following command from the project's folder:

```
node server.js
```

## Terminal

## Console

## Cartridges