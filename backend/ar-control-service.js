var request = require("request");
var Netmask = require("netmask").Netmask;
const Models = require("./models");
const cronjob = require("node-cron");
const moment = require("moment");

const Slave = Models.models.slave;

exports.ping = ping;
exports.pingNetwork = pingNetwork;

//each 15 minutes
cronjob.schedule("*/15 * * * *", () => {
  Models.models.subnet.findAll().then((subnets) => {
    subnets.forEach((subnet) => {
      console.log("Checking ", subnet.name);
      pingNetwork(subnet.name);
    });
  });
});

//each 15 seconds
cronjob.schedule("*/15 * * * * *", () => {
  Slave.findAll().then((slaves) => {
    slaves.forEach((slave) => {
      ping(slave.dataValues.ip);
    });
  });
});

function ping(ip) {
  var urlToPing = "http://" + ip + "/ping";

  request.get(urlToPing, { timeout: 20000, requested: ip }, function (
    err,
    response,
    body
  ) {
    if (response && response.statusCode === 200) {
      console.log(this.requested, response && response.statusCode);
      var mac = body.slice(0, 17);
      return Models.updateSlave(
        { lastPingDate: new Date(), ip: this.requested, mac: mac },
        { mac: mac }
      );
    }
  });
}

function pingNetwork(networkWithMask) {
  var ips = new Netmask(networkWithMask);
  ips.forEach(function (ip, long, index) {
    setTimeout(ping, 100 + 20 * index, ip);
  });
}
