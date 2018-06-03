var pool = require('./mysql-connect');

var userSelect = 'id, name, password, gender, age, phone, login_address loginAddress, create_date createDate, last_date lastDate';
var noteSelect = 'id, note_title noteTitle, note_url noteUrl, note_introduction noteIntroduction, note_content noteContent, author, private isme, create_date createDate, modify_date modifyDate';
var tagSelect = 'id, tag_name tagName, creator, create_date createDate, modify_date modifyDate';

module.exports = {

  // ==============================笔记====================================

  /**
   * 保存笔记
   * @param author 作者
   * @param day 日期
   * @param tag 标签
   * @return 笔记列表
   */
  saveNote: function (noteTitle, noteUrl, noteIntroduction, noteContent, author, callback) {
    pool.getConnection(function (err, connection) {
      var sql = 'INSERT INTO `note`(note_title, note_url, note_introduction, note_content, author, create_date) VALUES (?,?,?,?,?,now())';
      var params = [noteTitle, noteUrl, noteIntroduction, noteContent, author];
      connection.query(sql, params, function (error, results) {
        if (error) {
          callback(error, results);
        } else {
          callback(error, results);
        }
      });
      connection.release();
    });
  },

  /**
   * 更新笔记
   * @param author 作者
   * @param day 日期
   * @param tag 标签
   * @return 笔记列表
   */
  modifyNote: function (noteTitle, noteUrl, noteIntroduction, noteContent, author, callback) {
    pool.getConnection(function (err, connection) {
      var sql = 'UPDATE `note` SET note_title=?, note_introduction=?, note_content=?, author=?, modify_date=now() WHERE note_url=?';
      var params = [noteTitle, noteIntroduction, noteContent, author, noteUrl];
      connection.query(sql, params, function (error, results) {
        if (error) {
          callback(error, results);
        } else {
          callback(error, results);
        }
      });
      connection.release();
    });
  },

  /**
   * 删除笔记
   * @param id 笔记ID
   * @param author 笔记作者
   * @param noteUrl 笔记地址
   * @return 笔记列表
   */
  deleteNote: function (id, author, noteUrl, callback) {
    pool.getConnection(function (err, connection) {
      var sql = 'UPDATE `note` SET deleted = 1 WHERE id=? AND author=? AND note_url=?';
      var params = [id, author, noteUrl];
      connection.query(sql, params, function (error, results) {
        if (error) {
          callback(error, results);
        } else {
          callback(error, results);
        }
      });
      connection.release();
    });
  },

  /**
   * 获取所有共享的笔记
   * @param start 起始位置偏移量
   * @param size 要获取的记录数。-1表示全部
   */
  getAllPublicNotes: function (start, size, author, tags, searchKey, createDate, callback) {
    pool.getConnection(function (err, connection) {
      var sql = 'SELECT n.id, note_title noteTitle, note_url noteUrl, note_introduction noteIntroduction, ' +
        'note_content noteContent, author, private isme, create_date createDate, modify_date modifyDate FROM `note` n ';
      if (tags) {
        // TODO 防止SQL注入
        sql += 'JOIN `rel_note_tag` r ON r.note_id = n.id AND r.tag_id in ' + tags + ' ';
      }
      sql += 'WHERE deleted = 0 AND private = 0 ';
      var params = [];
      if (author) {
        sql += 'and author like ? ';
        params.push('%' + author + '%');
      }
      if (createDate) {
        sql += 'and DATE_FORMAT(create_date, \'%Y-%m-%d\') = ? ';
        params.push(createDate);
      }
      if (searchKey) {
        sql += 'and (note_title like ? or note_content like ?) ';
        params.push('%' + searchKey + '%');
        params.push('%' + searchKey + '%');
      }
      sql += 'ORDER BY create_date desc ';
      if (start != undefined && start >= 0 && size && size !== -1) {
        sql += 'limit ?,? ';
        params.push(start);
        params.push(size);
      }
      connection.query(sql, params, function (error, results, fields) {
        if (error) {
          callback(error, results, fields);
        } else {
          callback(error, results, fields);
        }
      });
      connection.release();
    });
  },

  /**
   * 获取指定人的笔记
   * @param author 作者
   */
  getAuthorNotes: function (start, size, author, tags, createDate, callback) {
    pool.getConnection(function (err, connection) {
      var sql = 'SELECT DISTINCT n.id, note_title noteTitle, note_url noteUrl, note_introduction noteIntroduction, ' +
        'note_content noteContent, author, private isme, create_date createDate, modify_date modifyDate FROM `note` n ';
      if (tags) {
        // TODO 防止SQL注入
        sql += 'JOIN `rel_note_tag` r ON r.note_id = n.id AND r.tag_id in ' + tags + ' ';
      }
      sql += 'WHERE deleted = 0 AND author = ? ';
      var params = [author];
      if (createDate) {
        sql += 'and DATE_FORMAT(create_date, \'%Y-%m-%d\') = ? ';
        params.push(createDate);
      }
      sql += 'ORDER BY create_date desc ';
      if (start != undefined && start >= 0 && size && size !== -1) {
        sql += 'limit ?,? ';
        params.push(start);
        params.push(size);
      }
      connection.query(sql, params, function (error, results, fields) {
        if (error) {
          callback(error, results, fields);
        } else {
          callback(error, results, fields);
        }
      });
      connection.release();
    });
  },

  /**
   * 获取指定人的笔记日期列表
   * @param author 作者
   */
  getAuthorNoteDates: function (author, callback) {
    pool.getConnection(function (err, connection) {
      connection.query('SELECT DATE_FORMAT(create_date, \'%Y-%m-%d\') createDate FROM `note` WHERE deleted = 0 AND author = ? GROUP BY create_date ORDER BY create_date desc', author, function (error, results, fields) {
        if (error) {
          callback(error, results, fields);
        } else {
          callback(error, results, fields);
        }
      });
      connection.release();
    });
  },

  // ==============================标签====================================

  /**
   * 根据参数条件获取标签列表
   * @param tagName 标签名
   */
  tagList: function (tagName, callback) {
    pool.getConnection(function (err, connection) {
      var sql = 'SELECT ' + tagSelect + ' FROM `tag` ';
      var params = [];
      if (tagName) {
        sql += 'WHERE tag_name like ? ';
        params.push('%' + tagName + '%');
      }
      sql += 'ORDER BY tag_name';
      connection.query(sql, params, function (error, results, fields) {
        if (error) {
          callback(error, results, fields);
        } else {
          callback(error, results, fields);
        }
      });
      connection.release();
    });
  },

  /**
   * 根据标签名获取标签
   * @param tagName 标签名
   */
  getTag: function (tagName, callback) {
    pool.getConnection(function (err, connection) {
      var sql = 'SELECT ' + tagSelect + ' FROM `tag` WHERE tag_name = ? limit 1';
      var params = [tagName];
      connection.query(sql, params, function (error, results, fields) {
        if (error) {
          callback(error, results, fields);
        } else {
          callback(error, results, fields);
        }
      });
      connection.release();
    });
  },

  /**
   * 创建笔记标签
   * @param tagName 标签名
   * @param creator 创建人
   */
  saveTag: function (tagName, creator, callback) {
    var sql = 'INSERT INTO `tag`(tag_name, creator, create_date) VALUES (?,?,now())';
    pool.getConnection(function (err, connection) {
      connection.query(sql, [tagName, creator], function (error, results, fields) {
        if (error) {
          callback(error, results, fields);
        } else {
          callback(error, results, fields);
        }
      });
      connection.release();
    });
  },

  /**
   * 清除指定笔记的所有标签
   */
  removeAllNoteTagRel: function (noteId, callback) {
    pool.getConnection(function (err, connection) {
      connection.query('DELETE FROM `rel_note_tag` WHERE note_id = ?', noteId, function (error, results) {
        callback(error, results);
      });
      connection.release();
    });
  },

  /**
   * 清除指定笔记的指定标签
   */
  removeNoteTagRel: function (noteId, tagId, callback) {
    pool.getConnection(function (err, connection) {
      connection.query('DELETE FROM `rel_note_tag` WHERE note_id = ? AND tag_id = ?', [noteId, tagId], function (error, results) {
        callback(error, results);
      });
      connection.release();
    });
  },

  /**
   * 为笔记添加标签
   * @param tagId 标签ID
   * @param noteId 创建ID
   */
  saveNoteTagRel: function (tagId, noteId, callback) {
    var sql = 'INSERT INTO `rel_note_tag`(tag_id, note_id) VALUES (?,?)';
    pool.getConnection(function (err, connection) {
      connection.query(sql, [tagId, noteId], function (error, results) {
        callback(error, results);
      });
      connection.release();
    });
  },

  // ==============================用户====================================

  /**
   * 用户列表
   */
  userList: function (callback) {
    pool.getConnection(function (err, connection) {
      var sql = 'SELECT ' + userSelect + ' FROM `user` ORDER BY name';
      connection.query(sql, '', function (error, results) {
        if (error) {
          callback(error, results);
        } else {
          callback(error, results);
        }
      });
      connection.release();
    });
  },

  /**
   * 添加用户
   */
  userRegist: function (username, password, gender, age, phone, address, callback) {
    pool.getConnection(function (err, connection) {
      var sql = 'INSERT INTO `user`(name, password, gender, age, phone, login_address, create_date) VALUES (?,?,?,?,?,?,now())';
      var params = [username, password, gender, age, phone, address];
      connection.query(sql, params, function (error, results) {
        if (error) {
          callback(error, results);
        } else {
          callback(error, results);
        }
      });
      connection.release();
    });
  },

  /**
   * 根据用户名获取用户
   * @param username 用户名
   */
  getUserByName: function (username, callback) {
    pool.getConnection(function (err, connection) {
      connection.query('SELECT id, name, password, gender, age, phone, login_address loginAddress, create_date createDate' +
        ' FROM `user` WHERE name = ? limit 1', username,
        function (error, results, fields) {
          if (error) {
            callback(error, results, fields);
          } else {
            callback(error, results, fields);
          }
        });
      connection.release();
    });
  },

  /**
   * 登陆
   * @param usernmme 用户名
   * @param password 密码
   */
  login: function (username, password, callback) {
    pool.getConnection(function (err, connection) {
      connection.query('SELECT ' + userSelect + ' FROM `user` WHERE name = ? and password = ?', [username, password],
        function (error, results, fields) {
          if (error) {
            callback(error, results, fields);
          } else {
            callback(error, results, fields);
          }
        });
      connection.release();
    });
  },

  /**
   * 验证登录状态
   * @param usernmme 用户名
   * @param address 地址
   */
  verifyLogin: function (username, address, callback) {
    pool.getConnection(function (err, connection) {
      connection.query('SELECT ' + userSelect + ' FROM `user` WHERE name = ? and login_address = ?', [username, address], function (error, results, fields) {
        if (error) {
          callback(error, results, fields);
        } else {
          callback(error, results, fields);
        }
      });
      connection.release();
    });
  },

  /**
   * 更新登陆地址
   * @param usernmme 用户名
   * @param address 地址
   */
  updateLogin: function (username, address, callback) {
    pool.getConnection(function (err, connection) {
      connection.query('UPDATE `user` SET login_address = ?, last_date = now() WHERE name = ?', [address, username], function (error, results) {
        if (error) {
          callback(error, results);
        } else {
          callback(error, results);
        }
      });
      connection.release();
    });
  },

  /**
   * 获取笔记的所有标签
   * @param noteId 笔记ID
   */
  getNoteTags: function (noteId, callback) {
    pool.getConnection(function (err, connection) {
      var sql = 'SELECT t.id, t.tag_name tagName, t.creator, t.create_date createDate, t.modify_date modifyDate FROM `tag` t JOIN `rel_note_tag` r ON r.tag_id = t.id AND r.note_id = ?';
      connection.query(sql, noteId, function (error, results) {
        if (error) {
          callback(error, results);
        } else {
          callback(error, results);
        }
      });
      connection.release();
    });
  },

  /**
   * 公开笔记
   * @param noteId 笔记ID
   */
  publish: function (noteId, callback) {
    pool.getConnection(function (err, connection) {
      var sql = 'UPDATE `note` SET private=0, modify_date=now() WHERE id=?';
      var params = [noteId];
      connection.query(sql, params, function (error, results) {
        if (error) {
          callback(error, results);
        } else {
          callback(error, results);
        }
      });
      connection.release();
    });
  },

  /**
   * 取消公开笔记
   * @param noteId 笔记ID
   */
  unpublish: function (noteId, callback) {
    pool.getConnection(function (err, connection) {
      var sql = 'UPDATE `note` SET private=1, modify_date=now() WHERE id=?';
      var params = [noteId];
      connection.query(sql, params, function (error, results) {
        if (error) {
          callback(error, results);
        } else {
          callback(error, results);
        }
      });
      connection.release();
    });
  }

}
