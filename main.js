const ping = require('ping');
const axios = require('axios');
const config = require('./config.json')

const pInterval = 1000; //?ping internal
const maxfailcount = 3; //?retry count thresold
const maxrestime = 300; //?max ping
const webhookurl = config.webhookurl
const host = '1.1.1.1'

const user1 = config.mentionuserid
const user2 = config.mentionuserid2

let failcount = 0;
let lastping = 0;

async function Pinger() {
	try {
		const res = await ping.promise.probe(host);
		console.log(`${res.time}ms`)
		lastping = `${res.time}ms`
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
	if (notifycount < 2 ) {
		return console.log(`Already sent, Ignored`)
	}
	const d = new Date();
	const u = d.getTime()
	const fxunix = Math.floor( u / 1000 );
	try {
		await axios.post(webhookurl), {
			username: "Ping watcher",
			content: `${user1} ${user2}\nねえ回線死んでるんだけど？どうなってんの？\n最終ping: ${lastping}\n発生時刻: <t:${fxunix}:f>(<t:${fxunix}:R>)` 
		}
		notifycount++;
	} catch (e) {
		console.log(e)
	}
}

Pinger()