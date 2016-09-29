# ALEXA HOME AUTOMATION
Alexa HA provides tight integration between [Amazon Echo] and your Home Automation. This free and open source Skill for has been developed using the [Alexa Skills Kit].  Amazon Echo combined with the Alexa-HA Skill and a supported Home Automation solution delivers voice control and verbal feedback for practically anything in your home and beyond! The key feature highlights include: 

- Switch any controllable device - appliances/lights/fans/locks/shutters/etc
- Set light colors individually; by room or group
- Control light dimmer levels individually; by room or group
- Set thermostat(s) target temperature
- Get device states (i.e. temperature/humidity/luminance/power consumption, etc)
- Set scenes/modes (i.e. home/lighting/security/etc)
- Get scene modes (i.e. 'check current house mode', could be home/away/relax/gaming/party/sleep, etc)
- Trigger custom server side rules and return a response which is spoken by the Echo (i.e. say 'watch a movie' automatically sets up your Home Theater by powering on the Projector/AV Receiver/HTPC, lowering the Projector Screen, dimming the lights, etc.)
- Research virtually anything via voice through [Wolfram Alpha] API
- Display useful 'cards' in the Alexa App
- Automatically generates the Skill '[utterances]' based on configured devices/rooms, which trains Echo voice model for boosted accuracy
- Crude support for Text-To-Speech 'announcements' by pairing the Echo with your HA server over Bluetooth

The current version is focused on perfecting support for [OpenHAB]; other HA solutions may be added in the future.  OpenHAB v1.x is currently well tested and supported, OpenHAB v2.x support is coming in due time.

### TECHNOLOGY STACK
Alexa HA's technology stack is primarily comprised of the following key open source projects:

* [node.js] - evented I/O for the backend
* [alexa-app] - A Node.js module to simplify creation of Alexa (Amazon Echo) apps (Skills) using Node.js
* [request] - A Node.js module for making HTTP(S) requests

Your HA Controller does the heavy lifting of integrating with various downstream technologies/protocols, and Amazon Echo combined with the Alexa HA Skill translates your voice commands into HA actions.

### INSTALLATION & DEPLOYMENT
Alexa HA uses the Alexa Skills Kit to communicate with your internal HA server.  The Skill can be deployed in numerous ways, including:

* Semi-direct (i.e. Echo -> AWS ASK -> NodeJS/Express -> HA)
* Proxied through a webserver (i.e. Echo -> AWS ASK -> Apache/Nginx -> NodeJS -> HA)
* In-cloud via [AWS Lambda] micro services (i.e. Echo -> AWS ASK -> AWS Lambda -> HA)
 
To get started ASAP, see [INSTALL-QUICKSTART.md] to for setting up the Semi-direct approach.  We generally prefer the second option of self-hosting a webserver and NodeJS application on the same network as your HA server/appliance, which proxies most of the communication internally behind a web server for improved security and control.  In all cases external SSL encryption is required through proper trusted CA's or self signed certificates. Between the SSL transport encryption, custom application checks that confirm the requestors AWS ASK applicationId and userId match the configuration, as well as tracking all requestIds for audit trails, strong security is enforced.  This ensures you and only your Echo(s) can issue commands to your HA controller. 

Note that due to the Amazon Echo/Alexa architecture it is NOT possible to keep everything on your local network - the voice processing must be conducted in the cloud, and you are currently required to setup port forwarding on your firewall to allow AWS access to an internally hosted application.  The AWS ASK service then issues commands to your HA controller through your public facing endpoint.

Currently you cannot simply install Alexa HA through the Alexa App's Skills page, rather its currently required to setup your own Skill through the [Amazon Developer Portal].  We are publishing this as an official Alexa App in due time.  In some ways self-hosting is advantageous as you can better customize the skill to your homes layout, desired scenes and controllable devices.  You can also personalize the skill 'Invocation Name'.  To get started with configuring your own Alexa HA skill, see:
 * [Getting started with Alexa Skills Kit]
 * [INSTALL-QUICKSTART.md]
 * [INSTALL.md]

### VERSION HISTORY
* 0.1.8 (09/29/2016) - Updated documentation
* 0.1.7 (04/01/2016) - Added support for volume controls, minor bug fixes, documentation fixes & refinements
* 0.1.6 (03/09/2016) - Log audit trails, added 'password' as an endpoint URL parameter, stub settings for controlling locks & roller shutters, stub settings for checking outdoor Temp/Humidity
* 0.1.5 (03/07/2016) - Interaction Model expansion, validation/error handling improvements, documentation refinements, and new ability to 'GetMode'
* 0.1.0 (02/29/2016) - Initial public release!

### LICENSE
----

[Eclipse Public License v1.0]

[//]: # 

   [node.js]: <http://nodejs.org>
   [alexa-app]: <https://www.npmjs.com/package/alexa-app>
   [alexa-app-server]: <https://www.npmjs.com/package/alexa-app-server>
   [express.js]: <http://expressjs.com>
   [request]: <https://www.npmjs.com/package/request>
   
   [Amazon Echo]: <https://en.wikipedia.org/wiki/Amazon_Echo>
   [OpenHAB]: <http://www.openhab.org/>
   [Wolfram Alpha]: <https://www.wolframalpha.com/>
   
   [Alexa Skills Kit]: <https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit>
   [AWS Lambda]: <https://aws.amazon.com/lambda/>

   [EchoSim]: <https://github.com/jjaquinta/EchoSim>
   [Getting started with Alexa Skills Kit]: <https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit/getting-started-guide>
   [Amazon Developer Portal]: <https://developer.amazon.com/>
   [INSTALL.md]: <https://github.com/unityfire/alexa-ha/tree/master/INSTALL.md>
   [INSTALL-QUICKSTART.md]: <https://github.com/unityfire/alexa-ha/tree/master/INSTALL-QUICKSTART.md>

   [utterances]: <https://github.com/unityfire/alexa-ha/tree/master/samples/sample-utterances.txt>
   
   [PayPal]: <https://paypal.me/arch1v1st>
   
   [Eclipse Public License v1.0]: <https://www.eclipse.org/legal/epl-v10.html>
