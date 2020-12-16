if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("service-worker.js")
      .then(function() {
        console.log("Pendaftaran ServiceWorker berhasil");
      })
      .catch(function() {
        console.log("Pendaftaran ServiceWorker gagal");
      });
  });

  requestPermission();
} else {
  console.log("ServiceWorker belum didukung browser ini.");
}


function requestPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(function (result) {
      if (result === "denied") {
        console.log("Fitur notifikasi tidak diijinkan.");
        return;
      } else if (result === "default") {
        console.error("Pengguna menutup kotak dialog permintaan ijin.");
        return;
      }

      if (('PushManager' in window)) {
          navigator.serviceWorker.getRegistration().then(function(registration) {
              registration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: urlBase64ToUint8Array("BNTdDDQ7Lrg4l-IbNplsEuEkuk2NT9BB6KARgxeDsQHKPiAF141MrV7OnRdfzVj0drzAgEwj9L0FGwbWUL-pD2w")
              }).then(function(subscribe) {
                  console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
                  console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                      null, new Uint8Array(subscribe.getKey('p256dh')))));
                  console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                      null, new Uint8Array(subscribe.getKey('auth')))));
              }).catch(function(e) {
                  console.error('Tidak dapat melakukan subscribe ', e.message);
              });
          });
      }
    });
  }
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

var el = document.getElementById('tabs');
var instance = M.Tabs.init(el);

var dbPromise;

$(document).ready(function(){
    'use strict';

    //check for support
    if (!('indexedDB' in window)) {
      console.log('This browser doesn\'t support IndexedDB');
      return;
    }

    dbPromise = idb.open("sepakbolaku", 1, function(upgradeDb) {
      if (!upgradeDb.objectStoreNames.contains("jadwalucldisimpan")) {
        var peopleOS = upgradeDb.createObjectStore("jadwalucldisimpan", { keyPath: "id" });
        peopleOS.createIndex("tim", "tim", { unique: false });
        peopleOS.createIndex("waktu", "waktu", { unique: false });
      }
    });
});

function simpanjadwal(id ,tim, waktu)
{
    dbPromise.then(function(db) {
          var tx = db.transaction('jadwalucldisimpan', 'readwrite');
          var store = tx.objectStore('jadwalucldisimpan');
          var item = {
              id: id,
              tim: tim,
              waktu: waktu
          };
          store.put(item);
          return tx.complete;
      }).then(function() {
          alert('Berhasil menyimpan jadwal.');
      }).catch(function() {
          alert('Gagal menyimpan jadwal.');
    });
}

function getjadwal()
{
    dbPromise.then(function(db) {
      var tx = db.transaction('jadwalucldisimpan', 'readonly');
      var store = tx.objectStore('jadwalucldisimpan');
      return store.getAll();
    }).then(function(items) {
      var jadwaltersimpan = "";
      jadwaltersimpan += `
        <ul class="collection with-header">
          <li class="collection-header"><h4>Jadwal Tersimpan</h4></li>
      `;
      items.forEach(function(data){
        jadwaltersimpan += `
          <li class="collection-item">
            <p>
              ${data.tim}
              <button onclick="deletejadwal('${data.id}')" class="button-simpan secondary-content waves-effect waves-light btn">Hapus</button><br>
              ${data.waktu}
            </p>
          </li>
        `;
      }); 
          
      jadwaltersimpan += `
        </ul>
      `;

      document.getElementById("jadwaltersimpan").innerHTML = jadwaltersimpan;
    });
}

function deletejadwal(id)
{
  dbPromise.then(function(db) {
    var tx = db.transaction('jadwalucldisimpan', 'readwrite');
    var store = tx.objectStore('jadwalucldisimpan');
    store.delete(id);
    return tx.complete;
  }).then(function() {
    alert('Jadwal Telah Dihapus');
    getjadwal();
  });
}