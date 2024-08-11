# VolantaOverlay
I got tired of Volanta's pay2style barrier, with the only thing able to be changed being the colors.  

Ironically enough, right now, the easiest thing to change are the colors.  
They're defined in `/CSS/main.css` within the :root-block.  
Currently it mimics the exact info that Volanta does on their 1st party overlay, except for when you don't have a flightplan, then it'll say that.

> [!NOTE]
> To use this, make sure you have ENABLED the "Streamer Tools" in Volanta.

# How to use?
Simply download the repository, un-zip the folder somewhere, and import the `index.html` file into OBS using a browser-source.  

> [!WARNING]
> The browser source **needs** to be 2560x1440, no matter your base-resolution. (I forgot to take 1080p into account when coding this.)

# How does it work?
Simple. This hooks into the Volanta-websocket, that the 1st party Volanta streamer overlay uses.


## Contribute
If you want to contribute, feel free. There is **a lot** of unused data from Volanta, that could possibly be used.  
  
See `/Data` for the `SET_OVERLAY_STATE` and `POSITION_UPDATE` data  
  
All you have to do is fork the repository, and create pull-requests with fixes/additions to the overlay.


# Screenshots:

In flight:  
![Screenshot 2024-08-11 16-12-37](https://github.com/user-attachments/assets/25aee01f-3b4f-4758-9ca5-01481b52e29a)


On ground, with no flightplan:
![Screenshot 2024-08-11 16-16-20](https://github.com/user-attachments/assets/92615c7c-3e69-4824-8d63-c6983ff17448)

