/**
 *
 *  @name DiscordTickets
 *  @author jULIAN EZEQUIEL <tomatittochorry@gmail.com>
 *  @Discord <Tomatitto Chorry#4444>
 */

const Logger = require('leekslazylogger');
const log = new Logger();

module.exports = {
	event: 'rateLimit',
	execute(_client, [limit]) {
		log.warn('Rate-limited! (Enable debug mode in config for details)');
		log.debug(limit);
	}
};