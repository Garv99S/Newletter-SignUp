const express = require('express');
const bodyparser = require('body-parser');
const request = require('request');
const http = require('https');

const app = express();

app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/signup.html");
})

app.post("/",(req,res)=>{
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;

    const data = {
        members : [
            {
            email_address : email,
            status : "subscribed",
            merge_fields : {
                FNAME : firstname,
                LNAME : lastname
            }
        }
    ]
    };

    const jsondata = JSON.stringify(data);

    const url = "https://us9.api.mailchimp.com/3.0/lists/8225297628";

    const options = {
        method : "POST",
        auth : "Gaurav:498afdfa84ff3e9e4fc19d085d050d74-us9"
    }

    const request = http.request(url,options,function(response){
        
        if(response.statusCode === 200)res.sendFile(__dirname + "/success.html");
        else{
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    });
    request.write(jsondata);
    request.end();
})


app.post("/failure",(req,res)=>{
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
    console.log("server is running on port 3000.");
});