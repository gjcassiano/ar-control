const sequelizeModule = require('./sequelize-module');
const Sequelize = require('sequelize');

const Slave = sequelizeModule.sequelize.define('slave',{
    mac: {type: Sequelize.STRING, primaryKey: true},
    name: Sequelize.STRING,
    ip: Sequelize.STRING,
    createDate: Sequelize.DATE,
    updateDate: Sequelize.DATE,
    lastPingDate: Sequelize.DATE
},{
  timestamps: true,
  createdAt: true,
  updatedAt: false,
  deletedAt: false,
  tableName: 'slave'
}); 

const Subnet = sequelizeModule.sequelize.define('subnet',{
    name: {type: Sequelize.STRING, primaryKey: true},
},{
    timestamps: true,
    createdAt: true,
    updatedAt: false,
    deletedAt: false,
    tableName: 'subnet'
}); 

function updateSlave(values, condition) {
    Slave.sync().then(function() {
        return Slave
            .findOne({ where: condition})
            .then(function(obj) {
                if(obj) { // update
                    return obj.update(values);
                }
                else { // insert
                    return Slave.create(values);
                }
            });
    });
};

exports.updateSlave = updateSlave;

exports.models = {
  slave: Slave,
  subnet: Subnet
};