const staticTPACalc = "dev-tpa-site-1"
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "/images/logo.svg",
  "/images/carbs.svg",
  "/images/logo.png",
  "images/favicon.ico",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticTPACalc).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })