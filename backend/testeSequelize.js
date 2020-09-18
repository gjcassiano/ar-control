const sequelizeModule = require("./sequelize-module");
const Sequelize = require("sequelize");
const Slave = require("./models").models.slave;

sequelizeModule.sequelize
  .query("SELECT * FROM slave", { model: Slave, raw: true })
  .then((slave) => {
    // Each record will now be mapped to the project's model.
    console.log(slave);
  });

sequelizeModule.sequelize
  .query("delete slave where id > 0", { model: Slave, raw: true })
  .then((slave) => {
    // Each record will now be mapped to the project's model.
    console.log(slave);
  });
