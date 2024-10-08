//? MAIN.JS

const coinInput = document.getElementById("input"); //1. part
const coinBtn = document.getElementById("btn");
const coinList = document.querySelector(".coins");

function coinSearch(e) {
  //5.part

  e.preventDefault(); // burasi cok onemli tarayicinin varsayilan davranisi FORM ICIN buton maglum formun icindedir butona tikladigimizda formunu icinde oldugu icin buton
  // sayfayi yeniler tarayici bizde tarayicinin sayfayi yenilemesini iptal ediyoruz !!!

  const userInput = coinInput.value.trim().toLowerCase(); // girilen bilgi inputa bosluksuz ve kucukharfle olsun

  if (!userInput) {
    //6.part
    Swal.fire({
      icon: "error",
      title: "Oops, Elon Musk is Confused!",
      text: "Did you mean to search for 'Dogecoin'? Elon might have misheard you over the rocket engines! 😉🚀",
      footer: '<a href="#">~ Tips For Effective Coin Searching HERE! ~ </a>',
    });

    return;
  }

  const coinRankApiKey =
    "coinrankingfd080161bf3c6e9f143e6efa86956b64e891529ed7b1315c"; //3.part

  const coinRankUrl = `https://api.coinranking.com/v2/coins?limit=100&offset=0&api_key=${coinRankApiKey}`; // url nasil alinir dokumantasyonu end pointleri anlat
  // base urlye degin ? ve & yapilarini ? sorgu belirtir & parametreleri ayirir birden fazla https://api.coinranking.com/v2/coins?limit=100&offset=0& burasi ilk 100 coin degeri
  // api_key=${CoinRankApiKey} kullanicinin aradigi coin degerleri islesen degerleri bize getiriyor.

  fetch(coinRankUrl)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Veri Cekme Islemi Basarisiz");
      }
      return res.json();
    })

    //4.PART
    .then((data) => {
      console.log("API Response:", data); // butona tiklamadan buradan gelen api degerlerini goremeyiz api degerleri butona tiklaninca geliyor iceriginde ne oldugunu goruruz
      //debugging yaparken yani hata ayiklamada iyidir
      //buraya istedigimiz islem yazilir verinin alindigi kisim

      //7.part tekrar yaziyoruz artik datayi aldik onu filtreleyip basacagiz

      // datayi consolede goster parametre adi verdik bundan burada cikti de

      const coins = data.data.coins; // data parametresiyle apidan gelen veriye ulasiyoruz bu veride data objectsi tanimlanmis objenin icinde data ve status adinda iki
      // deger var bunlari . yontemi ile cekiyoruz ozelliklerini artik yeni degiskenimiz coins coins bir dizidir bunuda api belgelerinden ya da yaniti konsola basarak anlariz

      const filteredCoins = coins.filter((coin) => {
        return (
          coin.name.toLowerCase().includes(userInput) ||
          coin.symbol.toLowerCase().includes(userInput)
        );

        // coin.name coins dizisindeki her bir elemani temsil eder ve bu dizinin icinde name bir keydir namen degeri coin isimleridir bitcoin dodgecoin gibi bize bu nameler lazim
        // bu nameleri al kucuk harf yap ve userinputdaki deger ile aynimi ya da icerip iceriyormu bak VEYA
        // SYMBOL keylerini al kucukharf yap ve sonra kullanicinin girdigi bilgilerle uyusuyormu bak bu iki uyusmadan biri varsa return ile bize geri dondur !
      });

      if (filteredCoins.length === 0) {
        // bu bir dizi dizinin uzunlugu yani indexi sifirsa bu da demek ki icinde coin yok ise !
        Swal.fire({
          title: "Oops! Coin Not Found",
          text: "Looks like this coin is playing hide and seek!",
          icon: "question",
          footer:
            "Maybe it's just shy... or saving up for a grand entrance! 🚀💰",
        });
      } else {
        displayCoins(filteredCoins); // coin var ise zaten card icine basicaz buradaki fonksiyon ile bu diziyi fonksiyona parametre olarak gececegiz
      }
    })

    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong!",
        footer: '<a href="#">Why do I have this issue?</a>',
      });
    });
}

