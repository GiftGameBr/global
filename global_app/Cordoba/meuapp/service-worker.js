// Nome da versão do cache - incremente a cada atualização do app
const CACHE_VERSION = "v3";
const STATIC_CACHE = `app-static-cache-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `app-dynamic-cache-${CACHE_VERSION}`;
const EXTERNAL_CACHE = "external-cache-v1";

// Lista de arquivos locais para cache estático (cache-first)
const STATIC_ASSETS = [
  "/account.html",
  "/add-lead.html",
  "/boletos.html",
  "/contrato.html",
  "/dataCollect.html",
  "/homeScreen.html",
  "/index.html",
  "/let-you-screen.html",
  "/profile.html",
  "/service.html",
  "/solicitacoes.html",
  "/solicitar-avaliacao.html",
  "/solicitar-comercializacao.html",
  "/solicitar-custeio.html",
  "/solicitar-investimento.html",
  "/solicitar-licenciamento.html",
  "/splash.html",
  "/upload-documentos.html",
  "/assets/css/bootstrap.min.css",
  "/assets/css/custom-popup.css",
  "/assets/css/intlTelInput.css",
  "/assets/css/media_query.css",
  "/assets/css/slick.css",
  "/assets/css/style.css",
  "/assets/css/swap.css",
  "/assets/javascript/audio-song-play.js",
  "/assets/javascript/bootstrap.min.js",
  "/assets/javascript/cal.min.js",
  "/assets/javascript/custom-popup.js",
  "/assets/javascript/jquery.js",
  "/assets/javascript/script.js",
  "/assets/javascript/slick.min.js",
  "/assets/javascript/spectrum-music.js",
  "/assets/js/auth.js",
  "/assets/js/comercializacao.js",
  "/assets/js/custeio.js",
  "/assets/js/dataCollect.js",
  "/assets/js/docs.js",
  "/assets/js/investimento.js",
  "/assets/js/profileVerification.js",
  "/auth/callback.html",
  // Liste aqui todos os arquivos locais estáticos importantes

  "/assets/images/card1.jpg",
  "/assets/images/card10.jpg",
  "/assets/images/card11.jpg",
  "/assets/images/card12.jpg",
  "/assets/images/card13.jpg",
  "/assets/images/card14.jpg",
  "/assets/images/card2.jpg",
  "/assets/images/card20.jpg",
  "/assets/images/card21.jpg",
  "/assets/images/card3.jpg",
  "/assets/images/card4.jpg",
  "/assets/images/card5.jpg",
  "/assets/images/card6.jpg",
  "/assets/images/card7.jpg",
  "/assets/images/card8.jpg",
  "/assets/images/card9.jpg",
  "/assets/images/custeios.jpg",
  "/assets/images/logo.png",
  "/assets/images/logog.png",
  "/assets/images/logop.png",
  "/assets/images/logo_g.svg",
  "/assets/images/account-profile/account-img.jpg",
  "/assets/images/account-profile/profile-img.jpg",
  "/assets/images/add-new-card/card-img.png",
  "/assets/images/add-new-card/visa-icon.png",
  "/assets/images/finger-print-screen/fingerPrint.png",
  "/assets/images/finger-print-screen/FingerPrintBorder.png",
  "/assets/images/home-screen/callMe.png",
  "/assets/images/home-screen/country.jpg",
  "/assets/images/home-screen/crown.png",
  "/assets/images/home-screen/ellipse.png",
  "/assets/images/home-screen/facebook.png",

  "/assets/images/splash-screen/backgroundimg.png",
  "/assets/images/splash-screen/onbording-img1.jpg",
  "/assets/images/splash-screen/onbording-img2.jpg",
  "/assets/images/splash-screen/onbording-img3.jpg",
  "/assets/images/svg/aboutVoice.svg",
  "/assets/images/svg/acc-edit.svg",
  "/assets/images/svg/acc-icon.png",
  "/assets/images/svg/acc-icon.svg",
  "/assets/images/svg/accountAlert.svg",
  "/assets/images/svg/alert-circle.svg",
  "/assets/images/svg/APAY.svg",
  "/assets/images/svg/apple.svg",
  "/assets/images/svg/ApplePay.svg",
  "/assets/images/svg/arrow-down.svg",
  "/assets/images/svg/arrow-right.svg",
  "/assets/images/svg/back-btn-top.svg",
  "/assets/images/svg/banco-do-brasil-logo.svg",
  "/assets/images/svg/bell.png",
  "/assets/images/svg/bigLockSvg.svg",
  "/assets/images/svg/billing.svg",
  "/assets/images/svg/button-drag.svg",
  "/assets/images/svg/buttonClose.svg",
  "/assets/images/svg/buttonMore.svg",
  "/assets/images/svg/buttonNotification.svg",
  "/assets/images/svg/buttonSettings.svg",
  "/assets/images/svg/calendar.svg",
  "/assets/images/svg/camera.svg",
  "/assets/images/svg/card-img.svg",
  "/assets/images/svg/check-circle.svg",
  "/assets/images/svg/check.svg",
  "/assets/images/svg/circle-pause-btn.svg",
  "/assets/images/svg/circle-play-btn.svg",
  "/assets/images/svg/circledropdown.svg",
  "/assets/images/svg/close-setting-icon.svg",
  "/assets/images/svg/contactUs-icon.svg",
  "/assets/images/svg/credito-icon.svg",
  "/assets/images/svg/crowen-sm.svg",
  "/assets/images/svg/crowen-yellow.svg",
  "/assets/images/svg/damessaeha.svg",
  "/assets/images/svg/dataPrivacy-icon.svg",
  "/assets/images/svg/delete.svg",
  "/assets/images/svg/down-arrow-blck.svg",
  "/assets/images/svg/dropdown.svg",
  "/assets/images/svg/duplicate.svg",
  "/assets/images/svg/EEE9FC.jpg",
  "/assets/images/svg/EEE9FF.jpg",
  "/assets/images/svg/email-purpule.svg",
  "/assets/images/svg/email.svg",
  "/assets/images/svg/expo-complete.svg",
  "/assets/images/svg/export.svg",
  "/assets/images/svg/eye-off.svg",
  "/assets/images/svg/eye.svg",
  "/assets/images/svg/facebook-about.svg",
  "/assets/images/svg/facebook.svg",
  "/assets/images/svg/faqs-icon.svg",
  "/assets/images/svg/favicon.svg",
  "/assets/images/svg/feedback-icon.svg",
  "/assets/images/svg/filter1.svg",
  "/assets/images/svg/filter2.svg",
  "/assets/images/svg/gender.svg",
  "/assets/images/svg/google.svg",
  "/assets/images/svg/GooglePay.svg",
  "/assets/images/svg/growth.svg",
  "/assets/images/svg/home-icon.svg",
  "/assets/images/svg/homeLogo.png",
  "/assets/images/svg/info.svg",
  "/assets/images/svg/instagram-about.svg",
  "/assets/images/svg/instagram.svg",
  "/assets/images/svg/inviteFriend-icon.svg",
  "/assets/images/svg/language-icon.svg",
  "/assets/images/svg/launchFeatur.svg",
  "/assets/images/svg/lock.svg",
  "/assets/images/svg/logo.svg",
  "/assets/images/svg/logo2.svg",
  "/assets/images/svg/logobb.svg",
  "/assets/images/svg/logoglobal.svg",
  "/assets/images/svg/logOut-icon.svg",
  "/assets/images/svg/logout.svg",
  "/assets/images/svg/logo_g.svg",
  "/assets/images/svg/logo_g1.svg",
  "/assets/images/svg/logo_g2.svg",
  "/assets/images/svg/marketing-icon.svg",
  "/assets/images/svg/Mastercard.svg",
  "/assets/images/svg/menu.png",
  "/assets/images/svg/menu.svg",
  "/assets/images/svg/message.svg",
  "/assets/images/svg/move-down.svg",
  "/assets/images/svg/move-up.svg",
  "/assets/images/svg/music-pause-btn-white.svg",
  "/assets/images/svg/newUpdate.svg",
  "/assets/images/svg/notificationOption.svg",
  "/assets/images/svg/pause-btn.svg",
  "/assets/images/svg/payment-method.svg",
  "/assets/images/svg/PayPal.svg",

  "/assets/images/svg/pinSuccesChg.svg",

  "/assets/images/svg/play-btn.svg",

  "/assets/images/svg/refer.svg",
  "/assets/images/svg/rename.svg",
  "/assets/images/svg/right-half-arrow-black.svg",
  "/assets/images/svg/search.svg",
  "/assets/images/svg/security.svg",
  "/assets/images/svg/service-icon.svg",
  "/assets/images/svg/share.svg",
  "/assets/images/svg/social.svg",
  "/assets/images/svg/soil.svg",
  "/assets/images/svg/sub-icon.svg",
  "/assets/images/svg/translate.svg",
  "/assets/images/svg/twitter-about.svg",
  "/assets/images/svg/up-arrow-pur.svg",
  "/assets/images/svg/uploade.svg",
  "/assets/images/svg/uplode-loader.svg",
  "/assets/images/svg/viewallArrow.svg",
  "/assets/images/svg/visa-logo.svg",
  "/assets/images/svg/web-link.svg",
  "/assets/images/svg/website-purpule.svg",
  "/assets/images/svg/whatsapp.svg",
  "/assets/images/svg/white-play-btn.svg",
  "/assets/images/svg/x.svg",
  "/assets/images/svg/youtube-about.svg",
  "/assets/images/vector-images/img1.png",
  "/assets/images/vector-images/img10.png",
  "/assets/images/vector-images/img11.png",
  "/assets/images/vector-images/img12.png",
  "/assets/images/vector-images/img13.png",
  "/assets/images/vector-images/img2.png",
  "/assets/images/vector-images/img3.png",
  "/assets/images/vector-images/img4.png",
  "/assets/images/vector-images/img5.png",
  "/assets/images/vector-images/img6.png",
  "/assets/images/vector-images/img7.png",
  "/assets/images/vector-images/img9.png",

  "/assets/images/home-screen/insta.png",
  "/assets/images/home-screen/logobb.png",
  "/assets/images/home-screen/logobd.png",
  "/assets/images/home-screen/logobn.png",
  "/assets/images/home-screen/logost.png",
  "/assets/images/home-screen/PerAI-img1.jpg",
  "/assets/images/home-screen/PerAI-img2.jpg",
  "/assets/images/home-screen/PerAI-img3.jpg",
  "/assets/images/home-screen/PerAI-img4.jpg",
  "/assets/images/home-screen/PerAI-img5.jpg",
  "/assets/images/home-screen/PerAI-img6.jpg",

  "/assets/images/home-screen/upgardeNow-img.jpg",
  "/assets/images/home-screen/upgardeNow-img2.jpg",
  "/assets/images/home-screen/upgardeNow-img3.jpg",
];

// Domínios externos para cache dinâmico (runtime caching)
const EXTERNAL_DOMAINS = [
  "www.gstatic.com",
  "cdn.jsdelivr.net",
  "unpkg.com",
  "firebase.googleapis.com",
  "firebasestorage.googleapis.com",
];

// IndexedDB setup para salvar requisições POST offline
const DB_NAME = "sync-db";
const STORE_NAME = "requests";

// Função para abrir IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

// Função para serializar Headers para objeto simples JSON
function serializeHeaders(headers) {
  if (!headers) return {};
  // Se headers não possui .entries (não é Headers), retorna vazio para evitar erro
  if (typeof headers.entries !== "function") {
    return {};
  }
  const serialized = {};
  for (let [key, value] of headers.entries()) {
    serialized[key] = value;
  }
  return serialized;
}

// Salvar requisição POST no IndexedDB (headers serializados)
async function saveRequest(data) {
  const db = await openDatabase();
  const tx = db.transaction(STORE_NAME, "readwrite");
  // Serializa os headers para não causar DataCloneError
  data.options.headers = serializeHeaders(data.options.headers);
  tx.objectStore(STORE_NAME).add(data);
  return tx.complete;
}

// Recuperar todas requisições armazenadas
async function getAllRequests() {
  const db = await openDatabase();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      resolve(request.result || []);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Deletar requisição após sucesso no envio
async function deleteRequest(id) {
  const db = await openDatabase();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).delete(id);
  return tx.complete;
}

// Função para sincronizar requisições pendentes no IndexedDB
async function syncRequests() {
  const allRequests = await getAllRequests();
  for (const req of allRequests) {
    try {
      await fetch(req.url, req.options);
      await deleteRequest(req.id);
      console.log("Requisição sincronizada:", req);
    } catch (e) {
      console.warn("Falha ao sincronizar requisição:", e);
    }
  }
}

// Instalação do Service Worker e cache dos arquivos estáticos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(async (cache) => {
        const failedAssets = [];
        for (const asset of STATIC_ASSETS) {
          try {
            console.log(`Tentando adicionar no cache: ${asset}`);
            await cache.add(asset);
            console.log(`Adicionado com sucesso: ${asset}`);
          } catch (err) {
            failedAssets.push(asset);
            console.error(`Falha ao adicionar no cache: ${asset}`, err);
          }
        }
        if (failedAssets.length > 0) {
          console.error(
            "Arquivos que falharam ao adicionar no cache:",
            failedAssets
          );
        }
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação do Service Worker - limpeza dos caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter(
              (key) =>
                ![STATIC_CACHE, DYNAMIC_CACHE, EXTERNAL_CACHE].includes(key)
            )
            .map((key) => caches.delete(key))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch handler
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Ignore requisições que não sejam GET para evitar erro ao tentar cachear POST, PUT, etc.
  if (request.method !== "GET") {
    return; // Deixa a requisição ser processada normalmente, sem cache
  }

  const url = new URL(request.url);

  // Runtime cache para domínios externos
  if (EXTERNAL_DOMAINS.includes(url.hostname)) {
    event.respondWith(
      caches.open(EXTERNAL_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            fetch(request).then((networkResponse) => {
              if (networkResponse.ok && networkResponse.status !== 206)
                cache.put(request, networkResponse.clone());
            });
            return cachedResponse;
          }
          return fetch(request)
            .then((networkResponse) => {
              if (networkResponse.ok && networkResponse.status !== 206)
                cache.put(request, networkResponse.clone());
              return networkResponse;
            })
            .catch(
              () =>
                cachedResponse ||
                new Response("", { status: 503, statusText: "Offline" })
            );
        });
      })
    );
    return;
  }

  // Cache-first para arquivos estáticos locais
  if (STATIC_ASSETS.includes(url.pathname) || url.pathname === "/") {
    event.respondWith(
      caches
        .match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            fetch(request).then((networkResponse) => {
              if (networkResponse.ok && networkResponse.status !== 206) {
                caches
                  .open(STATIC_CACHE)
                  .then((cache) => cache.put(request, networkResponse.clone()));
              }
            });
            return cachedResponse;
          }
          return fetch(request);
        })
        .catch(() => caches.match("/offline.html"))
    );
    return;
  }

  // Network-first para outras requisições (API, dados dinâmicos)
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        return caches.open(DYNAMIC_CACHE).then((cache) => {
          if (networkResponse.ok && networkResponse.status !== 206) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        });
      })
      .catch(() =>
        caches
          .match(request)
          .then(
            (cachedResponse) => cachedResponse || caches.match("/offline.html")
          )
      )
  );
});

// Background Sync para enviar dados armazenados offline
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-requests") {
    event.waitUntil(syncRequests());
  }
});

// Interceptação de POST para salvar requisições offline
self.addEventListener("fetch", (event) => {
  if (event.request.method === "POST") {
    event.respondWith(
      fetch(event.request.clone()).catch(async () => {
        const clonedRequest = event.request.clone();
        let body;
        try {
          body = await clonedRequest.json();
        } catch {
          body = null; // Corpo não JSON
        }
        await saveRequest({
          url: clonedRequest.url,
          options: {
            method: "POST",
            headers: serializeHeaders(clonedRequest.headers),
            body: body ? JSON.stringify(body) : null,
          },
        });
        return new Response(JSON.stringify({ success: false, offline: true }), {
          headers: { "Content-Type": "application/json" },
        });
      })
    );
  }
});

// Evento para notificar quando a conexão voltar
self.addEventListener("message", (event) => {
  if (event.data === "checkConnection") {
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => client.postMessage("connectionRestored"));
    });
  }
});
