const http = require('http');
var person = {name:"MG", email:"mg", age: 35};

const fs = require('fs');
try {
    const data = fs.readFileSync('./person.json', 'utf-8');
    console.log(data);
    person = JSON.parse(data);
} catch (error) {
    fs.writeFileSync('./person.json',JSON.stringify(person));
}

http.createServer((request, response) => {
    request.on('error', (err) => {
      console.error(err);
      response.statusCode = 400;
      response.end();
    });
    
  response.on('error', (err) => {
    console.error(err);
  });

  console.log(request.url);
  if (request.method === 'POST' && request.url === '/setUserData') {
    let body = "";
    request.on('data', (chunk) => {
        body += chunk;
    }).on('end', () => {
        try {
            const parsedData = JSON.parse(body);
            console.log(parsedData);
            const oldData = person;
            console.log("body is" + body);
            person = parsedData;
            fs.writeFile('./person.json',JSON.stringify(person),'utf8',function (err) {
                if (err) throw err;
                console.log('Saved!');
              });
              
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({success:true, oldData, person}));

          } catch (e) {
            console.error(e.message);
              
            response.statusCode = 500;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({success:false}));
          }
    });
  } else 
  if (request.method === 'GET' && request.url === '/getUserData') {  
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(person));
  } else {
    response.statusCode = 404;
    response.end();
  }
}).listen(8080,()=> console.log(`Server running at http://localhost:8080/`));