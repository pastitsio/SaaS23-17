const mongoose = require('mongoose');

const chartSchema = new mongoose.Schema({
    user_id: {
        required: true,
        type: String
    },
    chart: {
        type: String,
        required: [true, 'Chart field is required in order to create a new collection']
    },
    chart_type: {
        type: String,
        required: [true, 'Chart type field is required to create a new collection'],
        enum: ['Bar Label', 'Simple Plot', 'Scatter Plot with legend']
    },
    chart_name: {
        type: String,
        required: [true, 'Chart name field is required to create a new collection']
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    format_type: {
        type: String,
        required: [true, 'Format type of chart is required'],
        enum: ['pdf', 'png', 'svg', 'html']
    }
});

module.exports = mongoose.model('Chart', chartSchema);