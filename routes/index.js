var express = require('express');
var router = express.Router();
var VerifyToken = require('../services/verifyToken');
var Stack = require('stackjs');
var User = require('../models/users')
var s = new Stack();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/balanced', VerifyToken ,function(req,res,next){
	if(!req.body.expression){
		return res.status(400).send({'status':false,message:'Required parameters not passed'});
	}
	else{
		var response = areParanthesisBalanced(req.body.expression)
		if(response == 'balanced'){
      User.findOneAndUpdate({ _id: req.userId,status:1 }, { $set: { attempts: 0 }})
        .select('email attempts')
        .exec(function(err, db_res) { 
          if (err) { 
            throw err; 
          } 
          else { 
            res.send({username:db_res.name,message:response});
          } 
      });

			// console.log('successfull attempt');
		}
		else{
      console.log(req.userId)
			User.findOneAndUpdate({ _id: req.userId,status:1 }, { $inc: { attempts: 1 }})
        .select('email attempts name')
        .exec(function(err, db_res) { 
          if (err) { 
            throw err; 
          } 
          else { 
      			res.send({username:db_res.name,'message':response,attempts:db_res.attempts+1});
          } 
      });
			// console.log('unsuccessfull attempt');
		}
	}
})


function areParanthesisBalanced(expr)
{
	var x;
	for (let i=0; i<expr.length; i++)
	{
		  // console.log('index is :' +i  + 'and stack is'+ JSON.stringify(s));
	    if (expr[i]=='('||expr[i]=='['||expr[i]=='{')
	    {
	        s.push(expr[i]);
	        // console.log('after push stack is -> ' + JSON.stringify(s))
	        continue;
	    }

	    if (s.isEmpty()) {
	    	// console.log("Stack is empty...")
	    	switch (expr[i])
        {      
          case ')':
             // console.log('case ")" stack is -> ' + JSON.stringify(s))
              return 'missing ('
              break;
 
          case '}':
              // console.log('case "}" stack is -> ' + JSON.stringify(s))
              return 'missing {'
              break;
 
          case ']':
              // console.log('case "]" stack is -> ' + JSON.stringify(s))
            	return 'missing [' 
              break;
        }
	    }
	    else {
	    	// console.log("Stack is not empty...")
      //   console.log('stack is -> ' + JSON.stringify(s))
	    switch (s.peek())
        {
          case '(':
             console.log('case "(" stack is -> ' + JSON.stringify(s))
             var ret = evaluate_left(s,expr[i],i,expr.length); 
              if(ret == undefined) break;
              else{
                return ret;
                break;
              }
               
          case '{':
              // console.log('case "{" stack is -> ' + JSON.stringify(s))
              var ret = evaluate_left(s,expr[i],i,expr.length); 
              if(ret == undefined) break;
              else{
                return ret;
                break;
              }
 
          case '[':
              // console.log('case "[" stack is -> ' + JSON.stringify(s))
              var ret = evaluate_left(s,expr[i],i,expr.length); 
              if(ret == undefined) break;
              else{
                return ret;
                break;
              }
        }

	    }

	}
  if (!s.isEmpty()) {
  	  // console.log("The last peek = " +  s.peek())  
      return rev(s.pop()) + ' is missing'
  }

}

function evaluate_left(s,expr,i,length)
{

    // console.log("The copied stack is " + JSON.stringify(s))
    var lparam = false
    var balance = true
    var last = s.peek()

    // console.log("peek value = last =  " + last)
    // console.log("expr value = expr =  " + expr)
    while (!s.isEmpty()) {
    	var pop = s.pop()
    	// console.log("pop value = pop =  " + pop)
    	// console.log("rev expr value = rev(expr) =  " + rev(expr))
    	if (rev(expr) == pop) {
    		lparam = true
    		// console.log("laparam value = lparam =  " + lparam)
    		break;
    	}
    	else {
    		balance = false
    		// console.log("balance value = balance =  " + balance)
    	}
    }

    if (lparam == true && balance == true ) {
    	// console.log(" last is === " + last)
    	// console.log(" expr is === " + expr)
    	// console.log(" 1 cond...")
      if(i == length-1 && s.isEmpty()){
        console.log('llllllllimit reached')
        return 'balanced';
      }
      else{
        console.log('elements left out')
      }
    }
    else if (lparam == true && balance == false ) {
    	// console.log(" last is === " + last)
    	// console.log(" expr is === " + expr)
    	// console.log(" 2 cond...")
    	return rev(last) + ' is missing'
    }
    // else if (lparam == false && balance == true ) {
    // 	console.log(" last is === " + last)
    // 	console.log(" expr is === " + expr)
    // 	console.log(" 3 cond...")
    // 	return rev(last) + ' is missing'
    // }
    else if (lparam == false && balance == false ) {
    	// console.log(" last is === " + last)
    	// console.log(" expr is === " + expr)
    	// console.log(" 4 cond...")
    	return rev(expr) + ' is missing'
    }

}

function rev(exp)
{
	var ret
	switch(exp)
	{
		case '(':
		    ret = ')'
        break;
    case '{':
		    ret = '}'
        break;
    case '[':
		    ret = ']'
        break;
    case ')':
		    ret = '('
        break;
    case '}':
		    ret = '{'
        break;
    case ']':
		    ret = '['
        break;
	}
	return ret
}

module.exports = router;
