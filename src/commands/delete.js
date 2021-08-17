/**
 *
 *  @name DiscordTickets
 *  @author jULIAN EZEQUIEL <tomatittochorry@gmail.com>
 *  @Discord <Tomatitto Chorry#4444>
 */

const Logger = require('leekslazylogger');
const log = new Logger();
const {
	MessageEmbed
} = require('discord.js');
const fs = require('fs');
const { join } = require('path');

module.exports = {
	name: 'delete',
	description: 'Delete a ticket. Similar to closing a ticket, but does not save transcript or archives.',
	usage: '[ticket]',
	aliases: ['del'],
	example: 'delete #ticket-17',
	args: false,
	async execute(client, message, args, {
		config,
		Ticket
	}) {
		const guild = client.guilds.cache.get(config.guild);

		const notTicket = new MessageEmbed()
			.setColor(config.err_colour)
			.setAuthor(message.author.username, message.author.displayAvatarURL())
			.setTitle('❌ **Este no es un canal de entradas**')
			.setDescription('Use este comando en el canal de entradas que desea eliminar o mencione el canal.')
			.addField('Modo de Uso', `\`${config.prefix}${this.name} ${this.usage}\`\n`)
			.setFooter("Dev: Tomatitto Chorry#4444")

		let ticket;
		let channel = message.mentions.channels.first();
		// || client.channels.resolve(await Ticket.findOne({ where: { id: args[0] } }).channel) // channels.fetch()

		if (!channel) {
			channel = message.channel;

			ticket = await Ticket.findOne({
				where: {
					channel: channel.id
				}
			});
			if (!ticket) return channel.send(notTicket);

		} else {
			ticket = await Ticket.findOne({
				where: {
					channel: channel.id
				}
			});
			if (!ticket) {
				notTicket
					.setTitle('❌ **El canal no es un ticket**')
					.setDescription(`${channel} no es un canal de entradas.`);
				return message.channel.send(notTicket);
			}

		}
		if (message.author.id !== ticket.creator && !message.member.roles.cache.has(config.staff_role)) 
			return channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle('❌ **No tienes permisos**')
					.setDescription(`No tienes permiso para eliminar ${channel} porque no te pertenece y no eres miembro del personal.`)
					.addField('Modo de Uso', `\`${config.prefix}${this.name} ${this.usage}\`\n`)
					.setFooter("Dev: Tomatitto Chorry#4444")
			);
		
		let success;

		let confirm = await message.channel.send(
			new MessageEmbed()
				.setColor(config.colour)
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setTitle('❔ Estas seguro?')
				.setDescription(
					`:warning: Esta acción es **irreversible**, el ticket se eliminará por completo de la base de datos.
					**No** podrás ver una transcripción / archivo del canal más tarde.
          Utilizar el \`close\` comando en su lugar si no quieres este comportamiento.\n**Reacciona con ✅ para confirmar.**`)
		  .setFooter("Dev: Tomatitto Chorry#4444 | Caduca en 15 segundos")
		);

		await confirm.react('✅');

		const collector = confirm.createReactionCollector(
			(r, u) => r.emoji.name === '✅' && u.id === message.author.id, {
				time: 15000
			});

		collector.on('collect', async () => {
			if (channel.id !== message.channel.id)
				channel.send(
					new MessageEmbed()
						.setColor(config.colour)
						.setAuthor(message.author.username, message.author.displayAvatarURL())
						.setTitle('**Ticket eliminado**')
						.setDescription(`Ticket eliminado por ${message.author}`)
						.setFooter("Dev: Tomatitto Chorry#4444")
				);

			confirm.reactions.removeAll();
			confirm.edit(
				new MessageEmbed()
					.setColor(config.colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(`✅ **Ticket ${ticket.id} deleted**`)
					.setDescription('El canal se eliminará automáticamente en unos segundos..')
					.setFooter("Dev: Tomatitto Chorry#4444")
			);

			let txt = join(__dirname, `../../user/transcripts/text/${ticket.get('channel')}.txt`),
				raw = join(__dirname, `../../user/transcripts/raw/${ticket.get('channel')}.log`),
				json = join(__dirname, `../../user/transcripts/raw/entities/${ticket.get('channel')}.json`);

			if (fs.existsSync(txt)) fs.unlinkSync(txt);
			if (fs.existsSync(raw)) fs.unlinkSync(raw);
			if (fs.existsSync(json)) fs.unlinkSync(json);

			// update database
			success = true;
			ticket.destroy(); // remove ticket from database

			// delete messages and channel
			setTimeout(() => {
				channel.delete();
				if (channel.id !== message.channel.id)
					message.delete()
						.then(() => confirm.delete());
			}, 5000);

			log.info(`${message.author.tag} deleted a ticket (#ticket-${ticket.id})`);

			if (config.logs.discord.enabled) {
				client.channels.cache.get(config.logs.discord.channel).send(
					new MessageEmbed()
						.setColor(config.colour)
						.setAuthor(message.author.username, message.author.displayAvatarURL())
						.setTitle('Ticket eliminado ')
						.addField('Creador', `<@${ticket.creator}>`, true)
						.addField('Borrado por', message.author, true)
						.setFooter("Dev: Tomatitto Chorry#4444")
						.setTimestamp()
				);
			}
		});


		collector.on('end', () => {
			if (!success) {
				confirm.reactions.removeAll();
				confirm.edit(
					new MessageEmbed()
						.setColor(config.err_colour)
						.setAuthor(message.author.username, message.author.displayAvatarURL())
						.setTitle('❌ **Caducado**')
						.setDescription('Tardaste demasiado en reaccionar; confirmación fallida.')
						.setFooter("Dev: Tomatitto Chorry#4444"));

				message.delete({
					timeout: 10000
				})
					.then(() => confirm.delete());
			}
		});

	}
};