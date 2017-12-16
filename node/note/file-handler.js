/*
 * 文件操作
 * Created by gemu on 2017-10-14 12:34:49
 */
var fs = require('fs');
var path = require('path');
var config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/note.conf.json')));

/**
 * 同步方式递归创建文件夹
 * @param dirPath 文件夹目录 
 */
var mkFolder = function (dirPath) {
  if (!fs.existsSync(dirPath)) {
    if (mkFolder(path.dirname(dirPath))) {
      fs.mkdirSync(dirPath);
      return true;
    }
    return false;
  } else {
    return true;
  }
};

/**
 * 初始化
 */
(() => {
  mkFolder(config.mdPath);
})();

module.exports = {

  /**
   * 将markdown格式文本写入到md文件
   * @param path 文件路径+文件名。格式：/a/b.md
   * @param content markdown格式内容
   * @return 文件路径
   */
  writeToMd: function (path, content) {
    path = config.mdPath + path;
    mkFolder(path.substring(0, path.lastIndexOf('/')));
    if (content) {
      if (!fs.existsSync(path)) {
        fs.writeFileSync(path, content);
        return path;
      } else {
        try {
          fs.truncate(path, 0, () => {
            fs.writeFileSync(path, content, {
              'mode': 755,
              'flag': 'w+'
            });
          });
          return path;
        } catch (e) {
          console.log(e); // operation not permitted
          fs.unlink(path, () => {
            fs.writeFileSync(path, content, {
              'mode': 755,
              'flag': 'w+'
            });
          });
          return path;
        }
      }
    }
    return '';
  },

  /**
   * 从md文件中读取markdown格式内容
   * @param path md文件路径
   * @param absolutePath 是否是绝对路径
   * @return markdown文件内容
   */
  readFromMd: function (path, absolutePath) {
    if (!absolutePath) {
      path = config.mdPath + path;
    }
    if (!fs.existsSync(path)) {
      // return fs.openSync(path, 'w+');
      return "";
    } else {
      return fs.readFileSync(path, 'utf-8');
    }
  },

  /**
   * 
   */
  loadAllMd: function (path) {
    path = prePath + path;
    if (!fs.existsSync(path)) {
      // return fs.openSync(path, 'w+');
      return "";
    } else {
      return fs.readFileSync(path, 'utf-8');
    }
  }

}
