const mongoose=require('mongoose')

const subtaskSchema=new mongoose.Schema({
    title : String,
	isCompleted : Boolean
})
const Subtask=mongoose.model('Subtask',subtaskSchema)

module.exports={
    Subtask
}

