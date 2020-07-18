# water-bot

**This is the `pc-host` branch. This branch is designed for the bot to be hosted on your local machine.**

Water-bot is a simple Discord bot that verbally reminds you to do your daily essentials, such as:

- Drinking water
- Standing up and stretch
- Fixing your (sitting) posture

This bot was developed from scratch using [discord.js](https://discord.js.org/#/).

**I do not have any intentions of scaling this bot publicly**. I made water-bot for my friends and for fun, so I am releasing my source in hopes that others can use it for their own recreational use as well. You are also welcome to use this bot as a template for your own bot or for coding practice.

## Set-up

Before you download the code and deploy water-bot, you will first need to create a [Discord application](https://discord.com/developers/applications). Go ahead and click the link, select `New Application`, then name your bot whatever you want. I named my application `maple-bot`.

Once your application has been created, click on `Bot` in the `SETTINGS` menu to the left. Go ahead and click `Add Bot` to create a bot for this application.

On the `Bot` page, click on `Click to Reveal Token`. **This is your personal bot token that you will use to log-in your Discord bot. Do not reveal this token to anyone else as this token alone can allow others to take control of your bot.** Take a mental note of the location of this token for now.

Once you have the `Bot` enabled, click on `OAuth2` in the `SETTINGS` menu. Within the `SCOPES`, select `bot`. Within `BOT PERMISSIONS`, select `Send Messages`, `Read Message History`, `Connect`, `Speak`, and `Use Voice Activity`. These are the permissions your bot needs to function. Once you have selected the permissions, go ahead and `Copy` the link within the `SCOPES` box, and paste it into your URL.

You should be directed to a screen with a drop-down menu. Select the server for your bot, then click `Authorize`.

Congratulations - you now have your own Discord bot!

## Customization

The easiest way to customize the bot is to `Fork` my [repository](https://github.com/blbudima/water-bot) to add it to your account. You should make a [GitHub account](https://github.com/join) if you have not done so. Once logged in, you should see the option to fork my repository on the top-right.

Once you have forked my repository, you should be redirected to the repository on your own account. From here, you can clone your repository to your computer. You can clone your repository this via [Git](https://git-scm.com/docs/git-clone) or [GitHub Desktop](https://desktop.github.com/).

Once you have the repository cloned, go ahead and make some changes to make the bot personal to you! The official [discord.js guide](https://discordjs.guide/) is a fantastic place to start as it is useful in learning the basics to Discord botting as well as offering some fundamental Javascript knowledge. If you feel a bit more adventurous, then you can check out the [discord.js documentation](https://discord.js.org/#/docs/main/stable/general/welcome). You can also choose to make no changes. Make sure you push your changes to your GitHub respository!

You should also look into [node.js](https://nodejs.org/en/), a JavaScript runtime that can help you run your bot locally. The official discord.js guide covers using node.js to compile and run your JavaScript code.

**NOTE: Even if you choose not to make any changes to the bot, you MUST create a file titled `config.json` to the top directory of water-bot. This file is used to log-in your bot as well as to define several other variables used by the bot.**

Go ahead and create a file called `config.json` within the top directory of water-bot, then paste the following code inside the file.

```
{
  "token": "your-token-here",
  "prefix": "!!",
  "defaultCooldown": 3,
  "defaultTimer": 13.33
}
```

**Replace `your-token-here` with your personal bot token.**

**If you are able to code the bot to your personal preference and are able to test it as well, then you should already know how to deploy your bot!** You can stop here if you want. Otherwise, if you still need assistance in deploying the bot, then the next section covers how to deploy the bot through your local computer.

## Deployment

The code on this current branch (pc-host) is designed to be deployed locally (meaning it will run as a program on your computer). In my case, I am using [node.js](https://nodejs.org/en/) to compile and run water-bot!

**These following steps assume that you are running a Windows machine.**

Once you have made your changes to your bot (or maybe you didn't), go ahead and open up a `PowerShell` window (search for `powershell` in your start menu).

Change your directory

Once you are in your application, select the `Deploy` tab. For the `Deployment method`, select `GitHub`. Search for your `repo-name` (if you did not make any changes, then it should be `water-bot`), then `Connect` your repository. Once connected, I recommend that you `Enable Automatic Deploys`. Ensure that you also select the correct branch to deploy (if you did not make any changes, then it should be on `master`.)

Once finished with the `Deploy` tab, select the `Settings` tab. Within `Buildpacks`, click on `Add buildpack`, and select `nodejs`. Click on `Reveal Config Vars` to, well, reveal your configuration variables. **Here is where you insert four different variables: `token`, `defaultCooldown`, `defaultTimer`, and `prefix`**. Each of these listed variables will be the `KEY`, and each of these `KEY`'s have their own `VALUE`.

If you have successfully deployed the bot, then you should be able to see it online in your Discord server. Another way to check if the bot is working is to select `More` then select `View logs`. Within your logs, you should see this output: `Ready for action!`.

## Wrap-up

Congratulations - you deployed your own personal water-bot! Join a voice channel, type `##s` into a chat channel, and enjoy your personal reminders!
