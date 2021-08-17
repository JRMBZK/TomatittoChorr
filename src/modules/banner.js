/**
 *
 *  @name DiscordTickets
 *  @author jULIAN EZEQUIEL <tomatittochorry@gmail.com>
 *  @Discord <Tomatitto Chorry#4444>
 */

const { version, homepage } = require('../../package.json');
const link = require('terminal-link');

module.exports = (leeks) => {
	console.log(leeks.colours.cyan(`
######## ####  ######  ##    ## ######## ########  ######
   ##     ##  ##    ## ##   ##  ##          ##    ##    ##
   ##     ##  ##       ##  ##   ##          ##    ##
   ##     ##  ##       #####    ######      ##     ######
   ##     ##  ##       ##  ##   ##          ##          ##
   ##     ##  ##    ## ##   ##  ##          ##    ##    ##
   ##    ####  ######  ##    ## ########    ##     ######
              Tomatitto Chorry#4444
`));
	console.log(leeks.colours.cyanBright(`DiscordTickets bot v${version} by TomatittoChorry`));
	console.log(leeks.colours.cyanBright(homepage + '\n'));
	console.log(leeks.colours.cyanBright(`Please ${link('donaciones', 'https://www.paypal.com/paypalme/tomatittochorry')} Muchas gracias!`));
	console.log('\n\n');
};