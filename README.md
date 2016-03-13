Security
========

The screen and admin page can (and should be secured when running in production). Just place a file named `admin.htpasswd` and `screen.htpasswd` to the `htpasswd` folder. These are regular htpasswd files (i.e. you can place one `username:password` per line).

Deployment
==========

This repository is prepared for deployment to Google Cloud (via Google ManagedVMs).
Here are the steps you need to do to deploy lvlup-game to your own Google Cloud project.

1. Create a new project at https://console.cloud.google.com
2. **Important:** You have to select **us-central** as a region for the project right now (Google ManagedVMs is not available in any other region)
3. Select *Compute Engine* from the menu and enable it (and billing, if it isn't enabled yet)
4. Install the Google Cloud SDK (https://cloud.google.com/sdk/) on your machine
5. Run `gcloud init` and select the newly created project
6. Make sure, you have created a `screen.htpasswd` and `admin.htpasswd` as described in the *Security* section
7. Run `gcloud preview app deploy` to deploy lvlup-game to your project
8. Access the app via https://{your-project-id}.appspot.com

### Known limitations

Unfortunately ManagedVMs don't support websockets right now. That's why the project (read socket.io) will fallback to long polling instead of using websockets for communication. This is a drawback and might hurt performance especially when there are a lot of users.
