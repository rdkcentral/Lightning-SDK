// Exposes the MAF namespace for apps.
var MAE = window.MAE || {};

function getSetting(key) {
	if (MAE && MAE.settings) return MAE.settings[key] !== undefined ? MAE.settings[key] : MAE[key];
}
function getter(obj, key, fn) { return obj.__defineGetter__(key, fn); }
function setter(obj, key, fn) { return obj.__defineSetter__(key, fn); }

(function() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '//jsonip.metrological.com/?maf=true');
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200 && xhr.responseText)
				MAF.GEO = JSON.parse(xhr.responseText);
		}
	}
	xhr.send();
}());

var Profile = (function () {
	function Profile(name) {
		getter(this, 'ageRating', function () {
			return getSetting('ageRating') || 0;
		});
		getter(this, 'uid', function() {
			return getSetting('uid') || false;
		})
		getter(this, 'household', function () {
			var uid = this.uid;
			return uid;
		});
		getter(this, 'operator', function () {
			return getSetting('operator') || 'metrological';
		});
		getter(this, 'platform', function () {
			return getSetting('platform') || 'WPEplugin';
		});
		getter(this, 'packages', function () {
			return [];
		});
		getter(this, 'country', function () {
			return getSetting('country') ||  MAF.GEO && MAF.GEO.geo && MAF.GEO.geo.country || 'nl';
		});
		getter(this, 'language', function () {
			return getSetting('language') || 'en';
		});
		getter(this, 'city', function () {
			return MAF.GEO && MAF.GEO.geo && MAF.GEO.geo.city;
		});
		getter(this, 'latlon', function () {
			return MAF.GEO && MAF.GEO.geo && MAF.GEO.geo.ll || [];
		});
		getter(this, 'ip', function () {
			return MAF.GEO && (MAF.GEO.ip || MAF.GEO.wan) || '127.0.0.1';
		});
		getter(this, 'mac', function () {
			return '00:00:00:00:00:00';
		});
		getter(this, 'locale', function () {
			return this.language + '-' + this.country.toUpperCase();
		});
		getter(this, 'stbType', function() {
			return 'unknown';
		});
	}

	return Profile;
})();

var Purchase = (function() {
	function send(json, callback) {
		var appData = new XMLHttpRequest();
		appData.open('GET', './metadata.json', false);
		appData.onreadystatechange = function () {
			if (appData.readyState === 4 && appData.status === 200) {
				if (appData.status === 200) {
					var metadata = JSON.parse(appData.responseText) || {},
						purchaseData = JSON.stringify({
							purchase: json || {},
							identifier: metadata.identifier,
							name: metadata.name,
							household: MAF.Profile.household,
							country: MAF.Profile.country.toLowerCase(),
							operator: MAF.Profile.operator.toLowerCase(),
							mac: MAF.Profile.mac,
							type: 'in-app'
						});

					var xhr = new XMLHttpRequest();
					xhr.open('POST', 'https://payment-sdk.metrological.com/');
					xhr.setRequestHeader('Content-Type','application/json; charset=UTF-8');
					xhr.onreadystatechange = function () {
						if (xhr.readyState === 4) {
							if (xhr.status === 200) {
								var result = JSON.parse(xhr.responseText) || {};
								if (callback && callback.call) {
									if (result.errors && result.errors.length > 0)
										return callback(result.errors);
									return callback(null, result);
								}
							} else {
								if (callback && callback.call) callback(JSON.parse(xhr.response) || 'invalid');
							}
						}
					}
					xhr.send(purchaseData);
				}
			}
		}
		appData.send();	
	}

	function confirm(transaction, callback) {
		var confirmData = JSON.stringify({
			transactionId: transaction.result.transactionId
		});

		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'https://payment-sdk.metrological.com/confirm');
		xhr.setRequestHeader('Content-Type','application/json; charset=UTF-8');
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					var result = JSON.parse(xhr.responseText) || {};
					if (callback && callback.call) {
						if (result.errors && result.errors.length > 0)
							return callback(result.errors);
						return callback(null, result);
					}
				} else {
					if (callback && callback.call) callback(['invalid']);
				}
			}
		}
		xhr.send(confirmData);
	}

	return {
		send: send,
		confirm: confirm
	}
}());

var maf = {
	Profile,
	Purchase
};

if (typeof window !== "undefined") {
	window.MAF = maf;
	MAF.Profile = new Profile();
}

export default MAF;
