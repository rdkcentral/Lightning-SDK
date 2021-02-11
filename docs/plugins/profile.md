# Profile


Occasionally, your App requires profile information about the current user. This information is usually provided by the operator or platform.


Because each operator or platform might implement user profile information in a different way, the Lightning SDK provides the *Profile* plugin. This plugin is a generic interface for developers, independent of any operator or platform.


You can also use the Profile plugin to *update* profile information.

## Usage


If you need Profile information, import the Profile plugin from the Lightning SDK:


```
import { Profile } from '@lightningjs/sdk'
```

## Available Methods


If you call one of the methods below *without* parameters, it returns the Profile information in the form of a *promise*. If you pass parameters, the method *updates* the Profile information.

### ageRating()


Gets the user's age rating. Returns `adult` by default during *local development*.


```
Profile.ageRating()
```

### city()


Gets the user's city. Returns `New York` by default during *local development*.


```
Profile.city()
```

### zipCode()


Gets the user's zip code. Returns `27505` by default during *local development*.


```
Profile.zipCode()
```

### countryCode()


Gets the user's country code. Returns `US` by default during *local development*.


```
Profile.countryCode()
```

### ip()


Gets the user's IP address. Returns `127.0.0.1` by default during *local development*.


```
Profile.ip()
```

### household()


Gets the user's household ID. Returns `b2244e9d4c04826ccd5a7b2c2a50e7d4` by default during *local development*.


```
Profile.household()
```

### language()


Gets the user's mother language. During *local development*, it attempts to return the browser's language with `en` as default.


```
Profile.language()
```

### latLon()


Gets the user's latitude and longitude.


During *local development*, it returns the user's actual latitude and longitude from a remote API service. If unsuccessful, it defaults to `[40.7128, 74.006]`.


If, during *local development*, you want to force to use the browser's built-in *geolocation* for retrieving the latitude and longitude, add the key `forceBrowserGeolocation` with the value 'true' as a Platform Setting in **settings.json**.


```
Profile.latLon()
```

### locale()


Gets the user's locale. During *local development*, it returns the browser's locale, with a fallback to `en-US`.


```
Profile.locale()
```

### mac()


Gets the user's Mac address. Returns `00:00:00:00:00:00` by default during *local development*.


```
Profile.mac()
```

### operator()


Gets the user's operator. Returns `Metrological` by default during *local development*.


```
Profile.operator()
```

### platform()


Gets the user's platform. Returns `Metrological` by default during *local development*.


```
Profile.platform()
```

### packages()


Gets the user's packages. Returns `[]` by default during *local development*.


```
Profile.packages()
```

### uid


Gets the user ID. Returns `ee6723b8-7ab3-462c-8d93-dbf61227998e` by default during *local development*.


```
Profile.uid()
```

### stbType


Gets the user's STB type. Returns `Metrological` by default during *local development*.


```
Profile.stbType()
```

## Overwriting Default Values


During development you might want to test your App with different profile values (for example, a different language or age rating).
When you want to overwrite the default values, you can do so by editing the **settings.json** file.
Add a `profile` key in `platformSettings` and only add the values you wish to change here.


```
{
  "platformSettings": {
      "profile": {
         "ageRating": "adult",
         "city": "New York",
         "zipCode": "27505",
         "countryCode": "US",
         "ip": "127.0.0.1",
         "household": "b2244e9d4c04826ccd5a7b2c2a50e7d4",
         "language": "en",
         "latlon": [40.7128, 74.006],
         "locale": "en-US",
         "mac": "00:00:00:00:00:00",
         "operator": "Metrological",
         "platform": "Metrological",
         "packages": [],
         "uid": "ee6723b8-7ab3-462c-8d93-dbf61227998e",
         "stbType": "Metrological"
      }
   }
}
```