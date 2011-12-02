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

var jobStatuses = ["Map", "Reduce", "Done"];

var Job;
schemas.Job = new Schema({
    jobId: {type: String, default:uuid.v4, index:true},
    status: {type: String, enum:jobStatuses, index:true, default:"Map"},
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
    //console.log("about to drop some tasks expiration:", min_last_heartbeat);
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
            //console.log('Dropped ' + dropped + ' tasks, put back on the list.');
            Job.findById(job._id, function(err, job){
                //console.log(job.mapRunning)
            });
        }
    });
};

schemas.Job.methods.checkMapCompletion = function(){
    if(!(this.mapInput.length || this.mapRunning.length)){
        var output = [];
        _.each(this.mapOutput, function(task){
            _.each(task.data, function(datum){
                output.push({key:datum.key, value:datum.value});
            });
        });
        this.reduceInput = _.map(_.groupBy(output, 'key'), 
            function(pairs, key){
                return {data:[{key: key, value: JSON.stringify(_.pluck(pairs,'value'))}]};
            }
        );
        this.mapOutput = [];
        this.status = "Reduce";
    }
};

schemas.Job.methods.checkReduceCompletion = function(){
    if(!(this.reduceInput.length || this.reduceRunning.length)){
        this.status = "Done";
    }
};

schemas.Job.statics.heartbeat = function(taskId){
    Job.findOne().or([{'mapRunning.taskId': taskId},
                    {'reduceRunning.taskId': taskId}]).run(function(err, job){
        if(err){
            console.error(err);
        } else if(job) {
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
                        //console.log("Updated heartbeat");
                    }
                });
            }
        } else {
            console.warn("Attempted to refresh heartbeat on #", taskId);
        }
    });
};

schemas.Job.statics.commitResults = function(taskId, data){
    Job.findOne().or([{'mapRunning.taskId': taskId},
                    {'reduceRunning.taskId': taskId}]).run(function(err, job){
        if(err){
            console.error(err);
        } else if(job){
            var hasTaskid = function(task){
                return task.taskId == taskId;
            };
            var result;
            var save = function(){
                job.save(function(err){
                    if(err){
                        console.error(err);
                    } else {
                        //console.log("Saved work result");
                    }
                });
            };
            if(result = _.find(job.mapRunning, hasTaskid)){
                job.mapRunning = _.without(job.mapRunning, result);
                job.mapOutput.push({data: data});
                job.checkMapCompletion();
                save();
            } else if(result = _.find(job.reduceRunning, hasTaskid)){
                job.reduceRunning = _.without(job.reduceRunning, result);
                job.reduceOutput.push({data: data});
                job.checkReduceCompletion();
                save();
            } else {
                console.error("WTF!");
            }
        } else {
            console.error("No task found for id #", taskId, " WTF?");
        }
    });
};

schemas.Job.methods.fetchTask = function(ret){
    var job = this;
    var code;
    var setRunning = function(data, pushTo){
        var newTask = {
            taskId: uuid.v4(),
            heartbeat: new Date(),
            data: data
        };
        pushTo.push(newTask);
        return newTask;
    };
    var save = function(newTask){
        job.save(function(err){
            if(err){
                console.error(err);
            } else {
                ret(newTask, code);
            }
        }); 
    }
    if(this.mapInput.length){
        code = this.mapper;
        var data = this.mapInput[0].data;
        this.mapInput = this.mapInput.slice(1);
        save(setRunning(data, this.mapRunning))
    } else if(this.reduceInput.length){
        code = this.reducer;
        var data = this.reduceInput[0].data;
        this.reduceInput = this.reduceInput.slice(1);
        save(setRunning(data, this.reduceRunning))
    } else {
        console.warn("Can't get any jobs from this guy.");
    }
};

schemas.Job.statics.fetchTask = function(ret){
    this.findOne({'jobsAvailable': true}, function(err, job){
        if(err){
            console.error(err);
        } else if(!job){
            //console.log("Couldn't find anything");
            ret(null);
        } else {
            //console.log("Found something");
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
