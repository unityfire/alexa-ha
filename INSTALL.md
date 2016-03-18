# Setup Your HA Controller to work with Alexa-HA
Currently only [OpenHAB] is supported - others HA solutions to follow.  These installation steps can carried out directly on your HA server or better yet a seperate server on the same network.  Depending on your environment, it is best to create a restricted user that runs Alexa-HA and its dependencies rather than simply using a global root/administrator for everything.  That is outside of the scope of the current installation documentation...

NOTE:  These installation instructions are a bit rough, complex and UNDER CONSTRUCTION at the moment but should get the job done!  It is assumed you are familiar with service/webserver configurations, SSL certificates, and firewall/router setup.  This process will be greatly simplified in the future...

To begin:
- Ideally provision a new machine/VM as a dedicated server to host Alexa-HA for enhanced security, but these services are lightweight and can be installed on existing servers as well (i.e. on the OpenHAB server)
- Install [node.js]
- Install [npm]
- Install [alexa-app]
- Install [alexa-app-server] 
- Install [request]
- Install [pm2] (optional, but very useful for setting Alexa-HA as a background service)
- Apply a temporary [patch] to alexa-utterances (which was installed as a dependency for alexa-app), required to support the CUSTOM SLOT types - should not be necessary after the next release of alexa-app!

You now have all the dependencies met and can continue with configuring and starting the Alexa-HA Skill.

