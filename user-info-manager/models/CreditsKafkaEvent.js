const avro = require("avsc");

const creditsEventSchema = avro.Type.forSchema({
  type: 'record',
  name: 'user_data',
  fields: [
    {
      name: "email",
      type: "string"
    },
    {
      name: "credits",
      type: "int"
    },
  ],
});

module.exports = creditsEventSchema;
