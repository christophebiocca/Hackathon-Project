var mongoose = require('mongoose');
var _ = require('underscore');
var uuid = require('node-uuid');
mongoose.connect('mongodb://localhost/jobs');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var schemas = {};

schemas.Datum = new Schema({
    key: {type: String},
    value: {type: String}
});

schemas.Task = new Schema({
    data: [schemas.Datum]
});

schemas.RunningTask = new Schema({
    taskId: {type: String, default:uuid.v4, index: true},
    heartbeat: {type: Date, index:true},
    data: [schemas.Datum]
});

var jobStatuses = ["Map", "Sort", "Reduce", "Done"];

var Job;
schemas.Job = new Schema({
    jobId: {type: String, default:uuid.v4, index:true},
    status: {type: String, enum:jobStatuses, index:true},
    jobsAvailable: {type: Boolean, index:true},
    mapper: {type: String},
    mapInput: [schemas.Task],
    mapRunning: [schemas.RunningTask],
    mapOutput: [schemas.Task],

    reducer: {type: String},
    reduceInput: [schemas.Task],
    reduceRunning: [schemas.RunningTask],
    reduceOutput: [schemas.Task]
});

schemas.Job.pre('save', function(next){
    this.jobsAvailable = !!(this.mapInput.length || this.reduceInput.length);
    next();
});

schemas.Job.methods.dropRunning = function(min_last_heartbeat){
    console.log("about to drop some tasks expiration:", min_last_heartbeat);
    var compare = function(task){
        return task.heartbeat < min_last_heartbeat;
    };
    var job = this;
    var dropped = 0;
    var pushback = function(runningList, inputList){
        var expired = _.filter(runningList, compare);
        var remaining = _.reject(runningList, compare);
        dropped += expired.length;
        _.each(expired, function(task){
            inputList.push({data: task.data});
        });
        return remaining;
    };

    this.mapRunning = pushback(this.mapRunning, this.mapInput);
    this.reduceRunning = pushback(this.reduceRunning, this.reduceInput);

    this.save(function(err){
        if(err){
            console.error(err);
        } else {
            console.log('Dropped ' + dropped + ' tasks, put back on the list.');
            Job.findById(job._id, function(err, job){console.log(job.mapRunning)});
        }
    });
};

schemas.Job.statics.heartbeat = function(taskId){
    Job.findOne().or([{'mapRunning.taskId': taskId},
                    {'reduceRunning.taskId': taskId}]).run(function(err, job){
        if(err){
            console.error(err);
        } else {
            var hasTaskid = function(task){
                return task.taskId == taskId;
            };
            var result;
            if(result = _.find(job.mapRunning, hasTaskid)){
                result.heartbeat = new Date();
            } else if(result = _.find(job.reduceRunning, hasTaskid)){
                result.heartbeat = new Date()
            } else {
                console.error("WTF!");
            }
            if(result){
                job.save(function(err){
                    if(err){
                        console.error(err);
                    } else {
                        console.log("Updated heartbeat");
                    }
                });
            }
        }
    });
};

schemas.Job.methods.fetchTask = function(ret){
    var job = this;
    var code;
    var setRunning = function(fetchFrom, pushTo){
        var task = fetchFrom.pop();
        var newTask = {
            taskId: uuid.v4(),
            heartbeat: new Date()
        };
        newTask.data = task.data;
        pushTo.push(newTask);
        job.save(function(err){
            if(err){
                console.error(err);
            } else {
                ret(newTask, code);
            }
        });
    };
    if(this.mapInput.length){
        code = this.mapper;
        setRunning(this.mapInput, this.mapRunning);
    } else if(this.reduceInput.length){
        code = this.reducer;
        setRunning(this.reduceInput, this.reduceRunning);
    } else {
        console.warn("Can't get any jobs from this guy.");
    }
};

schemas.Job.statics.fetchTask = function(ret){
    this.findOne({'jobsAvailable': true}, function(err, job){
        if(err){
            console.log(err);
        } else if(!job){
            console.log("Couldn't find anything");
            ret(null);
        } else {
            console.log("Found something");
            job.fetchTask(ret);
        }
    });
};

Job = exports.Job = mongoose.model('Job', schemas.Job);

exports.cleanupInterval = 6000;
var cleanupDelay = 12000;

exports.cleanup = function(){
    var expiration = new Date(new Date() - cleanupDelay);
    Job.find().or([{'mapRunning.heartbeat': {'$lt': expiration}}, 
                    {'reduceRunning.heartbeat': {'$lt': expiration}}]).run(function(err, jobs){
        if(err){
            console.error(err);
        } else {
            _.invoke(jobs, 'dropRunning', expiration);
        }
    });
};
