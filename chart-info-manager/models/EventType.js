const avro = require("avsc");

const eventSchema = avro.Type.forSchema({
  type: 'record',
  fields: [
    { 
        name: "email" ,
        type: 'string'
    },
    { 
        name: "chart_url",
        type: 'string'
    },
    { 
        name: "chart_type",
        type: 'string'
    },
    { 
        name: "chart_name",
        type: 'string'
    },
    { 
        name: "created_on",
        type: "string"
    }
  ]
});

module.exports = eventSchema;
