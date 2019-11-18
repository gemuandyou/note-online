var md = require('../note/markdown');
var fh = require('../note/file-handler');
var mysql = require('../db/mysql/mysql-crud.js');
var es = require('../db/elasticsearch/es-crud.js');

module.exports = function (app) {

    /**
     * 关键字搜索
     */
    app.post('/note/search', (req, res) => {
        let esQuery = {
            "_source": {
                "includes": [ "id" ],
                "excludes": []
            },
            "size": 20,
            "from": 0,
            "sort": {
                "_score": {
                    "order": "desc"
                },
                "_id": {
                    "order": "asc"
                }
            },
            "query": {
                "bool": {
                    "should": [
                        {
                            "match": {
                                "note_title": req.body.searchKey
                            }
                        },
                        {
                            "match": {
                                "note_content": req.body.searchKey
                            }
                        }
                    ]
                }
            }
        };
        if (req.body.esSearchAfter && req.body.esSearchAfter.length > 0) {
            esQuery["search_after"] = req.body.esSearchAfter;
        }
        es.searchNote(esQuery, (result) => {
            if (result && result.hits && result.hits.total > 0) {
                res.json({
                    'data': {
                        'results': result.hits.hits
                    }
                });
            } else if (result) {
                res.json({
                    'data': {
                        'results': []
                    }
                });
            } else {
                res.json({
                    'data': 'ERROR_100'
                });
            }
        });
    });

    /**
     * 获取笔记列表
     */
    app.post('/note/list', (req, res) => {
        mysql.getAllPublicNotes(
            req.body.pageStart,
            req.body.pageSize,
            req.body.author,
            req.body.tags,
            req.body.searchKey,
            req.body.createDate, (error, results, fields) => {
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

    /**
     * 获取笔记列表
     */
    app.post('/note/listByIds', (req, res) => {
        mysql.getNotesByIds(req.body.ids, (error, results, fields) => {
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

    /**
     * 删除笔记
     */
    app.post('/note/delete', (req, res) => {
        if (req.body) {
            mysql.deleteNote(req.body.noteId, req.body.author, req.body.noteUrl, (error, results) => {
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
        }
    });

    /**
     * 将markdown格式文本渲染为HTML
     */
    app.post('/note/renderToHtml', (req, res) => {
        if (req.body && req.body.data) {
            res.json({
                "data": md.renderToHtml(req.body.data)
            });
        } else {
            res.status(500).json();
        }
    });

    /**
     * 将markdown格式文本保存到md文件中
     */
    app.post('/note/saveToMd', (req, res) => {
        var path;
        if (req.body && req.body.data) {
            path = fh.writeToMd(req.body.fileName, req.body.data);
        }
        res.json({data: path});
    });

    /**
     * 将markdown格式文本保存到MYSQL中
     */
    app.post('/note/saveToMySql', (req, res) => {
        var path;
        if (req.body && req.body.noteTitle && req.body.noteUrl) {
            mysql.saveNote(req.body.noteTitle, req.body.noteUrl, req.body.noteIntroduction, req.body.noteContent, req.body.author, function (error, results) {
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
     * 更新笔记到MYSQL中
     */
    app.post('/note/modifyToMySql', (req, res) => {
        var path;
        if (req.body && req.body.noteTitle && req.body.noteUrl) {
            mysql.modifyNote(req.body.noteTitle, req.body.noteUrl, req.body.noteIntroduction, req.body.noteContent, req.body.author, function (error, results) {
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
     * 从md文件中读取markdown格式内容
     */
    app.post('/note/readFromMd', (req, res) => {
        var content;
        if (req.body && req.body.path) {
            content = fh.readFromMd(req.body.path, req.body.absolute);
        }
        res.json({
            'data': content
        });
    });

    /**
     * 从mysql中读取指定作者笔记数据
     */
    app.post('/note/listByAuthorFromMysql', (req, res) => {
        var content;
        if (req.body && req.body.author) {
            mysql.getAuthorNotes(
                req.body.pageStart,
                req.body.pageSize,
                req.body.author,
                req.body.tags,
                req.body.createDate,
                (error, results, fields) => {
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
        } else {
            res.status(400).send();
        }
    });

    /**
     * 获取指定作者笔记的日期列表
     */
    app.post('/note/listDateByAuthorFromMysql', (req, res) => {
        mysql.getAuthorNoteDates(req.body.author, (error, results, fields) => {
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

    /**
     * 获取指定作者笔记的日期列表
     */
    app.post('/note/listDateFromMysql', (req, res) => {
        mysql.getNoteDates((error, results, fields) => {
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

    /**
     * 建立笔记和标签关系
     */
    app.post('/note/relTags', (req, res) => {
        if (!req.body.noteId || !req.body.tags) {
            res.status(400).send();
        } else {
            // 删除笔记的所有标签
            mysql.removeAllNoteTagRel(req.body.noteId, (error, results) => {
                if (error) {
                    res.status(500).send(error);
                } else if (!req.body.tags.length) {
                    res.status(200).send();
                } else {
                    // 重新建立笔记和标签关系
                    req.body.tags.forEach((val, index) => {
                        mysql.getTag(val, (error, results, fields) => {
                            if (error) {
                                res.status(500).send(error);
                            } else if (results[0]) {
                                var tag = results[0];
                                mysql.saveNoteTagRel(tag.id, req.body.noteId, (error, results) => {
                                    if (error) {
                                        res.status(500).send(error);
                                    } else {
                                        if (index === req.body.tags.length - 1) {
                                            res.json({
                                                'data': {
                                                    'results': results,
                                                    'fields': fields
                                                }
                                            });
                                        }
                                    }
                                });
                            } else {
                                res.status(400).send();
                            }
                        });
                    });
                }
            });
        }
    });

    /**
     * 获取指定笔记的标签列表
     */
    app.post('/note/getNoteTags', (req, res) => {
        mysql.getNoteTags(req.body.noteId, (error, results, fields) => {
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

    /**
     * 清除指定笔记的指定标签
     */
    app.post('/note/removeNoteTagRel', (req, res) => {
        mysql.removeNoteTagRel(req.body.noteId, req.body.tagId, (error, results, fields) => {
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

    /**
     * 公开笔记
     */
    app.post('/note/publish', (req, res) => {
        mysql.publish(req.body.noteId, (error, results, fields) => {
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

    /**
     * 取消公开笔记
     */
    app.post('/note/unpublish', (req, res) => {
        mysql.unpublish(req.body.noteId, (error, results, fields) => {
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