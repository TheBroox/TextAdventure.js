# TextAdventure.js

TextAdventure.js is a text adventure engine that runs on [Node.js](http://nodejs.org/) and makes use of [Express](http://expressjs.com/). The project has four main components; a simple server, a retro command line inspired web interface known as the Terminal, the text adventure engine itself colloquially called the Console and finally the cartridges (games) which are made up of two JavaScript objects. Each of these components is further explained in their respective section below.

## Server

The sever is an extremely simple Node.js file. It fires up an instance of an Express server on port 3000 to which it serves the Terminal to. All AJAX requests made to it are quickly passed to the Console to be executed. Responses are then dispatched back to the terminal. To get TextAdventure up and running on port 3000 simply run the following command from the project's folder:

```
node server.js
```

## Terminal

The Terminal consists of a single HTML file, and single CSS file and two JavaScript files (one of which is jQuery in case you need to run TextAdventure.js without an Internet connection). The Terminal's main job is to send the user's input to the Server and then display the Server's response to the user. The terminal has a few other creature comforts build in. First, it sends a "dummy" AJAX call to the server when the page loads to get the list of cartridges without requiring the user to input anything. Secondly, it keeps a record of the users input that can be navigated via the UP and DOWN arrow keys. The terminal's CSS can easily be tweaked to your liking.

## Console

## Cartridges