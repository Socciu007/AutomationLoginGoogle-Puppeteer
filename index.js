const mails = require("./testmails.json");
const emailsList = Array.from(mails.login);
const emailsCapcha = [];

const Hidemyacc = require("./hidemyacc");
const hidemyacc = new Hidemyacc();
const puppeteer = require("puppeteer-core");
const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

!(async () => {
  await runLogin(0, emailsList);
  await runLimitEmailCapcha(runLogin(0, emailsCapcha), 1);
  //console.log(await page.content());
})();

async function checkLogin(page, emails, passwords) {
  const response = {
    susscess: 0,
    msg: "",
  };

  await page.type('input[type="email"]', emails);
  await delay(1000);

  await page.keyboard.press("Enter");
  await delay(3000);

  let url = await page.url();

  if (url.includes("v3/signin/identifier")) {
    response.msg = "email wrong";
    return response;
  } else if (url.includes("v2/challenge/recaptcha?")) {
    response.susscess = 2;
    response.msg = "capcha";
    return response;
  } else {
    response.msg = "email true";
  }

  await page.type('input[type="password"]', passwords);
  await delay(1000);

  await page.keyboard.press("Enter");
  await delay(3000);

  url = await page.url();
  if (!url.includes("v3/signin/challenge/pwd?")) {
    response.susscess = 1;
    response.msg = "login susscess";
  } else {
    response.msg = "password wrong";
  }

  return response;
}

// de quy login
async function runLogin(countEmail, emailList) {
  await createProfile();
  //get profile
  const profileList = await hidemyacc.profiles();

  const profileId = profileList.data[0].id;
  const response = await hidemyacc.start(profileId, {
    startUrl: "about:blank",
  });
  if (response.code !== 1) {
    throw new Error("Khong mo duoc trinh duyet");
  }

  const browser = await puppeteer.connect({
    browserWSEndpoint: response.data.wsUrl,
    defaultView: null,
    slowMo: 60,
  });

  const pages = await browser.pages();
  let page;
  if (pages.length) {
    page = pages[0];
  } else {
    page = await browser.newPage();
  }
  if (countEmail < emailList.length) {
    try {
      const email = emailList[countEmail].email;
      const password = emailList[countEmail].password;
      console.log(`Run email: ${email}`);

      await page.goto("https://accounts.google.com", {
        timeout: 30000,
        waitUntil: "networkidle0",
      });

      const response = await checkLogin(page, email, password);
      console.log(response);

      if (response.susscess == 2) {
        emailsCapcha.push(emailList[countEmail]);
        await hidemyacc.delete(profileId);
      } else if (response.susscess == 0) {
        await hidemyacc.delete(profileId);
      } else {
        //await browser.close();
      }

      await hidemyacc.stop(profileId);
      return await runLogin(countEmail + 1, emailList);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Count email test:" + countEmail);
    await hidemyacc.stop(profileId);
  }
}

async function runLimitEmailCapcha(func, limit) {
  for (let i = 0; i < limit; i++) {
    return await func();
  }
}

async function createProfile() {
  await hidemyacc.create({
    id: "",
    name: "tt",
    os: "win",
    browserSource: "marco",
    browserType: "chrome",
    proxy: {
      proxyEnabled: false,
      autoProxyServer: "",
      autoProxyUsername: "",
      autoProxyPassword: "",
      changeIpUrl: "",
      mode: "http",
      port: 80,
      autoProxyRegion: "VN",
      torProxyRegion: "us",
      host: "",
      username: "",
      password: "",
    },
  });
}
