<p align="center">
  <a>
    <img alt="Coc Logo" src="./rsrcs/logo.png"/>
  </a>
  <p align="center">A Discord bot to see your favorites AERs disponibilities and more</p>
  <p align="center">
    <a href="/doc/coc.txt"><img alt="Doc" src="https://img.shields.io/badge/doc-aer!%20help-green.svg?style=flat-square"></a>
  </p>
</p>

# Epidemy
This bot is usefull during Epimote

## Features

### Done
- [x] Get global informations about an AER
- [x] Display AERs schedule of the week 
- [x] List all AER of Bordeaux
- [x] System to check students presence on activities

### Planned

- [ ] Automatically update presence on the intranet
- [ ] Ping on-guard AER instead of the common role
- [ ] Search for a skill and get a list of praticants
- [ ] Make a full wiki
- [ ] Delete remaining file once presence done

## Config File

### Dotenv

An already half filled .env.example is provided, just fill in the blank

- APP_ID & APP_SECRET you need to register an App on azureAD (portal azure of epitech) in order to get the right to read mail calendar
- BOT_TOKEN the token of your application (go to the discord dev portal)
- DISCORD_SERV_ID & DISCORD_CHAN_ID I don't think I have to explain these
- ID_AER_CALENDAR the ID of the calendar in which we retreive informations

### AER

If you come from another Epitech's campuses than Bordeaux, modify this file as you please. It contains all informations about the AERs. I provide an example with my own infos.

## Installation

You have the choice of using Docker to run the app with 

```$ docker-compose up -d ```

or run it locally with

```$ npm install && npm start ```

## Disclaimer

This bot still under development, I only developped it for fun and to practice a little bit of Node (I proposed it to the tek HUB for the occasion)
