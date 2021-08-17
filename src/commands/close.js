/**
 *
 *  @name DiscordTickets
 *  @author jULIAN EZEQUIEL <tomatittochorry@gmail.com>
 *  @Discord <Tomatitto Chorry#4444>
 */

const Logger = require('leekslazylogger');
const log = new Logger();
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const { join } = require('path');
const archive = require('../modules/archive');

module.exports = {
	name: 'close',
	description: 'Close a ticket; either a specified (mentioned) channel, or the channel the command is used in.',
	usage: '[ticket]',
	aliases: ['none'],
	example: 'close #ticket-17',
	args: false,
	async execute(client, message, args, { config, Ticket }) {
		const guild = client.guilds.cache.get(config.guild);

		const notTicket = new MessageEmbed()
			.setColor(config.err_colour)
			.setAuthor(message.author.username, message.author.displayAvatarURL())
			.setTitle('❌ **Este no es un canal de entradas**')
			.setDescription('Use este comando en el canal de tickets que desea cerrar o mencione el canal.')
			.addField('Modo de Uso', `\`${config.prefix}${this.name} ${this.usage}\`\n`)
			.setFooter("Dev: Tomatitto Chorry#4444");

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
			if (!ticket) return message.channel.send(notTicket);
		} else {
			ticket = await Ticket.findOne({
				where: {
					channel: channel.id
				}
			});
			if (!ticket) {
				notTicket
					.setTitle('❌ **Este canal no es un ticket**')
					.setDescription(`${channel} no es un canal de tickets.`);
				return message.channel.send(notTicket);
			}

		}

		let paths = {
			text: join(__dirname, `../../user/transcripts/text/${ticket.get('channel')}.txt`),
			log: join(__dirname, `../../user/transcripts/raw/${ticket.get('channel')}.log`),
			json: join(__dirname, `../../user/transcripts/raw/entities/${ticket.get('channel')}.json`)
		};

		if (message.author.id !== ticket.creator && !message.member.roles.cache.has(config.staff_role))
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle('❌ **No tienes permisos**')
					.setDescription(`No tienes permiso para cerrar ${channel} porque no te pertenece y no eres parte del personal.`)
					.addField('Modo de Uso', `\`${config.prefix}${this.name} ${this.usage}\`\n`)
					.setFooter("Dev: Tomatitto Chorry#4444")
			);

		let success;
		let pre = fs.existsSync(paths.text) || fs.existsSync(paths.log)
			? `Podrá ver una versión archivada más tarde con \`${config.prefix}transcript ${ticket.id}\``
			: '';

		let confirm = await message.channel.send(
			new MessageEmbed()
				.setColor(config.colour)
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setTitle('❔ Estas seguro?')
				.setDescription(`${pre}\n**Reacciona con ✅ para confirmar.**`)
				.setFooter("Dev: Tomatitto Chorry#4444 | Caduca en 15 segundos")
		);

		await confirm.react('✅');

		const collector = confirm.createReactionCollector(
			(r, u) => r.emoji.name === '✅' && u.id === message.author.id, {
				time: 15000
			});

		collector.on('collect', async () => {
			let users = [];
			if (channel.id !== message.channel.id) {
				channel.send(
					new MessageEmbed()
						.setColor(config.colour)
						.setAuthor(message.author.username, message.author.displayAvatarURL())
						.setTitle('**Ticket cerrado**')
						.setDescription(`Ticket cerrado por ${message.author}`)
						.setFooter("Dev: Tomatitto Chorry#4444")
				);
			}

			confirm.reactions.removeAll();
			confirm.edit(
				new MessageEmbed()
					.setColor(config.colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(`✅ **Ticket ${ticket.id} cerrado**`)
					.setDescription('El canal se eliminará automáticamente en unos segundos, una vez que se hayan archivado los contenidos..')
					.setFooter("Dev: Tomatitto Chorry#4444")
			);

			if (config.transcripts.text.enabled || config.transcripts.web.enabled) {
				let u = await client.users.fetch(ticket.creator);

				if (u) {
					let dm;
					try {
						dm = u.dmChannel || await u.createDM();
					} catch (e) {
						log.warn(`No se pudo crear un canal de DM con ${u.tag}`);
					}


					let res = {};
					const embed = new MessageEmbed()
						.setColor(config.colour)
						.setAuthor(message.author.username, message.author.displayAvatarURL())
						.setTitle(`Ticket ${ticket.id}`)
						.setFooter("Dev: Tomatitto Chorry#4444")

					if (fs.existsSync(paths.text)) {
						embed.addField('Transcripción de texto', 'Ver archivo adjunto');
						res.files = [{
							attachment: paths.text,
							name: `ticket-${ticket.id}-${ticket.get('channel')}.txt`
						}];
					}

					if (fs.existsSync(paths.log) && fs.existsSync(paths.json)) {
						let data = JSON.parse(fs.readFileSync(paths.json));
						for (u in data.entities.users) users.push(u);
						embed.addField('Web archive', await archive.export(Ticket, channel)); // this will also delete these files
					}

					if (embed.fields.length < 1) {
						embed.setDescription(`No existen transcripciones de texto ni datos de archivo para el ticket ${ticket.id}`);
					}

					res.embed = embed;

					
					try {
						dm.send(res).then();
					} catch (e) {
						message.channel.send('❌ No se pudo enviar DM');
					}
				}
			}

			// update database
			success = true;
			ticket.update({
				open: false
			}, {
				where: {
					channel: channel.id
				}
			});

			// delete messages and channel
			setTimeout(() => {
				channel.delete();
				if (channel.id !== message.channel.id)
					message.delete()
						.then(() => confirm.delete());
			}, 5000);

			log.info(`${message.author.tag} cerró un ticket (#ticket-${ticket.id})`);

			if (config.logs.discord.enabled) {
				let embed = new MessageEmbed()
					.setColor(config.colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(`Ticket ${ticket.id} cerrado`)
					.addField('Creador', `<@${ticket.creator}>`, true)
					.addField('Cerrado por', message.author, true)
					.setFooter("Dev: Tomatitto Chorry#4444")
					.setTimestamp();
				
				if (users.length > 1)
					embed.addField('Members', users.map(u => `<@${u}>`).join('\n'));
				
				client.channels.cache.get(config.logs.discord.channel).send(embed);
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