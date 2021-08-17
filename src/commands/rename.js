/**
 *
 *  @name DiscordTickets
 *  @author jULIAN EZEQUIEL <tomatittochorry@gmail.com>
 *  @Discord <Tomatitto Chorry#4444>
 */

const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'rename',
	description: 'Rename a ticket channel',
	usage: '<new name>',
	aliases: ['none'],
	example: 'rename important-ticket',
	args: true,
	async execute(client, message, args, {config, Ticket}) {
		const guild = client.guilds.cache.get(config.guild);

		let ticket = await Ticket.findOne({
			where: {
				channel: message.channel.id
			}
		});

		if (!ticket) {
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle('❌ **Este no es un canal de entradas**')
					.setDescription('Utilice este comando en el canal de entradas al que desea cambiar el nombre.')
					.addField('Tipo de uso', `\`${config.prefix}${this.name} ${this.usage}\`\n`)
					.setFooter(guild.name, guild.iconURL())
			);
		}

		if (!message.member.roles.cache.has(config.staff_role))
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle('❌ **No tienes permisos**')
					.setDescription('No tienes permiso para cambiar el nombre de este canal porque no eres miembro del personal.')
					.addField('Tipo de uso', `\`${config.prefix}${this.name} ${this.usage}\`\n`)
					.setFooter(guild.name, guild.iconURL())
			);

		message.channel.setName(args.join('-')); // new channel name

		message.channel.send(
			new MessageEmbed()
				.setColor(config.colour)
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setTitle('✅ **Ticket Actualizado**')
				.setDescription('El nombre del ticket fue cambiado.')
				.setFooter(client.user.username, client.user.displayAvatarURL())
		);
	}
};
