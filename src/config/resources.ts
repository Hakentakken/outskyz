/**
 * Central registry for all static resource paths.
 * Import paths from here instead of hardcoding them in components.
 */
export const resources = {
  logo: "/resources/logo.png",
  sky: {
    heroVideo: "/resources/bg/92d908a012210eb24b8428d1ba6def22.mp4",
    alternateVideo: "/resources/bg/508d7e3aa3afb9a5ab4c42ac71461fd1.mp4",
    altitudeVideo: "/resources/bg/2c2b3b9e850fd1a399dd366cc3c4de7c_720w.mp4",
    heroPoster: "/resources/bg/de896c03e524678037e5c99974e46d51.jpg",
    cloudscape: "/resources/bg/download.jpg",
    cloudMotion: "/resources/bg/tumblr_m9dcbsZ4de1rbifmpo1_500.gif",
    sunsetFlight: "/resources/bg/4c8d699256b967eea2726a52eabc7ac3.jpg",
    goldenFreefall: "/resources/bg/daeef34471e0dcfe9ac295b7b5a8f5be.jpg",
    mountainFreefall: "/resources/bg/9f7b8472926d4b68912d551bc382710a.jpg",
    formationFlight: "/resources/bg/8db19c1469eda24bcb240680b473ae7e.jpg",
    horizonFlight: "/resources/bg/de896c03e524678037e5c99974e46d51.jpg",
  },
} as const;

export type ResourceKey = keyof typeof resources;
