function createIncident(RED, alertType) {
  function Incident(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    node.on('input', function (msg) {
      let value;
      if (config.value) {
        value = eval(config.value);
      }

      let title = config.title;
      if (!title && msg.incidentTitle) {
        title = msg.incidentTitle;
      }

      let description = '';
      if (msg.payload && msg.payload.description) {
        description = msg.payload.description;
      }

      msg.payload = {
        title: title,
        description: description,
        alert_type: alertType,
        operation_id: String(msg.operation._id),
        operation_name: msg.operation.name,
        modules: config.modules,
        date: msg.date.getTime(),
        test_batch: msg.testBatch
      };

      if (value != null) { msg.payload.value = value; }

      if (msg.zone) {
        msg.payload.zone_id = String(msg.zone._id);
        msg.payload.zone_name = String(msg.zone.name);
      }

      if (msg.floor) {
        msg.payload.floor_id = String(msg.floor._id);
        msg.payload.floor_name = String(msg.floor.name);
      }

      node.send(msg);
    });
  }

  return Incident;
};

module.exports = function (RED) {
  RED.nodes.registerType('green-incident', createIncident(RED, 'green'));
  RED.nodes.registerType('yellow-incident', createIncident(RED, 'yellow'));
  RED.nodes.registerType('red-incident', createIncident(RED, 'red'));
  RED.nodes.registerType('black-incident', createIncident(RED, 'black'));
};
