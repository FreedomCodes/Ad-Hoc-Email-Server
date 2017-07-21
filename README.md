
# ahem-server

An ad-hoc mail server. Create and use ad hoc disposable mailboxes for testing or any other purpose.
This project will provide both RESTful api and web application for consuming the service.


![Alt text](/../images/images/screenshot.png?raw=true "AHEM mail server")

## Getting Started
Ahem mail server will accept any email sent to it, and create an ad hoc mailbox as needed.
Then just browse to it's UI, enter the account name and you'll see the emails the account received.
That's it. No authentication. No account creation.

## Prerequisites
```
nodejs v6.11
npm v3.10
```

## Installation
```bash
# clone the repository
git clone https://github.com/o4oren/ahem-server.git
cd ahem-server
# builds the project.
# the build script actually runs npm install to install all dependencies, 
# npm rebuild node-sass to rebuild the sass compiler for the system,
# and ng build --prod to build a 'production' version of the ng2 front end.
# There are other, convenience options for build and run in development mode.
npm run build
# prod run - will run the backend which will also serve the front end form the `dist` folder.
npm start
```

### Configuration
A configuration file names properties.json is located in the root of the project.
Edit it to fit your use case.
Parameters:
* dataDir - location of the actual email files saved on the filespace.
* appListenPort - the port the node app will bind to.
* smtpPort - ahem... you know.
* emailDeleteInterval - The time in seconds between age checks for purging old files.
* emailDeleteAge - The age in seconds above which emails will be deleted
* allowedDomains - An array of allowed email domains. These domains will be allowed by the server as RCPT TO: entries. This also makes the server not act as an open relay. Format: ["my.domain.com", "my.second-domain.com"]

### API

HTTP Method | URI Path | Parameters | Descritpion
--- | --- | --- | ---
POST | /account/autocomplete | { "prefix":"value" } | Returns a partial list of accounts
GET | /api/properties | |returns the properties.json content
GET | /api/account/{account} | |returns a list of the email objects in the account
GET | /api/account/{account}/{timestamp} | |Gets the contents of a specific email
DELETE | /api/account/{account}/{timestamp} | |Deletes a specific email

### Todo for 1.0

- [ ] Error page when user/email doesn't exist.
- [ ] Empty mail page
- [x] Landing page
- [x] Errors on find user/email in api
- [ ] Error on non existing user / message
- [ ] routing for messages
- [ ] read/unread icons
- [ ] attachments
- [x] allow delete emails


## Authors

* **Oren Geva**

See also the list of [contributors](https://github.com/o4oren/ahem-server/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details



