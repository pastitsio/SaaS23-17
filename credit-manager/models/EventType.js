const avro = require("avsc");

const eventSchema = avro.Type.forSchema({
  type: 'record',
  fields: [
    { 
      name: "credits",
      type: "int"
    },
    { 
        name: "email" ,
        type: "string"
    },
  ],
});

module.exports = eventSchema;