function isCoinAlreadyDisplayed(coin) {
  // bir fonksiyon ekranda gosterilip gosterilmedigini anlamamiz icin bu fonksiyonu kullaniyoruz
  const displayedCoins = document.querySelectorAll(".coin"); // tum coinleri kapsayan ana classi seciyoruz burada   ???

  for (const existingCoinElement of displayedCoins) {
    //for of dongusu yazilmis displayedCoinins tum coinleri kapsayan secildi cunku yazildi daha once
    const coinName = existingCoinElement // yazilmis olan yerin indexi lazim diyoruz ki buradaki indexi getir
      .querySelector(".coin-name") //  Döngü, bu listedeki her bir elementi sırayla existingCoinElement  değişkenine atar.
      .textContent.toLowerCase(); // isim ile aratacagimiz ve ayni isim cikabilir diye hem kucuk harf hem de isme ait classi seciyoruz
    if (coinName.includes(coin.name.toLowerCase())) {
      // coin.name nereden geldi filtred coindeki coin bu
      return true;
    } // KISACA OLAY SU BURADA DISPLAYEDCOINS COINLER YAZILMIS FONKSIYONU VAR ICINDEN kucukharfli ve isim olanlarin indexini yeni existinoncoinelemnte bas diyoruz
  } // BUNUDA Coinname degiskenine atiyoruz!!!!
  return false;
}

function displayCoins(filteredCoins) {
  // herhangi bir yerde tanimlanabilir bu fonksiyon globaldede

  filteredCoins.forEach((coin) => {
    if (isCoinAlreadyDisplayed(coin)) {
      Swal.fire({
        title: "Coin Already Displayed",
        text: `The coin ${coin.name} is already displayed on the screen.`,
        icon: "info",
        footer: '<a href="#">You might want to check the existing list!</a>',
      });
      return; // Eğer coin zaten ekrandaysa, bu coin'i tekrar ekleme
    }

    const li = document.createElement("li");
    li.classList.add("coin");

    li.innerHTML += `<div class="remove-icon">
                <i class="fas fa-window-close"></i>
            </div>
            <h2 class="coin-name">${coin.name} <sup>${coin.symbol}</sup></h2>
            <div class="coin-temp">$${parseFloat(coin.price).toFixed(2)}</div>
            <figure>
                <img src="${coin.iconUrl}" alt="${coin.name}" class="coin-icon">
                <figcaption>Change: ${coin.change}%</figcaption>
            </figure>`;
    coinList.appendChild(li);

    /* <div class="remove-icon">: Coin'i kaldırmak için bir ikon oluşturduk
<h2 class="coin-name">: Coin'in adını ve sembolünü gösteriyor 
<div class="coin-temp">: Coin'in fiyatını gösterir.  cssde zaten tanimlanmis onceden   */

    li.querySelector(".remove-icon").addEventListener("click", () => {
      removeCoin(li); // simdi arrow function kullanilmis burada burasi asiri karisik anlayana kadar canim cikti
      // bir fonksiyon parametre almaz ise direk tetiklenmez mesela coinBtn.addEventListener("click", coinSearch); gibi ama parametre alirsa li ve coinname gibi
      // o zaman hemen cagirilir ve hemen cagirilirsa undefined doner bu yuzden hemen cagirilmasin diye arrow function ile yaptik
      // arrow function click olayinin gerceklesmesini bekler hemen cagirmaz fonksiyonu bu yuzden arrow function ile yazariz
      // arrow funcutonu suslu parantez gibi dusunebiliriz suslu parantez icerisindeyken isleme aliyorduk yani arrow function var ise ondan onceki olayin baslamasi lazim
      // kisaca konu cok karisik bilinmesi gereken sey parametre var ise fonksiyonda event olaylarinda arrow function kullaniriz direk calismasin diye

      // bu arada removeCoin liyi inner ile cardlari bastiktan sonra hemen eklememizin sebebi fonksiyon icinde degiskenlere ulasalim scope kavrami cok etkili
    });
    coinList.appendChild(li); // neden coinlistin icine bu eklemis oldugumuz event listeneri koyuyoruz cunku en yakinimizda o var, baska bir doom elementinede koyabilirdik
    //amac burada bir doom elementine bu eklemis oldugumuz eventi eklemek ???
  });
}

function removeCoin(li) {
  li.remove();
}

//2.part

coinBtn.addEventListener("click", coinSearch);
