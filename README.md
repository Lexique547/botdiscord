# Stream Role Bot ![](https://gitlab.com/lolPants/stream-role-bot/badges/master/build.svg)
_Discord Bot that assigns a role when someone is streaming._  
Built by [Jack Baron](https://www.jackbaron.com)

## Installation
### Prerequisites
* Node.js _( > v6 )_
* NPM _(Installed with Node.js)_

### Setup
1. Clone this repository _(or download as `.zip`)_
2. Run `npm install`
3. Find `/src/shared/config.example.js` then copy and rename it to `config.js`
4. Put your bot token and role name in the right places

### Running the Bot
1. Go to the root folder, and open a CMD / Bash terminal
2. Run `node .`

## Inviting to your server
1. In the [bot settings](https://discordapp.com/developers/applications/me) on Discord's site, find your bot and copy it's **Client ID**
2. Open this URL, but replace `<CLIENTID>` with your Client ID `https://discordapp.com/oauth2/authorize?scope=bot&client_id=<CLIENTID>&permissions=268438528`
3. Follow the instructions