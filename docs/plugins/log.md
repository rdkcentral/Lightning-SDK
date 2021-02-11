# Log


It is common practice to use `console.log` to quickly debug an App.


Although this can be very useful during development and QA, it is not desirable to deploy an App in production while all sorts of logs are still enabled.


Instead of using `console.log` (or `.debug`, `.error`, `.warn`), it is recommended to use the *Log* plugin.


The Log plugin generates (prettier) logs *only* if the [Platform Setting](settings.md#platform-settings)`log` is set to 'true'. As a result, you can keep a (small) number of relevant logs inside your App code without the need to remove them before you push your App to production (this is handled automatically).

## Usage


If you want to use the Log plugin, import it from the Lightning SDK:


```
import { Log } from '@lightningjs/sdk'
```

## Available Methods

### info()


Invokes a `console.log` when the Platform Setting `log` is 'true'.


```
Log.info(label, argument1, argument2, argument3, ..., argumentx)
```


The `info` method accepts any number of arguments. If the first argument is a String, it will be displayed as a custom label instead of the default label 'Info'.

### debug()


Invokes a `console.debug` when the Platform Setting `log` is 'true'.


```
Log.debug(label, argument1, argument2, argument3, ..., argumentx)
```


The `debug `method accepts any number of arguments. If the first argument is a String, it will be displayed as a custom label instead of the default label 'Debug'.

### error()


Invokes a `console.error` when the Platform Setting `log` is 'true'.


```
Log.error(label, argument1, argument2, argument3, ..., argumentx)
```


The `error` method accepts any number of arguments. If the first argument is a String, it will be displayed as a custom label instead of the default label 'Error'.

### warn()


Invokes a `console.warm` when the Platform Setting `log` is 'true'.


```
Log.warn(label, argument1, argument2, argument3, ..., argumentx)
```


The `warn` method accepts any number of arguments. If the first argument passed is a String, it will be displayed as a custom label instead of the default label 'Warn'.