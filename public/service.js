const myCache = "version-0";
const urltoCache = ["index.html", "offline.html"];
const self = this;

// ? install service worker
self.addEventListener("install", (event)=>{
    event.waitUntil(
        caches.open(myCache).then((cache)=>{
            console.log("open Cache", cache)
            return cache.addAll(urltoCache)
        })
    )
})




// ? listen request
self.addEventListener("fetch", (event)=>{
    event.respondWith(
        caches.match(event.request).then(()=>{
            return fetch(event.request).catch(()=>{caches.match("offline.html")})
        })
    )
})

// ? activate service worker
self.addEventListener("activate", (event)=>{
    const cacheWhitelist = []
    cacheWhitelist.push(myCache);
    event.waitUntil(
        caches.keys().then((cachenames)=>{
            Promise.all(
                cachenames.map((cachename)=>{
                    if(!cacheWhitelist.includes(cachename)){
                        return caches.delete(cachename);
                    }
                })
            )
        })
    )
})