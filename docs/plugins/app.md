# App

SDK provides various methods that can be used within the application.


## Available Methods

###overRideKeyMap

Returns the new keymap by overriding the existing keymap with the new keymap based on the flag keepDefaults

This can be done using the below snippet :

```js
this.application.overRideKeyMap(customKeyMap, keepDefaults)
```

- `customKeyMap` : Keymap to be overidden
- `keepDefaults`: Flag to overide the the default keymap or not.
    - By default `keepDefaults` will be false.
    - If set to `false`, it will override the existing keymap.
    - If set to `true`, it will be merged with the base keymap along with the exsiting keymap, where it has all the keys which has same values.
