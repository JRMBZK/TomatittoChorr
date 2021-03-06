/**
 *
 *  @name DiscordTickets
 *  @author jULIAN EZEQUIEL <tomatittochorry@gmail.com>
 *  @Discord <Tomatitto Chorry#4444>
 */

const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const { join } = require('path');

module.exports = {
	name: 'tickets',
	description: 'List your recent tickets to access transcripts / archives.',
	usage: '[@member]',
	aliases: ['list'],
	args: false,
	async execute(client, message, args, {config, Ticket}) {
		const guild = client.guilds.cache.get(config.guild);

		const supportRole = guild.roles.cache.get(config.staff_role);
		if (!supportRole) {
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setTitle('❌ **Error**')
					.setDescription(`${config.name} no se ha configurado correctamente. No se pudo encontrar un rol de 'equipo de soporte' con la identificación \`${config.staff_role}\``)
					.setFooter("Dev: Tomatitto Chorry#4444")
			);
		}

		let context = 'self';
		let user = message.mentions.users.first() || guild.members.cache.get(args[0]);

		if (user) {
			if (!message.member.roles.cache.has(config.staff_role)) {
				return message.channel.send(
					new MessageEmbed()
						.setColor(config.err_colour)
						.setAuthor(message.author.username, message.author.displayAvatarURL())
						.setTitle('❌ No tienes permisos para este comando')
						.setDescription('No tienes permiso para publicar entradas de otros ya que no eres staff de DragonBoostNetwork.')
						.addField('Modo de Uso', `\`${config.prefix}${this.name} ${this.usage}\`\n`)
						.setFooter("Dev: Tomatitto Chorry#4444")
				);
			}

			context = 'staff';
		} else user = message.author;

		let openTickets = await Ticket.findAndCountAll({
			where: {
				creator: user.id,
				open: true
			}
		});

		let closedTickets = await Ticket.findAndCountAll({
			where: {
				creator: user.id,
				open: false
			}
		});

		closedTickets.rows = closedTickets.rows.slice(-10); // get most recent 10

		let embed = new MessageEmbed()
			.setColor(config.colour)
			.setAuthor(user.username, user.displayAvatarURL())
			.setTitle(`${context === 'self' ? 'Tu' : user.username + '\'s'} tickets`)
			.setFooter(guild.name + ' | Este mensaje se eliminará en 60 segundos.', guild.iconURL());

		/* if (config.transcripts.web.enabled) {
			embed.setDescription(`You can access all of your ticket archives on the [web portal](${config.transcripts.web.server}/${user.id}).`);
		} */

		let open = [],
			closed = [];

		for (let t in openTickets.rows)  {
			let desc = openTickets.rows[t].topic.substring(0, 30);
			open.push(`> <#${openTickets.rows[t].channel}>: \`${desc}${desc.length > 20 ? '...' : ''}\``);
		}

		for (let t in closedTickets.rows)  {
			let desc = closedTickets.rows[t].topic.substring(0, 30);
			let transcript = '';
			let c = closedTickets.rows[t].channel;
			if (config.transcripts.web.enabled || fs.existsSync(join(__dirname, `../../user/transcripts/text/${c}.txt`))) {
				transcript = `\n> Type \`${config.prefix}transcript ${closedTickets.rows[t].id}\` to view.`;
			}

			closed.push(`> **#${closedTickets.rows[t].id}**: \`${desc}${desc.length > 20 ? '...' : ''}\`${transcript}`);

		}

		let pre = context === 'self' ? 'Tienes' : user.username + ' tiene';
		embed.addField('Tickets Abiertos', openTickets.count === 0 ? `${pre} no tienes ningun ticket abierto.` : open.join('\n\n'), false);
		embed.addField('Tickets Cerrados', closedTickets.count === 0 ? `${pre} nunca has abierto un ticket` : closed.join('\n\n'), false);

		message.delete({timeout: 15000});

		let channel;
		try {
			channel = message.author.dmChannel || await message.author.createDM();
			message.channel.send('Mira tu md, se te acaba de enviar tu informacion.').then(msg => msg.delete({timeout: 15000}));
		} catch (e) {
			channel = message.channel;
		}

		let m = await channel.send(embed);
		m.delete({timeout: 60000});
	},
};