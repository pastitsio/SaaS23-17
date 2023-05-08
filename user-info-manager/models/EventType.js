const avro = require("avsc");

const eventSchema = avro.Type.forSchema({
  type: 'record',
  fields: [
    { 
        name: "email" ,
        type: 'string'
    },
    { 
        name: "last_login",
        type: 'long'
    },
  ],
});

module.exports = eventSchema;