- Checkout the code or just download the ZIP from [Alexa-HA]'s github page to the Alexa-App-Server's /example/app/ directory (i.e. example/app/Alexa-HA)
- Copy config_default.js to config.js
- Edit config.js 
- Set the various AWS ASK related settings as needed - applicationId/userId values and more available from [Amazon Developer Portal]
- If you want to use [Wolfram Alpha] with Alexa-HA (i.e. to have it 'research' stuff for you via voice, optional!), register and enter your API key
- Open up your various OpenHAB configuration files (i.e. items/sitemaps/rules) for reference in another window; use these to setup the rest of config.js as desired. The most important part of configuring this is that beyond the General Configuration section, the mappings setup in the HA* & config.item/mode/metric sections in Alexa-HA's config.js are correctly pointed to the items/modes/devices in OpenHAB!  Alexa-HA uses this to determine which items in your home do what, and where...  
- Create a few new items in your OpenHAB configuration/items/* file to be used by Alexa-HA.  These are used only as a fallback for custom/arbitrary voice commands (which can trigger custom rules on the OpenHAB server):
```
String ECHO_VoiceCMD "ECHO CMD: [%s]"
String ECHO_Answer "ECHO Answer: [%s]"
Switch ECHO_Processed "ECHO Proc [%s]"
```
- You may also need to create new groups on the HA server (especially for lighting) so Alexa-HA can control many items (i.e. in the same room) at a time.
- The rest of the config.js file can be revisited/improved later (i.e. units/colors/utterances/etc sections may be further customized).
- Save & Exit
- Consider editing Alexa-App-Server 'example/server.js' and changing the service to use a non-standard port number
- You can now start the Alexa-App-Server and Alexa-HA app in the foreground with 'node server.js' or keep it running in the background with 'pm2 start server.js' ('pm2 status' displays additional useful info)
- Visit http://INTERNAL_IP:PORT/api/Alexa-HA/ - which should show the Alexa Tester page.  This confirms that the service is up and listening.
- You now have the option of exposing your internal Node.js/Express service directly to the public, or setting it up behind a webserver such as Apache or Nginx.  In all cases an SSL certificate (trusted, or alternatively a self signed cert can be uploaded via [Amazon Developer Portal]) must be used for HTTPS.  For example, assuming you already have a SSL-enabled Apache webserver, edit Apache's 'sites-available/default-ssl' config file and add the following inside of the VirtualHost configuration (proxied address/ports depend entirely on your network setup!):
```
    <Location /api>
        ProxyPass http://localhost:10000
        ProxyPassReverse http://localhost:10000
    </Location>
```
- Setup a port forwarding rule to route external public requests to the new Node.js/Express internal service.  If you have an public static IP address (from your ISP), use it.  If not, consider a dynamic DNS service which will route a static FQDN to your dynamic IP.  In both cases, we recommend selecting a 'high port' of 30000+ to use for the communication from the public to Alexa-HA.  For example, a public static IP:Port of '123.123.123.123:30000' is forwarded (by the firewally/router) to an internal private IP:port of '192.168.1.50:10000'.  
- Restart all services  (Alexa-App-Server & webserver) for the changes to take effect. 
- You should now be able to access 'https://MY_FQDN/api/Alexa-HA' and see the 'Alexa Tester' page from the ouside (which is required for the next steps work)!  If not, you have a service or firewall config issue that needs to be addressed before continuing.

# Setup Amazon Skills Kit

In order to continue setting up your Alexa-HA skill, you will need to define the 'Interaction Model' which encompasses the Amazon Skill Kits 'Intent Schema', 'Custom Slots' and 'Utterances' via the [Amazon Developer Portal].  Fortunately Alexa-HA takes care of generating most this for you automatically after properation configuration.  For this, you must fully configure Alexa-HA via config.js and install Alexa-App-Server along with its dependencies.  

Complete the INSTALL steps for your HA controller first.  Then continue with the ASK setup below.  For quick reference, see steps 3-4 in this [tutorial] which includes additional details and screenshots.

- Sign in or create an account on the [Amazon Developer Portal]
- Once you’ve signed in, navigate to Apps & Services > Alexa > Alexa Skills Kit
- Click 'Get Started' under Alexa Skills Kit
- Click 'Add a new Skill'
- Give your skill a name - simply 'Alexa-HA' will do
- Set your desired Invocation Name - for example 'OpenHAB' or 'Jarvis' - which you can then use to invoke the custom Skill on your Echo.
- Set your endpoint - this is a URL to your publicly accessible Alexa-App-Server's skill endpoint. For example:  'https://MY_FQDN/api/alexa-ha?password=CONFIG_PASSWORD' or 'https://MY_PUBLIC_IP/api/alexa-ha?password=CONFIG_PASSWORD'.  Lambda ARN's have not been tested yet...
- Save and continue to the next step - 'Interaction Model'
- At this point, once you have configured and started the Alexa-App-Server, you should be able to visit the endpoints URL to get a full 'dump' of the Interaction Model.  These values ('intent schema' and 'utterances') should be copied into the AWS ASK Interaction Model page.
- Define your 'custom slots'.  These should match what you've within Alexa-HA's config.js file.  For example, a custom slot of 'COLOR_TYPE' with values like:
```
white
red
orange
yellow
green
aqua
blue
purple
magenta
pink
black
```
- A second custom slot for 'LOCATION_TYPE' should contain a list of rooms throughout your house.  ASK uses these lists to automatically expand the utterances and build the interaction models on the ASK servers.  For example:
```
all
house
living room
great room
kitchen
bedroom
bathroom
data center
garage
office
foyer
utility
outside

```
- IMPORTANT!  Save these changes, but you do not need to continue on to fully publishing the app!  Your new custom Service & Skill is now setup to control ONLY YOUR HOME!  Do not make it public.
- Say 'Alexa, open Jarvis' (or whatever your 'Invocation Name' is) and get started!

NOTE:  If you change the Alexa-HA files, including config.js, you need to restart the service(s) and re-upload the Interaction Model to the [Amazon Developer Portal] before all changes will take effect!

# Additional considerations:
- Avoid running everything on a single box!  We do not recommend exposing your Home Automation controller directly to the Internet!
- Lock down your webserver as much as possible, only allow the AWS ASK IP's to access Alexa-HA (which may vary)
- Setup UFW to allow the Alexa-HA server to communicate ONLY with the gateway and the HA controller
- Enable production server flags to hide version numbers for all services
- Setup fail2ban, to pro-actively block clients by IP which make too many requests to the service in a short period of time

[//]: # 

   [Alexa-HA]: <https://github.com/unityfire/alexa-ha>

   [node.js]: <http://nodejs.org>
   [npm]: <https://www.npmjs.com/>
   [alexa-app]: <https://www.npmjs.com/package/alexa-app>
   [alexa-app-server]: <https://www.npmjs.com/package/alexa-app-server>
   [request]: <https://www.npmjs.com/package/request>
   [pm2]: <https://www.npmjs.com/package/pm2>
   
   [patch]: <https://github.com/MaxwellPayne/alexa-utterances/commit/8599208037ada7020a3ab8c6fc979e31a2ff934c>
   
   [OpenHAB]: <http://www.openhab.org/>
   [Wolfram Alpha]: <https://www.wolframalpha.com/>
   
   [Amazon Developer Portal]: <https://developer.amazon.com>
   [AWS Lambda]: <https://aws.amazon.com/lambda/>
   [tutorial]: <https://developer.amazon.com/appsandservices/community/post/TxDJWS16KUPVKO/New-Alexa-Skills-Kit-Template-Build-a-Trivia-Skill-in-under-an-Hour>
