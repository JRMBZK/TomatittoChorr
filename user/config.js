

module.exports = {
	prefix: '!',
	name: 'Tc Tickets',
	presences: [
		{
			activity: 'TC Tickets',
			type: 'WATCHING'
		},
		{
			activity: 'TomatittoChorry#0455',
			type: 'WATCHING'
		},
		{
			activity: 'TomatittoChorry#0455',
			type: 'WATCHING'
		}
	],
	append_presence: ' | !help',
	colour: '#810ea4',
	err_colour: 'RED',
	cooldown: 3,

	guild: '', // ID of your guild
	staff_role: '', // ID of your Support Team role

	tickets: {
		category: '', // ID of your tickets category
		send_img: false,
		ping: 'everyone' ,
		text: `Hello there, {{ tag }}!
		Un miembro del personal le ayudará en breve.
    Mientras tanto, describa su problema con el mayor detalle posible.! :)`,
		pin: true,
		max: 2
	},

	transcripts: {
		text: {
			enabled: true,
			keep_for: 90,
		},
		web: {
			enabled: false,
			server: 'https://tickettool.xyz/direct?url',
		}
	},

	panel: {
		title: '**Soporte por Tickets**',
		description: '*¿Necesitas ayuda?*\n *Reacciona a:* 🧾\n*para abrir un ticket!*',
		reaction: '🧾'
	},

	storage: {
		type: 'sqlite'
	},

	logs: {
		files: {
			enabled: true,
			keep_for: 7
		},
		discord: {
			enabled: true,
			channel: '' // ID of your log channel
		}
	},

	debug: false,
	updater: true
};
