var mysql = require('../db/mysql/mysql-crud.js');
var addressUtil = require('../util/address-util');

module.exports = function (app) {
  /**
   * 从mysql中根据用户名获取用户
   */
  app.post('/user/getUserByName', (req, res) => {
    if (req.body && req.body.username) {
      mysql.getUserByName(req.body.username, (error, results) => {
        if (error) {
          res.status(500).send(error);
        } else {
          res.json({
            'data': {
              'results': results
            }
          });
        }
      });
      // TODO 
    } else {
      res.status(400).send();
    }
  });

  /**
   * 从mysql中根据用户名获取用户
   */
  app.post('/user/userRegist', (req, res) => {
    if (req.body && req.body.username) {
      req.body.password = req.body.password || '';
      var address = addressUtil.getClientIp(req);
      mysql.userRegist(req.body.username, req.body.password, req.body.gender, req.body.age, req.body.phone, address, (error, results) => {
        if (error) {
          res.status(500).send(error);
        } else {
          res.json({
            'data': {
              'results': results
            }
          });
        }
      });
    } else {
      res.status(400).send();
    }
  });

  /**
   * 登陆
   */
  app.post('/user/login', (req, res) => {
    var content;
    if (req.body && req.body.username) {
      req.body.password = req.body.password || '';
      var address = addressUtil.getClientIp(req);
      mysql.login(req.body.username, req.body.password, (error, results, fields) => {
        if (error) {
          res.status(500).send(error);
        } else if (results && results[0]) {
          mysql.updateLogin(req.body.username, address, () => {
            res.json({
              'data': {
                'results': results
              }
            });
          });
        } else {
          res.status(401).send();
        }
      });
    } else {
      res.status(400).send();
    }
  });

  /**
   * 验证登陆
   */
  app.post('/user/verifyLogin', (req, res) => {
    var content;
    if (req.body && req.body.username) {
      var address = addressUtil.getClientIp(req);
      mysql.verifyLogin(req.body.username, address, (error, results, fields) => {
        if (error) {
          res.status(500).send(error);
        } else if (results && results[0]) {
          res.json({
            'data': {
              'results': results
            }
          });
        } else {
          res.json({
            'code': 401
          });
        }
      });
    } else {
      res.status(400).send();
    }
  });

  /**
   * 获取用户列表
   */
  app.post('/user/list', (req, res) => {
    mysql.userList((error, results, fields) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.json({
          'data': {
            'results': results,
            'fields': fields
          }
        });
      }
    });
  });

};
