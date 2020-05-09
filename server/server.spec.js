// it('funciona', () => {
//   expect(true).toBeTruthy();
// });

const express = require('express');
const logger = require('morgan');
const http = require('http');
const PinsRouter = require('./routes/pins');
const Pins = require('./models/Pins');
const request = require('request');
const app = express();


app.use(logger('dev'))
app.use(express.json())
app.use('/api', PinsRouter.router);
app.set('port', 3000)

describe('Testing router', () => {
  let server;

  beforeAll(() => {
    server = http.createServer(app);
    server.listen(3000);
  })

  afterAll(() => {
    server.close();
  })

  describe('GET', () => {

    //GET
    it('200 and find pin', done =>{
      const data = [{id: 1}];
      spyOn(Pins, 'find').and.callFake(callBack =>{
        callBack(false, data);
      })

      request.get('http://localhost:3000/api', (error, response, body) => {
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual([{id: 1}]);
        done();
      })

    })

    it('500 find', done =>{
      const data = [{id: 1}];
      spyOn(Pins, 'find').and.callFake(callBack =>{
        callBack(true, data);
      })

      request.get('http://localhost:3000/api', (error, response, body) => {
        expect(response.statusCode).toBe(500);
        done();
      })

    })

    it('200 and find by id', done =>{
      const data = [{id: 1}];
      const id = 1;

      spyOn(Pins, 'findById').and.callFake((id, callBack) => {
        callBack(false, data);
      })

      request.get('http://localhost:3000/api/'+id, (error, response, body) => {
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual([{id: 1}]);
        done();
      })

    })

    //GET 500
    it('500 find by id', (done) => {
      const data = [{id: 1}];
      const id = 1;
      spyOn(Pins, 'findById').and.callFake((id, callBack) => {
        // callback = function(err, post)
        callBack(true, data); // error = true
      });
      request.get('http://localhost:3000/api/'+id, (error, response, body) => {
        expect(response.statusCode).toBe(500);
        done();
      });
    });

  })

})
