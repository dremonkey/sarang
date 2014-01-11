sarang
======

Website I built for my wedding

# Deployment
Currently this is designed to deploy to Heroku. To deploy for the first time:

- Create a _heroku directory and initialize a heroku app. 
- Create a .env file and add ```NODE_ENV=production``` to it or just run ```heroku config:set NODE_ENV=production```
- Create a Procfile with ```web: node server/server.js``` in it
- Create a package.json file. Make sure the necessary npm modules are here. The needed modules can be found in the package.json files found in the client and server directories. At some point in the future I would like to automatically create this file based off the modules already listed there. But for now it is manual process.
- Now run the deploy.sh script. It will take care of everything else.

## deploy.sh
This is a simple script to make the deployment of this site a little easier. Basically what it does is use Grunt to prepare the client and server files for deployment, then copy those files over to the _heroku directory. 

On the client side, Grunt is responsible for compiling the files (sass and angularjs templates) and minifying the javascript. This is done by running the ```grunt dist``` command. On the server side, Grunt doesn't really do anything to prepare the files for deployment. At some point in the future, I hope to add tests for both the client and server code in which case Grunt will be responsible for running those before deployment. 

Once the files have been compiled, Grunt copies the necessary files over to the _heroku directory and deploys them to heroku.