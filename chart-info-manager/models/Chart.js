const mongoose = require('mongoose');

const chartSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String
    },
    chart_url: {
        type: String,
        required: [true, 'Chart url field is required in order to create a new collection']
    },
    chart_type: {
        type: String,
        required: [true, 'Chart type field is required to create a new collection'],
        enum: ['Bar Label', 'Simple Plot', 'Scatter Plot']
    },
    chart_name: {
        type: String,
        required: [true, 'Chart name field is required to create a new collection']
    },
    created_on: {
        type: Date,
        default: Date.now(),
        required: [true, 'Created on field is required to create a new collection']
    },
    format_type: {
        type: String,
        required: [true, 'Format type of chart is required'],
        enum: ['pdf', 'png', 'svg', 'html', 'jpeg']
    }
});

module.exports = mongoose.model('Chart', chartSchema);