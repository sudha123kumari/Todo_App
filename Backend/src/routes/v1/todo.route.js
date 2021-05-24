const express = require("express");
const router = express.Router();
const Todos = require("../../models/todo.model");

/**
 * Get all TODOS:
 * curl http://localhost:8082/v1/todos
 *
 * Get todos with their "startDate" b/w startDateMin and startDateMax
 * curl http://localhost:8082/v1/todos?startDateMin=2020-11-04&startDateMax=2020-12-30
 * 
 */
router.get("/", async (req, res) => {
    if (req.query.startDateMax && req.query.startDateMin)
    {
        let startDateMin = new Date (req.query.startDateMin);
        let startDateMax = new Date (req.query.startDateMax);
        
        startDateMax.setTime(startDateMax.getTime());
        startDateMin.setTime(startDateMin.getTime());
      
      const allTodos = await Todos.find({
         startDate : {
             $lte : startDateMax,
             $gte : startDateMin,
         },
         }, (err , allTodos)=>{
         if(err){
            console.log(err);
            res.status(500).send();
         }else{
            res.send(allTodos);
         }
      });
   
    }

   else{
   
    const allTodos = await Todos.find({} , (err , allTodos)=>{
      if(err){
         console.log(err);
         res.status(500).send();
      }else{
         res.send(allTodos);
      }
   });
   }

});



/**
 * Add a TODO to the list
 * curl -X POST http://localhost:8082/v1/todos \
    -d '{"name": "Learn Nodejs by doing","startDate": "2021-01-07","endDate": "2021-01-09"}' \
    -H 'Content-Type: application/json'
*/

router.post("/", async (req, res) => {

    let name = req.body.name;
    let startDte = req.body.startDate;
    let endDte = req.body.endDate;
    
    const newTodo = await Todos.create({"name" : name , "startDate" : startDte , "endDate" : endDte}, (err , newTodo) => {
       if(err){
          console.log(err);
          res.sendStatus(500);
       }else{
          res.status(201).send(newTodo);
       }
      
    });
   
});

/**
 * Update an existing TODO
 * curl -v -X PUT http://localhost:8082/v1/todos \
    -d '{"_id": "<id-value>", "name": "Play tennis","startDate": "2021-01-07","endDate": "2021-01-09"}' \
    -H 'Content-Type: application/json'
 * 
 * Nb: You'll need to change the "id" value to that of one of your todo items
*/
router.put("/", (req, res) => {
  
   const idToUpdate =  req.body._id;
   const updatedTodo = {
      name : req.body.name,
      startDate : req.body.startDate,
      endDate : req.body.endDate,
      pending : req.body.pending,
   }

   Todos.findByIdAndUpdate(idToUpdate , updatedTodo , (err,doc) =>{
      if(err){
         console.log(err);
         res.sendStatus(500);
      }
      else if(doc === null){
         res.status(400).send({error :"Record  not found"});
      }
      else{
         res.status(204).send();
      }
   });   
});

/**
 * Delete a TODO from the list
 * curl -v -X "DELETE" http://localhost:8082/v1/todos/<id-value>
 *
 * Nb: You'll need to change "<id-value>" to the "id" value of one of your todo items
 */

router.delete("/:id", (req, res) => {
    const idToDelete = req.params.id;

    Todos.findByIdAndDelete(idToDelete , (err , result) => {
        if(err){
           console.log(err);
           res.sendStatus(500);
        }else{
           res.sendStatus(204);
        }
    });
});

module.exports = router;
