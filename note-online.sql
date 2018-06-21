/*
 Source Database       : note-online

 Target Server Type    : MySQL
 Target Server Version : 80011
 File Encoding         : utf-8

 Date: 06/21/2018 15:41:51 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  笔记表
-- ----------------------------
DROP TABLE IF EXISTS `note`;
CREATE TABLE `note` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '存储笔记元数据',
  `note_title` varchar(50) NOT NULL COMMENT '笔记标题',
  `note_url` text NOT NULL COMMENT '笔记存储地址',
  `note_introduction` text COMMENT '笔记简介',
  `note_content` longtext COMMENT '笔记内容（md格式）',
  `author` varchar(50) DEFAULT NULL COMMENT '笔记作者',
  `private` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否共享。0：共享；1：不共享。默认为0.',
  `create_date` datetime NOT NULL COMMENT '创建时间',
  `modify_date` datetime DEFAULT NULL COMMENT '修改时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否已被删除。0：未删除；1：已删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
--  笔记和标签关系表
-- ----------------------------
DROP TABLE IF EXISTS `rel_note_tag`;
CREATE TABLE `rel_note_tag` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '标签和笔记关系表',
  `tag_id` int(20) NOT NULL COMMENT '标签ID',
  `note_id` int(20) NOT NULL COMMENT '笔记ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
--  标签表
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '笔记标签',
  `tag_name` varchar(100) NOT NULL COMMENT '标签名',
  `creator` varchar(50) DEFAULT NULL COMMENT '创建人',
  `create_date` datetime NOT NULL COMMENT '创建日期',
  `modify_date` datetime DEFAULT NULL COMMENT '修改日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
--  用户表
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '用户',
  `name` varchar(50) NOT NULL COMMENT '用户姓名。唯一',
  `password` varchar(100) NOT NULL COMMENT '密码',
  `gender` varchar(10) DEFAULT NULL COMMENT '性别',
  `age` int(3) DEFAULT NULL COMMENT '年龄',
  `phone` varchar(11) DEFAULT NULL COMMENT '手机号',
  `login_address` varchar(15) DEFAULT NULL COMMENT '最近一次登录地址',
  `create_date` datetime NOT NULL COMMENT '创建时间',
  `last_date` datetime DEFAULT NULL COMMENT '上次登录时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
