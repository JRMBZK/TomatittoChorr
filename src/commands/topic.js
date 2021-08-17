/**
 *
 *  @name DiscordTickets
 *  @author jULIAN EZEQUIEL <tomatittochorry@gmail.com>
 *  @Discord <Tomatitto Chorry#4444>
 */

const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'topic',
	description: 'Edit a ticket topic',
	usage: '<topic>',
	aliases: ['edit'],
	example: 'topic need help error',
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
					.setDescription('Use este comando en el canal de tickets que desea cerrar o mencione el canal.')
					.addField('Modo de uso', `\`${config.prefix}${this.name} ${this.usage}\`\n`)
					.setFooter("Dev: Tomatitto Chorry#4444")
			);
		}

		let topic = args.join(' ');
		if (topic.length > 256) {
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle('❌ **Descripción demasiado larga**')
					.setDescription('Limite el tema de su ticket a menos de 256 caracteres. Una frase corta bastará.')
					.setFooter("Dev: Tomatitto Chorry#4444")
			);
		}

		message.channel.setTopic(`<@${ticket.creator}> | ` + topic);

		Ticket.update({
			topic: topic
		}, {
			where: {
				channel: message.channel.id
			}
		});

		message.channel.send(
			new MessageEmbed()
				.setColor(config.colour)
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setTitle('✅ **Ticket actualizado**')
				.setDescription('El tema ha sido cambiado.')
				.setFooter(client.user.username, client.user.displayAvatarURL())
		);
	}
};