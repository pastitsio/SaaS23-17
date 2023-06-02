const mongoose = require('mongoose');

const chartSchema = new mongoose.Schema({
    user_id: {
        required: true,
        type: String
    },
    chart: {
        type: String,
        required: [true, 'Chart is required in order to create a new collection']
    },
    format_type: {
        type: String,
        required: [true, 'Format type of chart is required'],
        enum: ['pdf', 'png', 'svg', 'html']
    }
});

module.exports = mongoose.model('Chart', chartSchema);