const mongoose = require('mongoose');

const chartSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String
    },
    chart_name: {
        type: String,
        required: [true, '"chart_name" field is required to create a new collection']
    },
    chart_type: {
        type: String,
        required: [true, '"chart_type" field is required to create a new collection'],
        enum: ['Bar Label Plot', 'Simple Plot', 'Scatter Plot']
    },
    chart_url: {
        type: String,
        required: [true, '"chart_url" field is required in order to create a new collection']
    },
    created_on: {
        type: Number,
        default: Date.now(),
        required: [true, '"created_on" field is required to create a new collection']
    }
});

module.exports = mongoose.model('Chart', chartSchema);