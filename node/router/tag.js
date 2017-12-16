var mysql = require('../db/mysql/mysql-crud.js');

module.exports = function (app) {

  /**
   * 获取标签列表
   */
  app.post('/tag/list', (req, res) => {
    mysql.tagList(req.body.tagName, (error, results, fields) => {
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
  });

  /**
   * 添加标签
   */
  app.post('/tag/save', (req, res) => {
    if (!req.body.tagName) {
      res.status(400).send();
    }
    mysql.saveTag(req.body.tagName, req.body.creator, (error, results) => {
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
  });

  /**
   * 获取指定标签
   */
  app.post('/tag/get', (req, res) => {
    if (!req.body.tagName) {
      res.status(400).send();
    }
    mysql.getTag(req.body.tagName, (error, results, fields) => {
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
  });


};
