const express=require('express')
const {Board} =require('../Models/BoardModel')
const {Subtask}=require('../Models/SubTask')
const {Task}=require('../Models/TaskModel')
let boardRouter=express.Router()


// Create Boards
boardRouter.post('/',async(req,res)=>{
    try{
        const {name}=req.body
        const board=new Board({name})
        await board.save()
        res.status(200).send({'msg':"New Board Created Successfully"})
    }
    catch(err){
        res.status(400).json({"err":err.message})
    }
})

//Get all boards
boardRouter.get('/',async(req,res)=>{
    try{
        const boards=await Board.find().populate({
            path:'tasks',
            populate:{
                path:'subtasks',
            },
        })
        res.status(200).send({'msg':boards})
    }
    catch(err){
        res.status(400).json({"err":err.message})
    }
})

boardRouter.get('/:boardId',async(req,res)=>{
    try{
        const boardId=req.params.boardId
        console.log(boardId)
        const boards=await Board.findById(boardId).populate({
            path:'tasks',
            populate:{
                path:'subtasks',
            },
        })
        res.status(200).send({'msg':boards})
    }
    catch(err){
        res.status(400).json({"err":err.message})
    }
})

// Create a new task for a specific board
boardRouter.post('/:boardId/tasks',async(req,res)=>{
    try{
        const {title,description,status,subtasks}=req.body;
        const task=new Task({title,description,status,subtasks})
        await task.save()
        const board=await Board.findById(req.params.boardId)
        board.tasks.push(task)
        await board.save();
        res.status(201).send({'msg':"task saved sucessfully"})
    }
    catch(err){
        res.status(400).json({"err":err.message})
    }
})


boardRouter.post('/tasks/:taskId/subtasks',async(req,res)=>{
    try{
        const { title,isCompleted}=req.body
        const subtask=new Subtask({title,isCompleted})
        await subtask.save()
        const task=await Task.findById(req.params.taskId)
        if(!task){
            return res.status(400).send({"error":'Task not found'})
        }
        task.subtasks.push(subtask._id)
        await task.save()
        res.status(201).send({subtask})
    }
    catch(err){
        res.status(400).json({"err":err.message})
    }
})


// Update as task's details

boardRouter.put('/tasks/:taskId',async(req,res)=>{
    try{
        const {title,description,status,subtasks}=req.body;
        const task=await Task.findByIdAndUpdate(
            {title,description,status,subtasks},
            {new:true}
        );
        res.status(200).send(task)
    }
    catch(err){
        res.status(400).json({"err":err.message})
    }
})
// Delete Task

boardRouter.delete('/tasks/:taskId', async (req, res) => {
    try {
      const taskId = req.params.taskId;
      const task = await Task.findById(taskId);
      console.log(task)
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      // Find and delete all subtasks associated with the task
      await Subtask.deleteMany({ _id: { $in: task.subtasks } });
      // Remove task reference from the board and then delete the task
      const board = await Board.findOneAndUpdate(
        { tasks: taskId },
        { $pull: { tasks: taskId } }
      );
      await Task.findByIdAndDelete(taskId);
      res.status(200).json({ message: 'Task and its subtasks deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


 boardRouter.put('/tasks/:taskId/subtasks/:subtaskId',async(req,res)=>{
    try{
const {isCompleted}=req.body
const taskId=req.params.taskId;
const subtaskId=req.params.subtaskId
const task= await Task.findById(taskId)
if(!task){
    return res.status(404).json({error:"Task not found"})
}
if(!task.subtasks.includes(subtaskId)){
    return res.status(404).json({error:"Subtak not found in teh task"})
}
await Subtask.findByIdAndUpdate(subtaskId,{isCompleted},{new:true})
res.status(200).json({"message":"Subtask updaed successfully"})
    }

    catch(err){
        res.status(400).json({"err":err.message})
    }
 })

module.exports={
    boardRouter
}