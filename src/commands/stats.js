/**
 *
 *  @name DiscordTickets
 *  @author jULIAN EZEQUIEL <tomatittochorry@gmail.com>
 *  @Discord <Tomatitto Chorry#4444>
 */

const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'stats',
	description: 'View ticket stats.',
	usage: '',
	aliases: ['data', 'statistics'],
	
	args: false,
	async execute(client, message, _args, {config, Ticket}) {
		const guild = client.guilds.cache.get(config.guild);

		let open = await Ticket.count({ where: { open: true } });
		let closed = await Ticket.count({ where: { open: false } });

		message.channel.send(
			new MessageEmbed()
				.setColor(config.colour)
				.setTitle(':bar_chart: Estadisticas')
				.addField('Tickets Abiertos', open, true)
				.addField('Tickets Cerrados', closed, true)
				.addField('Total de tickets atendidos', open + closed, true)
				.setFooter(guild.name, guild.iconURL())
		);
	}
};