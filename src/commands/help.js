/**
 *
 *  @name DiscordTickets
 *  @author jULIAN EZEQUIEL <tomatittochorry@gmail.com>
 *  @Discord <Tomatitto Chorry#4444>
 */

const Logger = require('leekslazylogger');
const log = new Logger();
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Display help menu',
	usage: 'ayudacomandos',
	aliases: ['asdasdasdasdasd'],
	example: 'help new',
	args: false,
	execute(client, message, args, {config}) {
		const guild = client.guilds.cache.get(config.guild);

		const commands = Array.from(client.commands.values());

		if (!args.length) {
			let cmds = [];

			for (let command of commands) {
				if (command.hide) continue;
				if (command.permission && !message.member.hasPermission(command.permission)) continue;

				let desc = command.description;

				if (desc.length > 50) desc = desc.substring(0, 50) + '...';
				cmds.push(`**${config.prefix}${command.name}** **·** ${desc}`);
			}

			message.channel.send(
				new MessageEmbed()
					.setTitle('Comandos')
					.setColor(config.colour)
					.setDescription(
						`\nLos comandos a los que tiene acceso se enumeran a continuación. Tipo \`${config.prefix}help [command]\` para obtener más información sobre un comando específico.
						\n${cmds.join('\n\n')}
						\nPóngase en contacto con un miembro del personal si necesita ayuda..`
					)
					.setFooter("Dev: Tomatitto Chorry#4444")
			).catch((error) => {
				log.warn('No se pudo enviar el menú de ayuda');
				log.error(error);
			});

		} else {
			const name = args[0].toLowerCase();
			const command = client.commands.get(name) || client.commands.find(c => c.aliases && c.aliases.includes(name));

			if (!command)
				return message.channel.send(
					new MessageEmbed()
						.setColor(config.err_colour)
						.setDescription(`❌ **Comando invialido** (\`${config.prefix}help\`)`)
				);


			const cmd = new MessageEmbed()
				.setColor(config.colour)
				.setTitle(command.name);


			if (command.long) cmd.setDescription(command.long);
			else cmd.setDescription(command.description);

			if (command.aliases) cmd.addField('Aliases', `\`${command.aliases.join(', ')}\``, true);

			if (command.usage) cmd.addField('Usage', `\`${config.prefix}${command.name} ${command.usage}\``, false);

			if (command.usage) cmd.addField('Example', `\`${config.prefix}${command.example}\``, false);


			if (command.permission && !message.member.hasPermission(command.permission)) {
				cmd.addField('Required Permission', `\`${command.permission}\` :exclamation: You don't have permission to use this command`, true);
			} else cmd.addField('Required Permission', `\`${command.permission || 'none'}\``, true);

			message.channel.send(cmd);
		}

		// command ends here
	},
};