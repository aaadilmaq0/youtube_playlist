const mongoose = require("mongoose");
var Video = {
    id : { type : String, required: true },
    title :{ type : String, required: true },
    thumbnail : { type : String, required: true },
    start : { type : Number},
    end : { type : Number},
    hours : { type : Number},
    minutes : { type : Number},
    seconds : { type : Number},
    channel : { type : String, required: true },
    views: { type: Number}
}
const videoSchema = mongoose.Schema({
    userId : {type: String, required:true},
    video: Video
  });
module.exports = mongoose.model("Video", videoSchema);