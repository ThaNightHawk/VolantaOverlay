# VolantaOverlay
I got tired of Volanta's pay2style barrier, with the only thing to be changed are the colors.

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
