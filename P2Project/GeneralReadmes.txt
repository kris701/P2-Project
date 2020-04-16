
=============================
		Client-side
=============================

To upload to Uni servers:
	1. Connect to "dat2c1-3.p2datsw.cs.aau.dk" in WinSCP
	2. Go all the way back to root folder
	3. Go to: srv => www => dat2c1-3.p2datsw.cs.aau.dk => https
	4. Upload files
	5. The server should now be updated

=============================
		 Database
=============================

To update the database project (only do this if database is complete):
	1. Remove all old files in the "Database" project
	2. Right-click the project and go to import => database
	3. Connect to the database "sql6009.site4now.net,1433"
	4. Set the authentication to be SQL
	5. Use the admin username and password
	6. REMEMBER TO SET THE "REMEMBER PASSWORD" TO TRUE, OR IT WILL NOT WORK
	7. Start the import
	8. It should now be done

To connect to the database live, and edit it:
	1. Go to View => Server Explore
	2. Right-click "Data Connections"
	3. Clicl "Add Connection"
	4. Use the same credentials as above (step 3 to 6)
	5. You should now be connected to the DB
	6. To edit tables:
		a. Right-click a table
		b. Click "Open Table Definition"
		c. Edit what you want
		d. Click the update button in the top left corner
	7. To edit table data:
		a. Right-click a table
		b. Click "Show Table Data"
		c. Edit what data you want, every time you go to a new row, it automatically updates the database

=============================
		Sensor Code
=============================

!!Requires vMicro to work!!

To upload code:
	1. Set board to be "Node MCU 1.0" (download the ESP library if you dont have it)
	2. Set the correct port.
	3. Upload

=============================
		Server-side
=============================

To update the server backend code:
	1. Connect to "dat2c1-3.p2datsw.cs.aau.dk" in WinSCP
	2. Go all the way back to root folder
	3. Go to: srv => www => dat2c1-3.p2datsw.cs.aau.dk => data => node
	4. Upload files
	5. Open Putty
	6. Connect to the same IP
	7. Go all the way back to root folder (use "cd .." a couple of times)
	8. Go to: srv => www => dat2c1-3.p2datsw.cs.aau.dk => data => node
	9. Type "node interface.js"
	10. The server should now be running

To run Unit-test
	1. Right-click "npm" in Solution Explore
	2. Click install new packages
	3. Install the packages "Mocha", "Chai" and "path"
	4. The tests should now show up

If server instance does not stop:
	1. Open Putty
	2. Type "ps - aux | grep node"
	3. Find the PID of the process
	4. Type "kill -9 <PID>"
	5. The server should now be dead
