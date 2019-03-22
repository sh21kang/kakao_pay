const express = require('express')
const app = express()
const template = require('./lib/template.js')
const port = 3000
const request = require("request")
const bodyParser = require('body-parser')
const cookie = require("cookie")


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    let html = template.HTML();
    res.send(html);
})
app.get('/kakaopay_process',(req,res) =>{
    let bodycontent = {
        "cid":"TC0ONETIME" ,
        "partner_order_id":"partner_order_id" ,
        "partner_user_id":"partner_user_id" ,
        "item_name":"초코파이" ,
        "quantity":"1" ,
        "total_amount":"2200" ,
        "vat_amount":"200" ,
        "tax_free_amount":"0" ,
        "approval_url":"http://www.xn--en1bo2f3ybe01a6jg9xi.com:3000/help" ,
        "fail_url":"http://www.xn--en1bo2f3ybe01a6jg9xi.com:3000/help" ,
        "cancel_url":"http://www.xn--en1bo2f3ybe01a6jg9xi.com:3000/help  "
        // "approval_url":"http://localhost:3000/help" ,
        // "fail_url":"http://localhost:3000/help" ,
        // "cancel_url":"http://localhost:3000/help"
    };
    request.post({
        headers: {'content-type' : 'application/x-www-form-urlencoded',
                    "Authorization": "KakaoAK 1a8e9a0a3c6926925c24bc9d5bc51bb4",
                    },
        url:     "https://kapi.kakao.com/v1/payment/ready",
        form: bodycontent,
        json: true
    }, function(error, response, body){
        console.log(body); 
        //res.set 
        res.cookie('tid', body.tid);
        //res.cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true }); 
        res.redirect(body.next_redirect_pc_url);
    });
})

app.get('/help', (req, res) => {
     let cookies = {};
     console.log(req.headers);
     if(req.headers.cookie !== undefined ) {
        console.log(req.headers.cookie) 
        cookies = cookie.parse(req.headers.cookie);}
    console.log(cookies);
    console.log(req.query.pg_token);
    let bodycontent = {
        "cid":"TC0ONETIME" ,
        "partner_order_id":"partner_order_id" ,
        "partner_user_id":"partner_user_id" ,
        "tid":`${cookies.tid}`,
        "pg_token" : `${req.query.pg_token}`

    };
    request.post({
        headers: {'content-type' : 'application/x-www-form-urlencoded',
                    "Authorization": "KakaoAK 1a8e9a0a3c6926925c24bc9d5bc51bb4",
                    },
        url:     "https://kapi.kakao.com/v1/payment/approve",
        form: bodycontent,
        json: true
    }, function(error, response, body){
        console.log(body);
        if(body.aid){
            res.send("success");
        }
        else{
        res.send("you are lier");
        }
    });
    

})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

