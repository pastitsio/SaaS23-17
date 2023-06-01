const avro = require("avsc");

const eventSchema = avro.Type.forSchema({
  type: 'record',
  fields: [
    { 
        name: "email" ,
        type: "string"
    },
    { 
        name: "credits",
        type: "int"
    },
  ],
});

module.exports = eventSchema;
