# Alexa-HA QUICKSTART with Ubuntu 14.04 LTS Server
The purpose of this document is to provide a minimalistic set of instructions on how to setup Alexa-HA, a customizable Skill for your Amazon Echo.  For this, we are taking the Semi-direct approach (Echo -> AWS ASK -> NodeJS/Express -> HA) for routing the Echo requests to your Home Automation controller.

NOTE:  We recommend proxying Node.js/Express.js behind a proper webserver such as Apache/Nginx (i.e. Echo -> AWS ASK -> Apache/Nginx -> NodeJS -> HA), which decouples your application logic from the public facing server and provides an extra layer of security.  This is more complicated to configure however, and Alexa-App-Server is capable of doing everything we need here without this extra 'hop'.

#### Before you begin
You will need the following to complete these quick start instructions!
- Ubuntu Server VM, already provisioned; preferably dedicated to Alexa-HA for improved security.  This can be done on the same server as OpenHAB, but we suggest not exposing your OpenHAB server to the public internet...
- An available public static IP or Dynamic DNS provider
- Public port 443 available (i.e. not already in use by another service, however if it is already in use by Apache2/Nginx/etc you can still 'proxy' the communication to your Node.js server!)
- Some knowledge of firewall/router setups and DNS configuration as we must expose the Node.js/Express.js service to the outside
- Ideally a trusted SSL certificate, however self-signed SSL certificates may be used (setup is detailed below).

#### Install Git
This is optional, you could just grab a ZIP from GitHub via HTTPS and decompress the archive instead!  
```
sudo apt-get install git
````
#### Install Node.js
```
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Create an unprivileged user to run Alexa-App-Server & Alexa-HA
```
sudo adduser alexa
sudo su alexa
cd ~
```

#### Install necessary node packages and dependencies under the 'alexa' user
```
npm install alexa-app alexa-app-server request
```

#### Patch alexa-utterances module (a temporary fix for ASK custom slot support!)
```
cd ~/node_modules/alexa-app/node_modules/alexa-utterances/
wget https://github.com/unityfire/alexa-ha/files/155821/alexa-utterances_custom_slot_support.patch.txt
patch -p1 < alexa-utterances_custom_slot_support.patch.txt
```

#### Copy Alexa-App-Server's examples directory to a new 'stub' server 
```
cp -R ~/node_modules/alexa-app-server/examples/ ~/node_modules/alexa-app-server/api/
cd ~/node_modules/alexa-app-server/api/
```

