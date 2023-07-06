const avro = require("avsc");

const eventSchema = avro.Type.forSchema({
  type: 'record',
  fields: [
    { 
        name: "email" ,
        type: 'string'
    },
    { 
        name: "chart_name",
        type: 'string'
    },
    { 
        name: "chart_type",
        type: 'string'
    },
    { 
        name: "chart_url",
        type: 'string'
    },
    { 
        name: "created_on",
        type: "int"
    }
  ]
});

module.exports = eventSchema;
