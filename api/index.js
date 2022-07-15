//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = require('./src/app.js');
//const { getAllDietsTypes } = require('./src/controllers/Diets.controller.js');
const { conn, Diet } = require('./src/db.js');
const diets_List = require('./src/controllers/Diets_list');

// Syncing all the models at once.
conn.sync({ force: true }).then(async () => {

  //Precarga de base de datos
  try {
    const bd = await Diet.findAll();

    if (bd.length < 1) {
      let formatted = diets_List.map((d) => {
        return {
          name: d.toLowerCase(),
        };
      });

      let database = await Diet.bulkCreate(formatted); //Insert info in bd
      server.listen(3001, () => {
        console.log("%s listening at 3001 :)"); // eslint-disable-line no-console
      });
    }
    else {

      server.listen(3001, () => {
        console.log("%s listening at 3001"); // eslint-disable-line no-console
      });
    }
  } catch (err) { console.error(err) }

  // server.listen(3001, () => {
  //   console.log('%s listening at 3001'); // eslint-disable-line no-console
  // });
});