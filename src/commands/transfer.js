/**
 *
 *  @name DiscordTickets
 *  @author jULIAN EZEQUIEL <tomatittochorry@gmail.com>
 *  @Discord <Tomatitto Chorry#4444>
 */

const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'transfer',
	description: 'Transfer ownership of a ticket channel',
	usage: '<@member>',
	aliases: ['none'],
	example: 'transfer @user',
	args: true,
	async execute(client, message, args, { config, Ticket }) {
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
					.setDescription('Utilice este comando en el canal de entradas que desea cambiar de propietario.')
					.addField('Modo de uso', `\`${config.prefix}${this.name} ${this.usage}\`\n`)
					.setFooter("Dev: Tomatitto Chorry#4444")
			);
		}

		if (!message.member.roles.cache.has(config.staff_role))
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle('❌ **No tienes permisos**')
					.setDescription('No tienes permiso para cambiar la propiedad de este canal porque no eres parte del personal.')
					.addField('Modo de uso', `\`${config.prefix}${this.name} ${this.usage}\`\n`)
					.setFooter(guild.name, guild.iconURL())
			);

		let member = guild.member(message.mentions.users.first() || guild.members.cache.get(args[0]));

		if (!member) {
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle('❌ **Usuario no encontrado**')
					.setDescription('Porfavor mencione bien al usuario.')
					.addField('Modo de uso', `\`${config.prefix}${this.name} ${this.usage}\`\n`)
					.setFooter(guild.name, guild.iconURL())
			);
		}


		message.channel.setTopic(`${member} | ${ticket.topic}`);

		Ticket.update({
			creator: member.user.id
		}, {
			where: {
				channel: message.channel.id
			}
		});

		message.channel.send(
			new MessageEmbed()
				.setColor(config.colour)
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setTitle('✅ **Ticket transferido**')
				.setDescription(`La propiedad de este ticket se ha transferido a ${member}.`)
				.setFooter(client.user.username, client.user.displayAvatarURL())
		);
	}
};
