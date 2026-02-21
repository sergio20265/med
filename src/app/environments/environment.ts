// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'https://nmrehab.ru',
  apiUrl: 'http://127.0.0.1:8018/api/v2',
  apiHost: 'https://front-api.nmpansion.ru',
  apiToken: '0cacc14d6b6cc78223a8197c01a61c69388c27cf6e8bde1ed36b08625720e5e4094cff52f0608f54b74112dd212813362bec1a0590b67dd73737890a2c7b9d801a4caebeb9a690e28b37adf8861e549f365be427e2c5924e7233cf3e9894a31ed49884b2e500e8cb6527b05fa6e6a3d20c8276a68481e3a2542facd8d1b85570',
  telegramBotToken: '6692526264:AAFr-6NU0jpEhzIj0p88ZFXw-c8JwgnOne4',
  telegramChatIds: ['505467091'], // Массив Chat ID для отправки в несколько чатов
};
// https://api.telegram.org/bot6692526264:AAFr-6NU0jpEhzIj0p88ZFXw-c8JwgnOne4/getUpdates
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
