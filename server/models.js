var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/jobs');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Datum = new Schema({
    key: {type: String},
    value: {type: String}
});

var Task = new Schema({
    data: [Datum]
});

var uuid = require('node-uuid');
var RunningTask = new Schema({
    taskId: {type: String, default:uuid.v4, index: {unique: true}},
    heartbeat: {type: Date},
    data: [Datum]
});

var Job = new Schema({
    jobId: {type: String, default:uuid.v4, index:{unique: true}},
    mapper: {type: String},
    mapInput: [Task],
    mapRunning: [RunningTask],
    mapOutput: [Task],

    reducer: {type: String},
    reduceInput: [Task],
    reduceRunning: [RunningTask],
    reduceOutput: [Task]
});

exports.Job = mongoose.model('Job', Job);
