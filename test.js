const Hidemyacc = require("./hidemyacc");
const hidemyacc = new Hidemyacc();

!(async () => {
  const profileList = await hidemyacc.profiles();
  const profiles = profileList.data;
  for (i of profiles) {
    console.log(i);
    return await hidemyacc.delete(i.id);
  }

  // await hidemyacc.create({
  //   id: "",
  //   name: "tien01",
  //   os: "win",
  //   //platform: "Win32",
  //   browserSource: "marco",
  //   browserType: "chrome",
  //   proxy: {
  //     proxyEnabled: false,
  //     autoProxyServer: "",
  //     autoProxyUsername: "",
  //     autoProxyPassword: "",
  //     changeIpUrl: "",
  //     mode: "http",
  //     port: 80,
  //     autoProxyRegion: "VN",
  //     torProxyRegion: "us",
  //     host: "",
  //     username: "",
  //     password: ""
  //   },
  // });

  // await hidemyacc.delete()
})();
