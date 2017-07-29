# Numadic-GPS-App
Installation Guide:
This guide contains installation , and startup instructions as below mentioned.

		Openssl Installation Instructions:
		Plz download the openssl downlaoder and install it. Set the enviroment variable path pointing to openssl/bin directory.
			Under the Numadic directory
				a. from the cmd terminal, run 
					> ./makecerts emailId
					This will create server and client side certs and keys along with self signed rootca, under /certs/ directory.
					
		1. MongoDB Installation and Startup
			a. Plz download the mongoDB windows 32-bit installer from official website.
				Install the mongodb  on windows machine.
				Setup the environment variable pointing to mongo/bin installation directory
				
			b. From the windows command prompt:
				create a C:\data\db directory and then enter below cmd , this will map the db storage path to data/db dir.
				
				> mongod --storageEngine=mmapv1 --dbpath "C:\data"
				
				On entering this cmd, database will start listening client (Nodejs server requrests in our case) requests.
				Note: ensure above command is running for application to run properly.
				
				
		2. NodeJS Server Installation, Requirements and Start up.
			Plz donwload and install the nodeJS windows setup and install it. Set up the enviroment variable point to nodejs/bin dir.
			a. Before starting the server, plz ensure all the required nodeJS packages are installed in the directory.
				List of packages: 	
						"express": "^4.15.3",
						"fs": "0.0.1-security",
						"mongodb": "^2.2.30",
						"socket.io": "^2.0.3",
						"ssl-root-cas": "^1.2.3",
						"tls": "0.0.1",
						"websocket": "^1.0.24"
						
					>npm install --save express fs mondodb socket.io ssl-roo-cas tls websocket
					> npm install --save nodemon
					
			b. start the nodejs Server as:
				> nodemon index.js
			
			

		
		3. Go Client Requirements,Installation and running mode
			a. Download and install the windows MSI go language Binary.
			b. Set the enviroment path pointing to GO/bin directory.
			c. In the goClient directory, run the client.go program. This is a client side program.
			This program will ask the number of clients to connect to server and no of chunks each client should send to server. Input: No of Clients,and No of Chunks each client should stream .
				> go run client.go
				
		
		
		
		
		once done running client.go application
		
		Now, from the UI, Access it from the browser,:
			URL: http://localhost:3000/index.js
			This will load the UI displaying the no of devices that were connected to nodeJS, and on clicking the device, will show the chunks that were stored in the database , i.e. co-ordinates, speed, date n time, device status info.
			
			U can delete the table from the database with localhost:3000/drop
			
			Following APIS can be accessed from UI:
				1. http://localhost:3000/listDevices
					it'll return an array containing [[ 'Device0','Device1'.....]]
				2. http://localhost:3000/getDetails/Device0
					It'll load the last record of Device0
				3. http://localhost:3000/records
					It'll load the  record of all the devices
				4. http://localhost:3000/drop
					It'll delete the table as well as all the table records
				5. http://localhost:3000/geoPosition
					It'll return the lat ,long co-ordinates , status, time and data 
				6.