#### Remove existing demo apps, clone Alexa HA from GIT, and configure
Be sure to select which branch you want in the command below!  Use 'develop' for the latest and greatest or 'master' for the stable release of Alexa-HA.
```
rm -rf ~/node_modules/alexa-app-server/api/apps/*
cd ~/node_modules/alexa-app-server/api/apps/
git clone -b master https://github.com/unityfire/alexa-ha.git
cd alexa-ha
cp config_default.js config.js
nano config.js
```
- Set the various AWS ASK related settings as needed - applicationId is available from Amazon Developer Portal
- userId can be found later in the install process after setting up external endpoint access, and issuing the first Alexa-HA command - the logs will show the device/skill current userId, which changes every time you re-install the Skill (even on the same device!)
- If you want to use Wolfram Alpha with Alexa-HA (i.e. to have it 'research' anything for you via voice, which is optional!), register and enter your API key
- Open up your various OpenHAB configuration files (i.e. items/sitemaps/rules) for reference in another window; use these to setup the rest of config.js as desired. The most important part of configuring this is that beyond the General Configuration section, the mappings setup in the HA* & config.item/mode/metric sections in Alexa-HA's config.js are correctly pointed to the items/modes/devices in OpenHAB! Alexa-HA uses this to determine which items in your home do what, and where...
- Save config.js and exit
- Create a few new items in your OpenHAB configuration/items/* file to be used by Alexa-HA. These are used only as a fallback for custom/arbitrary voice commands (optional, which can trigger custom rules on the OpenHAB server):

```
String ECHO_VoiceCMD "ECHO VoiceCMD: [%s]"
String ECHO_Answer "ECHO Answer: [%s]"
Switch ECHO_Processed "ECHO Proc [%s]"
Switch ECHO_Switch "ECHO Switch [%s]"
```

#### Setup a self signed SSL cert (optional, if you do not have a trusted SSL cert available!)
```
cd ~/node_modules/alexa-app-server/api
mkdir sslcert
cd sslcert
openssl genrsa -out private-key.pem 1024
openssl req -new -x509 -key private-key.pem -out cert.cer -days 365
```
Remember to upload the contents of your ```~/node_modules/alexa-app-server/api/sslcert/cert.cer``` to AWS ASK Skill > SSL Certificate > 'I will upload a self-signed certificate in X.509 format' during the later steps of setting up the Skill via the AWS Developer Portal!

#### Modify server.js to suit your needs
```
cd ~/node_modules/alexa-app-server/api
nano server.js
```
Here is mine for example (note the non-standard app_root & ports, and HTTPS is enabled as its required for an AWS ASK):
```
var AlexaAppServer = require("../index.js");
AlexaAppServer.start( {
        app_dir:"apps",
        app_root:"/api/",
        port : 30001,
        httpsEnabled : true,
        httpsPort : 30000,
        privateKey:'private-key.pem',
        certificate:'cert.cer',
        preRequest: function(json,req,res) {
          // Include password value from URL parameter, so Alexa-HA can validate it...
          json.password = req.param('password').toString();

          // Extract the IP address of the client (handles IPv4 and IPv6)
          var IPFromRequest = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
          var indexOfColon = IPFromRequest.lastIndexOf(':');
          var address = IPFromRequest.substring(indexOfColon+1,IPFromRequest.length);
          json.remoteAddress = address;

        },
        postRequest: function(json,req,res) {
        }
} );

```

#### Redirect port 443 (external, currently required for AWS ASK's) to 30000 (internal)
This uses iptables to work around restricted port limitations for non-root level users (i.e. our newly created 'alexa' account).  Adjust port numbers as needed (external port 443 is required for ASK's!)
```
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 30000
```
Next, make the iptables rules permanent (applied at boot time):
```
sudo apt-get install iptables-persistent
```

#### Start the service in the foreground
```
node server.js
```

#### Visit the Alexa-HA test page endpoint in your browser:
https://LOCAL_IP/api/alexa-ha

#### Setup perimeter router/firewall to port forward to the host IP 
(depends, out of scope)

#### Setup internal and external DNS to map to the correct hostname/IP
(depends, out of scope) 

#### Test URL from the outside
Now that everything should be setup, test it by loading the HTTPS endpoint URL in your browser by IP (``` https://PUBLIC_IP/api/alexa-ha/ ```) and by Fully Qualified Domain Name (``` https://FQDN/api/alexa-ha/ ```).  You should be able to reach the 'Alexa Tester' page!

### Daemonize Alexa-HA with PM2
Consider using the Node.js PM2 module for daemonizing Alexa-HA. PM2 also handles logging to the file system. To have Alexa-HA automatically start at boot, do the following:

- Stop node if currently running in the foreground (Control-C)
- Run the following command as a privileged user to install PM2 globally (note you may need to change the username 'alexa' for your environment.  This should be an unprivileged user!)
```
sudo npm install pm2 -g
sudo env PATH=$PATH:/usr/local/bin pm2 startup -u alexa
```
- You may need to change the home path to your alexa user by editing the start script:
```
sudo nano /etc/init.d/pm2-init.sh
```
- Find the PM2_HOME export and set it to use our 'alexa' users directory, like so:
```
export PM2_HOME="/home/alexa/.pm2"
```
- Start Alexa-HA with PM2:
```
sudo su alexa
cd ~/node_modules/alexa-app-server/api/
pm2 start server.js
pm2 status
```
- Check the status of the service with:
```
pm2 show server
```
- The service will gracefully start and stop as needed.  To manually restart it, run (as the 'alexa' user):
```
pm2 restart server
```
- Reboot the server to ensure everything comes up automatically:
```
sudo reboot
```
- Confirm the endpoint is still accessible by visiting the URL in your browser:  ``` https://FQDN/api/alexa-ha/ ```

#### Additional considerations
Look at the 'Additional considerations' in INSTALL.md for additional steps you should carry out for improved security.

#### Congrats!
If you made it this far, the next steps are relatively easy to finish your setup and get to using Alexa-HA with your Echo(s)!  Continue to the second section named 'Setup Amazon Skills Kit' in [INSTALL.md]...

[//]: # 

[INSTALL.md]: <https://github.com/unityfire/alexa-ha/blob/master/INSTALL.md>
