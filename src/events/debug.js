/**
 *
 *  @name DiscordTickets
 *  @author jULIAN EZEQUIEL <tomatittochorry@gmail.com>
 *  @Discord <Tomatitto Chorry#4444>
 */

const Logger = require('leekslazylogger');
const log = new Logger();

module.exports = {
	event: 'debug',
	execute(_client, [e]) {
		log.debug(e);
	}
};