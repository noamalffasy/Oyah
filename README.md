# Oyah

Oyah is a Super Smash Bros. Melee website, it includes everything from news to tutorials.

Visit [oyah.xyz](https://oyah.xyz) to see it.

---

- [Contributing](#contributing)
  - [Prerequests](#prerequests)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running Oyah](#running-oyah)
- [Issues](#issues)
- [License](#license)

## Contributing

### Prerequests

    1. **Node.js** = 6.14.0
        You can install it from [Node.js' website](https://nodejs.org)
    2. **Yarn**
        You can install it from [Yarn's website](https://yarnpkg.com)
    2. **Git**
        You can install it from [Git's website](https://git-scm.com)

### Installation

After installing the prerequests:

1.  [Fork](https://help.github.com/articles/fork-a-repo/) this repository and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your device.
2.  Install the dependencies: `yarn`.

### Configuration

1.  Create a Firebase project [here]().
2.  Create the config files (`src/functions/config.ts` and `src/app/config.ts`).
    Use the associated example files ending with `.example` to make them in the correct format.
    Put in info from your Firebase project or generate your own (for the cookie's secret).
3.  Download the `serviceAccountKey.json` from Firebase.
    To get it:
    1.  Go to the [Firebase console](https://console.firebase.google.com/)
    2.  Choose your project
    3.  Click on the wheel located near the Project Overview button, under the Firebase logo on the left side of the screen.
    4.  Click on `Project settings`.
    5.  Go to the `Service accounts` tab.
    6.  Click on the `Generate new private key`.
4.  Put that file in `src/functions`.
5.  Download the `firebase-tools` using `yarn global add firebase-tools`.
6.  Login to Firebase using `firebase login`.
7.  Add your Firebase project using `firebase use --add`.
    1.  Choose your project from the list.
    2.  Name it `default`.

### Running Oyah

After finishing the installation and configuration use `yarn next-dev` and a development version of the site will run.
It is without the server so custom routes and cookies won't work.

## Issues

If you have any issues or features that you want to add, open an issue [here](https://github.com/noamalffasy/Oyah/issues).

## License

Licensed under the [MIT](https://github.com/noamalffasy/Oyah/blob/master/LICENSE) License
