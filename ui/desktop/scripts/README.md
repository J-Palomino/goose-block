# Daisyy

Put `daisyy` in your $PATH if you want to launch via:

```
daisyy .
```

This will open daisy GUI from any path you specify

# Unregister Deeplink Protocols (macos only)

`unregister-deeplink-protocols.js` is a script to unregister the deeplink protocol used by daisy like `daisy://`.
This is handy when you want to test deeplinks with the development version of Daisy.

# Usage

To unregister the deeplink protocols, run the following command in your terminal:
Then launch Daisy again and your deeplinks should work from the latest launched daisy application as it is registered on startup.

```bash
node scripts/unregister-deeplink-protocols.js
```

