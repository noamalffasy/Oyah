"use strict";var precacheConfig=[["static/css/App.css","40f5352e75069cd15765e577abae0d7b"],["static/css/bootstrap.min.css","450fc463b8b1a349df717056fbb3e078"],["static/favicons/android-icon-144x144.png","dd9ab2b2821e957fffead9b3b8b99aa6"],["static/favicons/android-icon-192x192.png","e809055c7ffd1856663546f9fdb7d2d2"],["static/favicons/android-icon-36x36.png","c9c61bb21598776f4ffd14d025ab07a7"],["static/favicons/android-icon-48x48.png","896351d3afbdd91cc62bccd7aa64d7b0"],["static/favicons/android-icon-72x72.png","8bf2bfc0de882fda6e9e8bbc6d0b89c3"],["static/favicons/android-icon-96x96.png","b0ebfb09f2ae9ff6e93e40596ea2432e"],["static/favicons/apple-icon-114x114.png","7c23073e54d0b6d0702d86add34372e3"],["static/favicons/apple-icon-120x120.png","ba8439a17b8a08488e6021bc3a223c12"],["static/favicons/apple-icon-144x144.png","dd9ab2b2821e957fffead9b3b8b99aa6"],["static/favicons/apple-icon-152x152.png","9fcf9c5322302a6becc27ce4fd6813c2"],["static/favicons/apple-icon-180x180.png","f4fbf8215a0ac853604a64367f84bdfa"],["static/favicons/apple-icon-57x57.png","0db25b46348f247505b43fa450c7f3da"],["static/favicons/apple-icon-60x60.png","e3be994bc26f907c268675c2ec8abe9d"],["static/favicons/apple-icon-72x72.png","8bf2bfc0de882fda6e9e8bbc6d0b89c3"],["static/favicons/apple-icon-76x76.png","c198843a22a46f43abde3fdf0bc6e3cb"],["static/favicons/apple-icon-precomposed.png","c8116977f694b4ac478c823d55ea4a34"],["static/favicons/apple-icon.png","c8116977f694b4ac478c823d55ea4a34"],["static/favicons/browserconfig.xml","653d077300a12f09a69caeea7a8947f8"],["static/favicons/favicon-16x16.png","a475a76e0d062fe7f5a6f7d959e6d0aa"],["static/favicons/favicon-32x32.png","c3804e61d21d8ac88017c2ea925121ce"],["static/favicons/favicon-96x96.png","b0ebfb09f2ae9ff6e93e40596ea2432e"],["static/favicons/favicon.ico","1d566c81389752bcc00d6ab3ea8c652a"],["static/favicons/ms-icon-144x144.png","dd9ab2b2821e957fffead9b3b8b99aa6"],["static/favicons/ms-icon-150x150.png","b2b0e13d371c174d71d728b955da8cf0"],["static/favicons/ms-icon-310x310.png","13230d91cb611d9cd63eb0da6ad8b637"],["static/favicons/ms-icon-70x70.png","172566a82367ae4e85bc359da69452ab"],["static/img/Arrow.svg","13e1b92d5dc64d6aa665ad09aa6894fa"],["static/img/NotFound.png","a00054a40061f14869f289ea089eed18"],["static/img/User.png","7089ba47a44e9c18e431351fd5aacfde"],["static/img/arrow.png","5a64889f03f24f9f20868c69efec9562"],["static/img/articles/1643ce8e-ef40-4b7d-a8dc-60875fa33c52/main.jpeg","5ce628040ac9ecb7ee055a8ebd85b60e"],["static/img/articles/1643ce8e-ef40-4b7d-a8dc-60875fa33c52/main_small.jpeg","f946532db12bf68e98f1cbbbf8ed99fe"],["static/img/articles/21903/main.jpeg","225cd30476664bf3a38f0e2d296c3f6e"],["static/img/articles/21903/main_small.jpeg","f52d7d822eaa1635455436dc6310fb52"],["static/img/articles/3717a756-6a2b-4d69-bb92-f9ebff79cf6b/main.jpeg","702f522caa25a192c66b7a5604eb2f58"],["static/img/articles/3717a756-6a2b-4d69-bb92-f9ebff79cf6b/main_small.jpeg","14d06b0f1d1e2a32c38b9ec23d101ef5"],["static/img/articles/421e74fc-8d3e-4318-aff1-ca91802b8955/H16hbKbiz.jpeg","930b354d44b8f239a9ad5501f3278b93"],["static/img/articles/421e74fc-8d3e-4318-aff1-ca91802b8955/H16hbKbiz_small.jpeg","c738ed75a63716b356ca0eaa917d1214"],["static/img/articles/421e74fc-8d3e-4318-aff1-ca91802b8955/HyIFq4zsz.jpeg","930b354d44b8f239a9ad5501f3278b93"],["static/img/articles/421e74fc-8d3e-4318-aff1-ca91802b8955/HyIFq4zsz_small.jpeg","c738ed75a63716b356ca0eaa917d1214"],["static/img/articles/421e74fc-8d3e-4318-aff1-ca91802b8955/main.jpeg","930b354d44b8f239a9ad5501f3278b93"],["static/img/articles/421e74fc-8d3e-4318-aff1-ca91802b8955/main_small.jpeg","c738ed75a63716b356ca0eaa917d1214"],["static/img/articles/5aae57c8-11ae-4330-b306-add74930ea1c/main.jpeg","930b354d44b8f239a9ad5501f3278b93"],["static/img/articles/5aae57c8-11ae-4330-b306-add74930ea1c/main_small.jpeg","c738ed75a63716b356ca0eaa917d1214"],["static/img/articles/72867/main.jpeg","225cd30476664bf3a38f0e2d296c3f6e"],["static/img/articles/72867/main_small.jpeg","3618fb577244761537bde439c5c571d6"],["static/img/articles/94fa7767-2986-4e94-86b0-2e7ac6323160/main.jpeg","6ac178202573ee00895891ad7fb48431"],["static/img/articles/94fa7767-2986-4e94-86b0-2e7ac6323160/main_small.jpeg","cee875cad4a0d4ced84db7b7b9a90640"],["static/img/articles/a6ca35d6-45d3-4ceb-a865-d78c67cfc99b/main.jpeg","a418ffd949b3ab1916f5aa094c64ebd5"],["static/img/articles/a6ca35d6-45d3-4ceb-a865-d78c67cfc99b/main_small.jpeg","0722126a090c75bfbda8e0506bbf778c"],["static/img/articles/b13021bd-00a5-47a0-9da6-9483ddce896d/main.jpeg","b2582e55e5bf729ed70efb603df2072a"],["static/img/articles/b13021bd-00a5-47a0-9da6-9483ddce896d/main_small.jpeg","7be6ae6a6b81805d33e7e59c0b26a407"],["static/img/more.svg","6fe3a6451d3bd4a2567f8e583670ab9c"],["static/img/users/user-#1.jpeg","4ca0fffced748a3acb55ec32b5922b42"],["static/img/users/user-#1.png","fa41605484af531f6f5bb72ee6865550"],["static/img/users/user-#1_small.jpeg","6e32db547f7c0b2a20bab667db30b900"],["static/img/users/user-#1_small.png","14e68436eee0f0c73b3f6eed32d7e558"],["static/img/users/user-#2.png","f9fcc17a89e3adfc65731e665ad40941"],["static/js/bootstrap.bundle.min.js","98d2c1da1c0a495f8fc8ad144ea1d3d2"],["static/js/jquery.min.js","99b0a83cf1b0b1e2cb16041520e87641"],["static/js/popper.min.js","70d3fda195602fe8b75e0097eed74dde"],["static/policies/privacy.md","526173b2a66a8d409bae7b1a0982d076"],["static/policies/terms.md","92c4194d192adb15438c5729ed7a4546"],["static/sw.js","86084df6eccfdb7137ffd4f03e64568f"]],cacheName="sw-precache-v3-oyah-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var n=new URL(e);return"/"===n.pathname.slice(-1)&&(n.pathname+=t),n.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(t){return new Response(t,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,t,n,r){var a=new URL(e);return r&&a.pathname.match(r)||(a.search+=(a.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(n)),a.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var n=new URL(t).pathname;return e.some(function(e){return n.match(e)})},stripIgnoredUrlParameters=function(e,t){var n=new URL(e);return n.hash="",n.search=n.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return t.every(function(t){return!t.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),n.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],n=e[1],r=new URL(t,self.location),a=createCacheKey(r,hashParamName,n,!1);return[r.toString(),a]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(n){if(!t.has(n)){var r=new Request(n,{credentials:"same-origin"});return fetch(r).then(function(t){if(!t.ok)throw new Error("Request for "+n+" returned a response with status "+t.status);return cleanResponse(t).then(function(t){return e.put(n,t)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(n){return Promise.all(n.map(function(n){if(!t.has(n.url))return e.delete(n)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var t,n=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching);(t=urlsToCacheKeys.has(n))||(n=addDirectoryIndex(n,"index.html"),t=urlsToCacheKeys.has(n));0,t&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(n)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(t){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,t),fetch(e.request)}))}}),function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).toolbox=e()}}(function(){return function e(t,n,r){function a(o,i){if(!n[o]){if(!t[o]){var s="function"==typeof require&&require;if(!i&&s)return s(o,!0);if(c)return c(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var u=n[o]={exports:{}};t[o][0].call(u.exports,function(e){var n=t[o][1][e];return a(n||e)},u,u.exports,e,t,n,r)}return n[o].exports}for(var c="function"==typeof require&&require,o=0;o<r.length;o++)a(r[o]);return a}({1:[function(e,t,n){function r(e,t){((t=t||{}).debug||s.debug)&&console.log("[sw-toolbox] "+e)}function a(e){var t;return e&&e.cache&&(t=e.cache.name),t=t||s.cache.name,caches.open(t)}function c(e,t,n){var a=e.url,c=n.maxAgeSeconds,o=n.maxEntries,i=n.name,s=Date.now();return r("Updating LRU order for "+a+". Max entries is "+o+", max age is "+c),f.getDb(i).then(function(e){return f.setTimestampForUrl(e,a,s)}).then(function(e){return f.expireEntries(e,o,c,s)}).then(function(e){r("Successfully updated IDB.");var n=e.map(function(e){return t.delete(e)});return Promise.all(n).then(function(){r("Done with cache cleanup.")})}).catch(function(e){r(e)})}function o(e){var t=Array.isArray(e);if(t&&e.forEach(function(e){"string"==typeof e||e instanceof Request||(t=!1)}),!t)throw new TypeError("The precache method expects either an array of strings and/or Requests or a Promise that resolves to an array of strings and/or Requests.");return e}var i,s=e("./options"),f=e("./idb-cache-expiration");t.exports={debug:r,fetchAndCache:function(e,t){var n=(t=t||{}).successResponses||s.successResponses;return fetch(e.clone()).then(function(r){return"GET"===e.method&&n.test(r.status)&&a(t).then(function(n){n.put(e,r).then(function(){var r=t.cache||s.cache;(r.maxEntries||r.maxAgeSeconds)&&r.name&&function(e,t,n){var r=c.bind(null,e,t,n);i=i?i.then(r):r()}(e,n,r)})}),r.clone()})},openCache:a,renameCache:function(e,t,n){return r("Renaming cache: ["+e+"] to ["+t+"]",n),caches.delete(t).then(function(){return Promise.all([caches.open(e),caches.open(t)]).then(function(t){var n=t[0],r=t[1];return n.keys().then(function(e){return Promise.all(e.map(function(e){return n.match(e).then(function(t){return r.put(e,t)})}))}).then(function(){return caches.delete(e)})})})},cache:function(e,t){return a(t).then(function(t){return t.add(e)})},uncache:function(e,t){return a(t).then(function(t){return t.delete(e)})},precache:function(e){e instanceof Promise||o(e),s.preCacheItems=s.preCacheItems.concat(e)},validatePrecacheInput:o,isResponseFresh:function(e,t,n){if(!e)return!1;if(t){var r=e.headers.get("date");if(r&&new Date(r).getTime()+1e3*t<n)return!1}return!0}}},{"./idb-cache-expiration":2,"./options":4}],2:[function(e,t,n){var r="sw-toolbox-",a=1,c="store",o="url",i="timestamp",s={};t.exports={getDb:function(e){return e in s||(s[e]=function(e){return new Promise(function(t,n){var s=indexedDB.open(r+e,a);s.onupgradeneeded=function(){s.result.createObjectStore(c,{keyPath:o}).createIndex(i,i,{unique:!1})},s.onsuccess=function(){t(s.result)},s.onerror=function(){n(s.error)}})}(e)),s[e]},setTimestampForUrl:function(e,t,n){return new Promise(function(r,a){var o=e.transaction(c,"readwrite");o.objectStore(c).put({url:t,timestamp:n}),o.oncomplete=function(){r(e)},o.onabort=function(){a(o.error)}})},expireEntries:function(e,t,n,r){return function(e,t,n){return t?new Promise(function(r,a){var s=1e3*t,f=[],u=e.transaction(c,"readwrite"),p=u.objectStore(c);p.index(i).openCursor().onsuccess=function(e){var t=e.target.result;if(t&&n-s>t.value[i]){var r=t.value[o];f.push(r),p.delete(r),t.continue()}},u.oncomplete=function(){r(f)},u.onabort=a}):Promise.resolve([])}(e,n,r).then(function(n){return function(e,t){return t?new Promise(function(n,r){var a=[],s=e.transaction(c,"readwrite"),f=s.objectStore(c),u=f.index(i),p=u.count();u.count().onsuccess=function(){var e=p.result;e>t&&(u.openCursor().onsuccess=function(n){var r=n.target.result;if(r){var c=r.value[o];a.push(c),f.delete(c),e-a.length>t&&r.continue()}})},s.oncomplete=function(){n(a)},s.onabort=r}):Promise.resolve([])}(e,t).then(function(e){return n.concat(e)})})}}},{}],3:[function(e,t,n){function r(e){return e.reduce(function(e,t){return e.concat(t)},[])}e("serviceworker-cache-polyfill");var a=e("./helpers"),c=e("./router"),o=e("./options");t.exports={fetchListener:function(e){var t=c.match(e.request);t?e.respondWith(t(e.request)):c.default&&"GET"===e.request.method&&0===e.request.url.indexOf("http")&&e.respondWith(c.default(e.request))},activateListener:function(e){a.debug("activate event fired");var t=o.cache.name+"$$$inactive$$$";e.waitUntil(a.renameCache(t,o.cache.name))},installListener:function(e){var t=o.cache.name+"$$$inactive$$$";a.debug("install event fired"),a.debug("creating cache ["+t+"]"),e.waitUntil(a.openCache({cache:{name:t}}).then(function(e){return Promise.all(o.preCacheItems).then(r).then(a.validatePrecacheInput).then(function(t){return a.debug("preCache list: "+(t.join(", ")||"(none)")),e.addAll(t)})}))}}},{"./helpers":1,"./options":4,"./router":6,"serviceworker-cache-polyfill":16}],4:[function(e,t,n){var r;r=self.registration?self.registration.scope:self.scope||new URL("./",self.location).href,t.exports={cache:{name:"$$$toolbox-cache$$$"+r+"$$$",maxAgeSeconds:null,maxEntries:null},debug:!1,networkTimeoutSeconds:null,preCacheItems:[],successResponses:/^0|([123]\d\d)|(40[14567])|410$/}},{}],5:[function(e,t,n){var r=new URL("./",self.location).pathname,a=e("path-to-regexp"),c=function(e,t,n,c){t instanceof RegExp?this.fullUrlRegExp=t:(0!==t.indexOf("/")&&(t=r+t),this.keys=[],this.regexp=a(t,this.keys)),this.method=e,this.options=c,this.handler=n};c.prototype.makeHandler=function(e){var t;if(this.regexp){var n=this.regexp.exec(e);t={},this.keys.forEach(function(e,r){t[e.name]=n[r+1]})}return function(e){return this.handler(e,t,this.options)}.bind(this)},t.exports=c},{"path-to-regexp":15}],6:[function(e,t,n){var r=e("./route"),a=e("./helpers"),c=function(e,t){for(var n=e.entries(),r=n.next(),a=[];!r.done;){new RegExp(r.value[0]).test(t)&&a.push(r.value[1]),r=n.next()}return a},o=function(){this.routes=new Map,this.routes.set(RegExp,new Map),this.default=null};["get","post","put","delete","head","any"].forEach(function(e){o.prototype[e]=function(t,n,r){return this.add(e,t,n,r)}}),o.prototype.add=function(e,t,n,c){var o;c=c||{},t instanceof RegExp?o=RegExp:o=(o=c.origin||self.location.origin)instanceof RegExp?o.source:function(e){return e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}(o),e=e.toLowerCase();var i=new r(e,t,n,c);this.routes.has(o)||this.routes.set(o,new Map);var s=this.routes.get(o);s.has(e)||s.set(e,new Map);var f=s.get(e),u=i.regexp||i.fullUrlRegExp;f.has(u.source)&&a.debug('"'+t+'" resolves to same regex as existing route.'),f.set(u.source,i)},o.prototype.matchMethod=function(e,t){var n=new URL(t),r=n.origin,a=n.pathname;return this._match(e,c(this.routes,r),a)||this._match(e,[this.routes.get(RegExp)],t)},o.prototype._match=function(e,t,n){if(0===t.length)return null;for(var r=0;r<t.length;r++){var a=t[r],o=a&&a.get(e.toLowerCase());if(o){var i=c(o,n);if(i.length>0)return i[0].makeHandler(n)}}return null},o.prototype.match=function(e){return this.matchMethod(e.method,e.url)||this.matchMethod("any",e.url)},t.exports=new o},{"./helpers":1,"./route":5}],7:[function(e,t,n){var r=e("../options"),a=e("../helpers");t.exports=function(e,t,n){return n=n||{},a.debug("Strategy: cache first ["+e.url+"]",n),a.openCache(n).then(function(t){return t.match(e).then(function(t){var c=n.cache||r.cache,o=Date.now();return a.isResponseFresh(t,c.maxAgeSeconds,o)?t:a.fetchAndCache(e,n)})})}},{"../helpers":1,"../options":4}],8:[function(e,t,n){var r=e("../options"),a=e("../helpers");t.exports=function(e,t,n){return n=n||{},a.debug("Strategy: cache only ["+e.url+"]",n),a.openCache(n).then(function(t){return t.match(e).then(function(e){var t=n.cache||r.cache,c=Date.now();if(a.isResponseFresh(e,t.maxAgeSeconds,c))return e})})}},{"../helpers":1,"../options":4}],9:[function(e,t,n){var r=e("../helpers"),a=e("./cacheOnly");t.exports=function(e,t,n){return r.debug("Strategy: fastest ["+e.url+"]",n),new Promise(function(c,o){var i=!1,s=[],f=function(e){s.push(e.toString()),i?o(new Error('Both cache and network failed: "'+s.join('", "')+'"')):i=!0},u=function(e){e instanceof Response?c(e):f("No result returned")};r.fetchAndCache(e.clone(),n).then(u,f),a(e,t,n).then(u,f)})}},{"../helpers":1,"./cacheOnly":8}],10:[function(e,t,n){t.exports={networkOnly:e("./networkOnly"),networkFirst:e("./networkFirst"),cacheOnly:e("./cacheOnly"),cacheFirst:e("./cacheFirst"),fastest:e("./fastest")}},{"./cacheFirst":7,"./cacheOnly":8,"./fastest":9,"./networkFirst":11,"./networkOnly":12}],11:[function(e,t,n){var r=e("../options"),a=e("../helpers");t.exports=function(e,t,n){var c=(n=n||{}).successResponses||r.successResponses,o=n.networkTimeoutSeconds||r.networkTimeoutSeconds;return a.debug("Strategy: network first ["+e.url+"]",n),a.openCache(n).then(function(t){var i,s,f=[];if(o){var u=new Promise(function(c){i=setTimeout(function(){t.match(e).then(function(e){var t=n.cache||r.cache,o=Date.now(),i=t.maxAgeSeconds;a.isResponseFresh(e,i,o)&&c(e)})},1e3*o)});f.push(u)}var p=a.fetchAndCache(e,n).then(function(e){if(i&&clearTimeout(i),c.test(e.status))return e;throw a.debug("Response was an HTTP error: "+e.statusText,n),s=e,new Error("Bad response")}).catch(function(r){return a.debug("Network or response error, fallback to cache ["+e.url+"]",n),t.match(e).then(function(e){if(e)return e;if(s)return s;throw r})});return f.push(p),Promise.race(f)})}},{"../helpers":1,"../options":4}],12:[function(e,t,n){var r=e("../helpers");t.exports=function(e,t,n){return r.debug("Strategy: network only ["+e.url+"]",n),fetch(e)}},{"../helpers":1}],13:[function(e,t,n){var r=e("./options"),a=e("./router"),c=e("./helpers"),o=e("./strategies"),i=e("./listeners");c.debug("Service Worker Toolbox is loading"),self.addEventListener("install",i.installListener),self.addEventListener("activate",i.activateListener),self.addEventListener("fetch",i.fetchListener),t.exports={networkOnly:o.networkOnly,networkFirst:o.networkFirst,cacheOnly:o.cacheOnly,cacheFirst:o.cacheFirst,fastest:o.fastest,router:a,options:r,cache:c.cache,uncache:c.uncache,precache:c.precache}},{"./helpers":1,"./listeners":3,"./options":4,"./router":6,"./strategies":10}],14:[function(e,t,n){t.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},{}],15:[function(e,t,n){function r(e,t){for(var n,r=[],a=0,c=0,o="",f=t&&t.delimiter||"/";null!=(n=h.exec(e));){var u=n[0],p=n[1],d=n.index;if(o+=e.slice(c,d),c=d+u.length,p)o+=p[1];else{var l=e[c],b=n[2],m=n[3],g=n[4],v=n[5],x=n[6],w=n[7];o&&(r.push(o),o="");var y=null!=b&&null!=l&&l!==b,E="+"===x||"*"===x,R="?"===x||"*"===x,j=n[2]||f,C=g||v;r.push({name:m||a++,prefix:b||"",delimiter:j,optional:R,repeat:E,partial:y,asterisk:!!w,pattern:C?s(C):w?".*":"[^"+i(j)+"]+?"})}}return c<e.length&&(o+=e.substr(c)),o&&r.push(o),r}function a(e){return encodeURI(e).replace(/[\/?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function c(e){return encodeURI(e).replace(/[?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function o(e){for(var t=new Array(e.length),n=0;n<e.length;n++)"object"==typeof e[n]&&(t[n]=new RegExp("^(?:"+e[n].pattern+")$"));return function(n,r){for(var o="",i=n||{},s=(r||{}).pretty?a:encodeURIComponent,f=0;f<e.length;f++){var u=e[f];if("string"!=typeof u){var p,d=i[u.name];if(null==d){if(u.optional){u.partial&&(o+=u.prefix);continue}throw new TypeError('Expected "'+u.name+'" to be defined')}if(l(d)){if(!u.repeat)throw new TypeError('Expected "'+u.name+'" to not repeat, but received `'+JSON.stringify(d)+"`");if(0===d.length){if(u.optional)continue;throw new TypeError('Expected "'+u.name+'" to not be empty')}for(var h=0;h<d.length;h++){if(p=s(d[h]),!t[f].test(p))throw new TypeError('Expected all "'+u.name+'" to match "'+u.pattern+'", but received `'+JSON.stringify(p)+"`");o+=(0===h?u.prefix:u.delimiter)+p}}else{if(p=u.asterisk?c(d):s(d),!t[f].test(p))throw new TypeError('Expected "'+u.name+'" to match "'+u.pattern+'", but received "'+p+'"');o+=u.prefix+p}}else o+=u}return o}}function i(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function s(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function f(e,t){return e.keys=t,e}function u(e){return e.sensitive?"":"i"}function p(e,t,n){l(t)||(n=t||n,t=[]);for(var r=(n=n||{}).strict,a=!1!==n.end,c="",o=0;o<e.length;o++){var s=e[o];if("string"==typeof s)c+=i(s);else{var p=i(s.prefix),d="(?:"+s.pattern+")";t.push(s),s.repeat&&(d+="(?:"+p+d+")*"),c+=d=s.optional?s.partial?p+"("+d+")?":"(?:"+p+"("+d+"))?":p+"("+d+")"}}var h=i(n.delimiter||"/"),b=c.slice(-h.length)===h;return r||(c=(b?c.slice(0,-h.length):c)+"(?:"+h+"(?=$))?"),c+=a?"$":r&&b?"":"(?="+h+"|$)",f(new RegExp("^"+c,u(n)),t)}function d(e,t,n){return l(t)||(n=t||n,t=[]),n=n||{},e instanceof RegExp?function(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return f(e,t)}(e,t):l(e)?function(e,t,n){for(var r=[],a=0;a<e.length;a++)r.push(d(e[a],t,n).source);return f(new RegExp("(?:"+r.join("|")+")",u(n)),t)}(e,t,n):function(e,t,n){return p(r(e,n),t,n)}(e,t,n)}var l=e("isarray");t.exports=d,t.exports.parse=r,t.exports.compile=function(e,t){return o(r(e,t))},t.exports.tokensToFunction=o,t.exports.tokensToRegExp=p;var h=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g")},{isarray:14}],16:[function(e,t,n){!function(){var e=Cache.prototype.addAll,t=navigator.userAgent.match(/(Firefox|Chrome)\/(\d+\.)/);if(t)var n=t[1],r=parseInt(t[2]);e&&(!t||"Firefox"===n&&r>=46||"Chrome"===n&&r>=50)||(Cache.prototype.addAll=function(e){function t(e){this.name="NetworkError",this.code=19,this.message=e}var n=this;return t.prototype=Object.create(Error.prototype),Promise.resolve().then(function(){if(arguments.length<1)throw new TypeError;return e=e.map(function(e){return e instanceof Request?e:String(e)}),Promise.all(e.map(function(e){"string"==typeof e&&(e=new Request(e));var n=new URL(e.url).protocol;if("http:"!==n&&"https:"!==n)throw new t("Invalid scheme");return fetch(e.clone())}))}).then(function(r){if(r.some(function(e){return!e.ok}))throw new t("Incorrect response status");return Promise.all(r.map(function(t,r){return n.put(e[r],t)}))}).then(function(){})},Cache.prototype.add=function(e){return this.addAll([e])})}()},{}]},{},[13])(13)}),toolbox.router.get(/[.](.[[png|jpg|jpeg|css]])/,toolbox.fastest,{}),toolbox.router.get(/^http.*/,toolbox.networkFirst,{}),toolbox.router.get(/^https:\/\/storage\.googleapis\.com\/oyah.xyz\//,toolbox.cacheFirst,{});