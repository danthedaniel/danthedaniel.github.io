---
title: "How to Force Daily Updates to a Steam Game and its Mods"
date: 2023-07-21T16:33:25-07:00
draft: false
tags: ["video games", "steam"]
---

I play a lot of DayZ. The game is amazing but I've found out that it has a critical flaw. You can end up waiting in a queue to join a server for 30 minutes, only to learn upon finally entering the server that one of your mods is out of date. This gets you kicked and you're once again at the back of the line. Most games would check this upon putting you in the queue. I can't fix DayZ but I can fix Steam.

Steam is supposed to auto-update all of your games and all of their workshop mods. But it doesn't seem to do this immediately after an update is available. So I needed to find a way to reliably force updates to DayZ and its mods.

One option is to consistently run the "Verify integrity of game files" operation in the Steam client before playing.

![Steam window that shows a "Verify integrity of game files" button](/blog/image/steam/verify-files.png)

But computers are here to take care of repetitive tasks for us.

## The solution

Valve has a tool called `steamcmd`. It's a command line tool that can be used to install, update, and run Steam games. It's mostly for use on something like a CS:GO server. But it also runs just fine for normal Windows games.

### Getting the files in order

1. Download steamcmd [here](https://developer.valvesoftware.com/wiki/SteamCMD#Downloading_SteamCMD).

2. Extract the contents of the `steamcmd.zip` file to a folder. Pick somewhere you'd like to have it permanently as we will be referencing the absolute path to it later.

Now we need to create a small script that will tell steamcmd to update DayZ and its mods.

3. Create a file called `update_dayz.txt` in the same folder as `steamcmd.exe`. Open it in a text editor and paste the following:

```
@ShutdownOnFailedCommand 1
@NoPromptForPassword 1
force_install_dir "C:\Program Files (x86)\Steam\steamapps\common\DayZ"
login <your username> <your password>
app_update 221100 validate
quit
```

* Replace `<your username>` and `<your password>` with your Steam username and password. Be careful - the password is getting stored in plain sight.
* If you're using this script for a game other than DayZ, replace `221100` with the [AppID](https://steamdb.info/app/221100/) of your game and replace the path in `force_install_dir` with the path to your game's folder.

4. Create a file called `update.bat` in the same folder as `steamcmd.exe`. Open it in a text editor and paste the following:

```batch
@echo off

"C:\Users\Daniel\steamcmd-tutorial\steamcmd.exe" +runscript "C:\Users\Daniel\steamcmd-tutorial\update_dayz.txt"
```

* Again, replace the paths with the absolute paths to your `steamcmd.exe` and `update_dayz.txt` files.

Your final folder layout should look like this:

<div class="card">
  <ul>
    <li><code>steamcmd-tutorial\</code></li>
    <ul>
        <li><code>steamcmd.exe</code></li>
        <li><code>update_dayz.txt</code></li>
        <li><code>update.bat</code></li>
      </ul>
  </ul>
</div>

### Pre-authenticating with Steam

If you *don't* have Steam Guard enabled, you can skip this section.

For those that do, if you tried to run this script now you'll most likely see this:

```
Logging in user '<your username>' to Steam Public...
This computer has not been authenticated for your account using Steam Guard.
Please check your email for the message from Steam, and use
the command 'set_steam_guard_code' to enter the code here.
```

You'll need to manually authenticate just one time to get this working.

1. Open a command prompt and navigate to the folder with `steamcmd.exe` in it so you can run it.

```
C:\Users\Daniel>cd steamcmd-tutorial

C:\Users\Daniel\steamcmd-tutorial>steamcmd.exe
Redirecting stderr to 'C:\Users\Daniel\steamcmd-tutorial\logs\stderr.txt'
[  0%] Checking for available updates...
[----] Verifying installation...
Steam Console Client (c) Valve Corporation - version 1689642531
-- type 'quit' to exit --
Loading Steam API...OK

Steam>
```

2. Then log in using the `login <your username> <your password>` command. You'll be prompted for your Steam Guard code which you can get from your email inbox or the Steam mobile app.

```
Steam>login <your username> <your password>
Logging in user '<your username>' to Steam Public...
This computer has not been authenticated for your account using Steam Guard.
Please check your email for the message from Steam, and enter the Steam Guard
 code from that message.
You can also enter this code at any time using 'set_steam_guard_code'
 at the console.
Steam Guard code:ABCDE
OK
Waiting for client config...OK
Waiting for user info...OK
```

Hooray! You're almost done.

### Setting up the Windows Task Scheduler

1. Open the Windows Task Scheduler (search for "Task Scheduler" in the Start menu)

2. Select "Create Basic Task" from the right sidebar. Give it a simple name like "Update DayZ". Click "Next".

![Task Scheduler's "Create Basic Task Wizard" window](/blog/image/steam/basic-task-name.png)

3. On the "Trigger" setup screen, I would recommend setting the trigger to "Daily". But you can do what works for you. Click "Next".

4. On the time input screen I set the start time to be 4:30 PM because I play in the evenings. That way everything will be updated by the time I'm gaming. Click "Next".

5. Select "Start a program" as the action. Click "Next".

6. For the "Program/script" field, click on "Browse..." and find your way to `update.bat` and select it. Click "Next" then "Finish".

![Task Scheduler's "Create Basic Task Wizard" window](/blog/image/steam/basic-task-program.png)

Now every day at your set time you'll see one of these pop up. Don't worry! It's just the script updating your game.

![Command prompt window of the steamcmd script](/blog/image/steam/steamcmd-script.png)

You can run the new task manually just to see what happens by right clicking on it (in the list of tasks in the middle of the Task Scheduler window) and selecting "Run".
