const ping = require('ping');
const axios = require('axios');
const config = require('./config.json')

const pInterval = config.interval; //?ping internal
const maxfailcount = config.maxfail; //?retry count thresold
const maxrestime = config.maxping; //?max ping
const webhookurl = config.webhookurl
const host = config.host

const user1 = config.mentionuserid
const user2 = config.mentionuserid2

let failcount = 0;
let lastping = 0;

async function Pinger() {
	try {
		const res = await ping.promise.probe(host);
		console.log(`[Your Device] <===> [${host}] : ${res.time}ms`)
		lastping = `${res.time}ms`
		if (!notifycount === 0) {
			notifycount--;
		}
		if (!res.alive || res.time > maxrestime) {
			failcount++;
			if (failcount >= maxfailcount) {
				await notify();
			}
			lastping = 'TIMED OUT'
		} else {
			failcount = 0;
		}
	} catch (e) {
		console.error('Error during ping:', e);
		failcount++;
		if (failcount >= maxfailcount) {
			await notify();
		}
	} finally {
		setTimeout(Pinger, pInterval);
	}
}

let notifycount = 0;

async function notify() {
	console.error(`Failed to ping! last ping: ${lastping}, Sending notification...`)
	if (notifycount > 2 ) {
		return console.log(`Already sent, Ignored`)
	}
	const d = new Date();
	const u = d.getTime()
	const fxunix = Math.floor( u / 1000 );
	let discordupdata = {
		username: "Ping Watcher",
		embeds: [{
			title: "Failed to ping!",
			color: 0xff0100,
			fields: [
				{
					name: "Last ping",
					value: lastping
				},
				{
					name: "Date",
					value: `<t:${fxunix}:f>(<t:${fxunix}:R>)`
				}
			]
		}]
	}
	discordupdata.content = `${user1} ${user2}`
	try {
		await axios.post(webhookurl, discordupdata)
		notifycount++;
	} catch (e) {
		console.log(e)
	}
}

Pinger()