module.exports = {
	
	/**
	 * 获取客户端IP
	 */
	getClientIp: function (req) {
		return req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;
	}
}