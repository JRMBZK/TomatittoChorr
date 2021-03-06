/**
 *
 *  @name DiscordTickets
 *  @author jULIAN EZEQUIEL <tomatittochorry@gmail.com>
 *  @Discord <Tomatitto Chorry#4444>
 */

const Logger = require('leekslazylogger');
const log = new Logger();
const fs = require('fs');
const { join } = require('path');

module.exports = {
	event: 'messageUpdate',
	async execute(_client, [o, n], {config, Ticket}) {
		if (!config.transcripts.web.enabled) return;

		if (o.partial) {
			try {
				await o.fetch();
			} catch (err) {
				log.error(err);
				return;
			}
		}

		if (n.partial) {
			try {
				await n.fetch();
			} catch (err) {
				log.error(err);
				return;
			}
		}

		let ticket = await Ticket.findOne({ where: { channel: n.channel.id } });
		if (!ticket) return;

		let path = `../../user/transcripts/raw/${n.channel.id}.log`;
		let embeds = [];
		for (let embed in n.embeds) embeds.push({ ...n.embeds[embed] });

		fs.appendFileSync(join(__dirname, path), JSON.stringify({
			id: n.id,
			author: n.author.id,
			content: n.content, // do not use cleanContent!
			time: n.createdTimestamp,
			embeds: embeds,
			attachments: [...n.attachments.values()],
			edited: true
		}) + '\n');

	}
};