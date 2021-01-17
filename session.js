var express = require('express');
var cors = require('cors');
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


const myCsrfToken = "itismytestcookie"; //burası normalde dinamik değişmeli araştır
var admin = require("./node_modules/firebase-admin"); //npm i firebase-admin indir önce
var serviceAccount = require("./angularconnection-b3402-firebase-adminsdk-gotkq-498134f5f1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://angularconnection-b3402-default-rtdb.firebaseio.com"
});

app.use(express.static('angular-firebase')); // myApp will be the same folder name.
app.get('/init', cors({credentials: true}), function (req, res, next) {
  console.log("GET YAKALANDI");
  res.cookie("csrfToken", myCsrfToken);
  //response headerda domain ve port verilmez ve * olarak kalırsa kabul edilmez çünkü o zaman her urlden gelen istek
  // ile cookie setlenir. o yüzden domain ve port belirtmek zorunludur güvenlik açığı olmaması için
  /*
  Kullanıcı tarafından gönderilen bir HTTP talebinin gerçek kullanıcı tarafından mı yoksa bir saldırgan
  tarafından mı gönderildiğini tespit etmek zordur. Web sitesine erişmeye çalışan bir kullanıcının kimliğini
  doğrulamak için sıkı önlemler alınabilir, fakat kullanıcılar aynı oturumda tekrar tekrar kimlik doğrulamak
  ile uğraşmak istemezler. Sistemde token yönteminin kullanılması, kimliğin arka planda otomatik olarak
  doğrulanmasını sağlar. Böylece kullanıcı kimlik doğrulama istekleriyle sürekli olarak rahatsız edilmez.
  Genelde CSRF açığını engellemek için sisteme giriş yapan kullanıcıya, her defasında farklı ve tahmin edilmesi
  güç “token” bilgisi verilir. Fakat bu token verisi oturum boyunca aynı kalmaz. Örneğin kullanıcının yüklediği
  her bir form için ayrı token bilgisi üretilir. Arkaplanda gerçekleşen bu olayda, sisteme giriş yapan kullanıcı
   token aldığını her ne kadar fark etmese de, yaptığı tüm işlemlerde bu token sistem tarafından kontrol edilir
   ve işlemin gerçekten kullanıcı tarafından yapıldığı doğrulanır. Eğer token veya buna benzer bir anahtar kontrolü
   yapılmazsa, arka planda gönderilen sahte bir istek ile gerçek kullanıcının gönderdiği istek ayırt edilemez.
   Bu durumda sistemin gelen tüm istekleri ayırt etmeksizin kabul etmesi gerekir ki bu büyük bir güvenlik
   zafiyetine sebep olur.
   */

  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.status(200).send({csrfToken: myCsrfToken});
});

app.use((req, res, next) => {


  res.header("Access-Control-Allow-Origin", 'http://localhost:4200');
  res.header('Access-Control-Allow-Credentials', true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  console.log("URL:" + req.url + req.method);
  if (req.method === 'OPTIONS') {
    console.log("PREFLIGHT111");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  } else if (req.method == 'POST' && req.url == "/sessionLogin") {
    console.log("SESSION LOGIN YAKALANDI");

    const idToken = req.body.idToken.toString();
    const csrfToken = req.body.csrfToken.toString();
    // Guard against CSRF attacks.

    console.log(myCsrfToken);
    console.log(req.cookies.csrfToken);

    if (myCsrfToken !== req.cookies.csrfToken) {
      console.log("SUNAUTHORIZED REQUEST11!");
      res.status(401).send('UNAUTHORIZED REQUEST11!');
      return;
    }
     const expiresIn = 60 * 60 * 24 * 5 * 1000;
    // const expiresIn = 60 * 5 * 1000; // 5dk

    admin
      .auth()
      .createSessionCookie(idToken, {expiresIn})
      .then(
        (sessionCookie) => {
          // Set cookie policy for session cookie.
          const options = {maxAge: expiresIn, httpOnly: true, secure: false}; //production ise secure:true olmalı localhostta false yoksa cookie setlemez
          res.cookie('session', sessionCookie, options);
          console.log("success");

          res.end(JSON.stringify({status: 'success'}));
        },
        (error) => {
          console.log("UNAUTHORIZED REQUEST22!");

          res.status(401).send('UNAUTHORIZED REQUEST22!');
        }
      );

  } else if (req.method == 'POST' && req.url == "/verifySession") {

    const sessionCookie = req.cookies.session || '';
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then((decodedClaims) => {
        res.end(JSON.stringify({status: 'success'}));
      })
      .catch((error) => {
        // Session cookie is unavailable or invalid. Force user to login.
        res.end(JSON.stringify({status: 'fail'}));
      });

  } else if (req.method == 'POST' && req.url == "/sessionLogout") {
    const sessionCookie = req.cookies.session || '';
    console.log("session cookie: " +sessionCookie);
console.log("sessionLogout nodejs")
    res.clearCookie('session');
    console.log("session cookie2: " +sessionCookie);

    admin
      .auth()
      .verifySessionCookie(sessionCookie)
      .then((decodedClaims) => {
        console.log("decodedClaims", decodedClaims);
        //revoke işlemi olmasaydı tarayıcıdan cookie siilinirdi ama silinmeden cookieyi kopyalayıp silindikten sonra yapıştırsak sessionı
        // devam ederdi ama revoke ile session öldürüldüğü için tekrar yapıştırılsa yani session key çalınmış olsa bile yapıştırıldığında
        // artık geçerli değil güvenliği sağlamış olduk <3
        // Calling the revocation API revokes the session and also revokes all the user's other sessions,
        // forcing new login. For sensitive applications, a shorter session duration is advised.
         admin.auth().revokeRefreshTokens(decodedClaims.sub);
      })
      .then(() => {
        console.log("/logout");
         // res.redirect('/login');
        res.end(JSON.stringify({status: 'success'}));
      })
      .catch((error) => {
        console.log("/logout error");
        res.end(JSON.stringify({status: 'fail'}));
      });


  }
  // next();
});


app.listen(8080, 'localhost');
console.log('MyProject Server is Listening on port 8080');
