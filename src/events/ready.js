/**
 *
 *  @name DiscordTickets
 *  @author jULIAN EZEQUIEL <tomatittochorry@gmail.com>
 *  @Discord <Tomatitto Chorry#4444>
 */

const Logger = require('leekslazylogger');
const log = new Logger();
const config = require('../../user/' + require('../').config);

module.exports = {
	event: 'ready',
	execute(client) {
		log.success(`Authenticated as ${client.user.tag}`);

		const updatePresence = () => {
			const presence = config.presences[Math.floor(Math.random() * config.presences.length)];
			let activity = presence.activity + config.append_presence;
			activity = activity.replace(/%s/g, config.prefix);
			client.user.setPresence({
				activity: {
					name: activity,
					type: presence.type.toUpperCase()
				}
			}).catch(log.error);
			log.debug(`Updated presence: ${activity} ${presence.type}`);
		};

		updatePresence();
		setInterval(() => {
			updatePresence();
		}, 60000);


		if (client.guilds.cache.get(config.guild).member(client.user).hasPermission('ADMINISTRATOR', false)) {
			log.success('\'ADMINISTRATOR\' permission has been granted');
		} else log.warn('Bot does not have \'ADMINISTRATOR\' permission');
	}
};
