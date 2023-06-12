const { producerCreate } = require("./kafka-connect");
const queueMessage = require("./kafka-publisher");

const chart = [
    {
      email: "giannismitis@gmail.com",
      chart_url: "www.godfogle.com",
      chart_type: "Bar Label",
      chart_name: "mitsos",
      created_on: "2386589153284"
    },
    {
      email: "giannismitis@gmail.com",
      chart_url: "www.godfogle2.com",
      chart_type: "Bar Label",
      chart_name: "mitsos",
      created_on: "2186589153284"
    },
    {
      email: "giannismitis@gmail.com",
      chart_url: "www.godfogle1.com",
      chart_type: "Bar Label",
      chart_name: "mitsos",
      created_on: "1986589153284"
    },
    {
      email: "giannismitis@gmail.com",
      chart_url: "www.godfo4343gle.com",
      chart_type: "Bar Label",
      chart_name: "mitsos",
      created_on: "2386589153284"
    },
    {
      email: "giannismitis@gmail.com",
      chart_url: "www.godfogle24343.com",
      chart_type: "Bar Label",
      chart_name: "mitsos",
      created_on: "0186589153284"
    },
    {
      email: "giannismitis@gmail.com",
      chart_url: "www.g3344odfogle1.com",
      chart_type: "Bar Label",
      chart_name: "mitsos",
      created_on: "1186589153284"
    },

]

const stream = producerCreate("chart-data");
for (let i = 0; i < 6; i++) {
    queueMessage(chart[i], stream);
}
