/*
npm i --save uuid
npm i --save download-file
npm i --save discord.js
npm i simple-youtube-api --save
npm install ytdl-core --save
npm i node-opus --save
sudo apt-get install ffmpeg
*/
//const toApng = require('gif-to-apng'); npm i --save gif-to-apng
const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const download = require('download-file');
const YouTube = require('simple-youtube-api');
const { Client, Util } = require('discord.js');
const { TOKEN, PREFIX, YOUTUBE_API_KEY } = require('./config.json');

const client = new Client({ disableEveryone: true });
const bot = new Discord.Client();
const msg_id = '660517778272419841';
const guild_id = '660335920826023936';
const youtube = new YouTube(YOUTUBE_API_KEY);
const queue = new Map();


bot.on('ready', () => {
    console.log(`Estou online, com ${bot.users.size} usuarios, em ${bot.channels.size} canais, em ${bot.guilds.size} servidores.`)
    bot.user.setActivity(`Estou em ${bot.guilds.size} servidores.`);
});

bot.on('warn', console.warn);

bot.on('error', console.error);

bot.on('disconnect', () => {
    console.log('Desconectado, logo mais parça..')
    bot.user.setActivity('Disconectado');
});

bot.on('reconnecting', () => {
    console.log('Reconectando.')
    bot.user.setActivity('Reconectando');
});

bot.on('guildCreate', guild => {
    console.log(`Martha entrous nos servidores: ${guild.name} (id: ${guild.id}). População ${guild.memberCount} membros`);
    bot.user.setActivity(`Estou em ${bot.guilds.size} servidores.`)
});

bot.on('guildDelet', guild => {
    console.log(`Martha foi removida do servidore: ${guild.name} (id: ${guild.id})`);
    bot.user.setActivity(`Estou em ${bot.guilds.size} servidores.`)
});

bot.on('raw', async dados =>{
    if(dados.t !== 'MESSAGE_REACTION_ADD' && dados.t !== 'MESSAGE_REACTION_REMOVE') return;
    if(dados.d.message_id != msg_id) return;

    let servidor = bot.guilds.get(guild_id)
    let membro = servidor.members.get(dados.d.user_id)

    let c1 = servidor.roles.get('660519097213255710'),
        c2 = servidor.roles.get('660519144680063016'),
        c3 = servidor.roles.get('660519189273903104')

    if(dados.t === "MESSAGE_REACTION_ADD"){
        if(dados.d.emoji.id == '660392270289174540'){
            if(membro.roles.has(c1)) return;
            membro.addRole(c1)
            console.log('Cargo adicionado')
        } else if(dados.d.emoji.name == '👌'){
            if(membro.roles.has(c2)) return;
            console.log('Cargo adicionado')
            membro.addRole(c2)
        } else if(dados.d.emoji.name == 'poop'){
            if(membro.roles.has(c3)) return;
            membro.addRole(c3)
            console.log('Cargo adicionado')
        }
    }
    if(dados.t == "MESSAGE_REACTION_REMOVE"){
        if(dados.d.emoji.id == '660392270289174540'){
            if(membro.roles.has(c1)) return;
            membro.removeRole(c1)
            console.log('Cargo removido')
        } else if(dados.d.emoji.name == '👌'){
            if(membro.roles.has(c2)) return;
            console.log('Cargo removido')
            membro.removeRole(c2)
        } else if(dados.d.emoji.name == 'poop'){
            if(membro.roles.has(c3)) return;
            membro.removeRole(c3)
            console.log('Cargo removido')
        }
    }
         
})

bot.on('message', async message => {
    
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();
    
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    const searchString = args.slice(1).join(' ');
    const serverQueue = queue.get(message.guild.id);

    // Comandos
    if(comando === "ping") { //Comando
        const m =  message.channel.send("Ping?"); //Resultado
        console.log('Ping?')
      //  m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. A Latencia da API é ${Math.round(client.ping)}ms`);
    }

    if(comando === "emoji") {
        let info = {filename: "emoji.png"}  
        let [nome, emojilink] = args
        if(!args[0]) return message.reply("Você esqueceu de definir os argumentos\n !emoji <nome> <link.png>");
        if(!args[1]) return message.channel.send("Você esqueceu de definir o link do emoji\n !emoji <nome> <link.png>");
    
        download(emojilink, info, function(err){
            if (!err)  {
            console.log("Emoji identificado")
             message.guild.createEmoji('emoji.png', nome)
             message.channel.send("Emoji adicionado com sucesso!!")
            }else {
              message.channel.send("Link invalido")
            }
          })
    }

    /*
    if(comando === "apng") {
        let info = {filename: "emoji.gif"}  
        let [nome, emojilink] = args
        if(!args[0]) return message.reply("Você esqueceu de definir os argumentos\n !apng <nome> <link.gif>");
        if(!args[1]) return message.channel.send("Você esqueceu de definir o link do emoji\n !apng <nome> <link.gif>");
    
        download(emojilink, info, function(err){
            if (!err)  {
            console.log("gif identificado")
            toApng('emoji.gif')
           .then(() => {
             message.guild.createEmoji('emoji.png', nome)
             message.channel.send("O gif-emoji foi convertido para o modo NITRO-Pobre é adicionado!!!")
            })
           .catch(error => console.log('não consegui converter a imagem💀', error))
            }else {
              message.channel.send("Link invalido")
            }
          })
    }
*/
if (comando === 'play') {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.channel.send('Me desculpe, mas você precisa estar em um canal de voz para tocar música!');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT')) {
        return message.channel.send('Não consigo me conectar ao seu canal de voz, verifique se tenho as permissões adequadas!');
    }
    if (!permissions.has('SPEAK')) {
        return message.channel.send('Eu não posso falar neste canal de voz, verifique se eu tenho as permissões adequadas!');
    }

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        const playlist = await youtube.getPlaylist(url);
        const videos = await playlist.getVideos();
        for (const video of Object.values(videos)) {
            const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
            await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
        }
        return message.channel.send(`Adc Playlist: **${playlist.title}** foi bem adicionada a lista!`);
    } else {
        try {
            var video = await youtube.getVideo(url);
        } catch (error) {
            try {
                var videos = await youtube.searchVideos(searchString, 10);
                let index = 0;
                message.channel.send(`
__**Seleção**__

${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}

Escolha uma das músicas de 1-10
                `);
                // eslint-disable-next-line max-depth
                try {
                    bot.user.setActivity('Tocando Música')
                    var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                        maxMatches: 1,
                        time: 25000,
                        errors: ['time']
                    });
                } catch (err) {
                    console.error(err);
                    return message.channel.send('Nenhum valor inserido ou está inválido , cancelando a operação de seleção de vídeo.');
                }
                const videoIndex = parseInt(response.first().content);
                var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
            } catch (err) {
                console.error(err);
                return message.channel.send('🆘 Não consegui obter nenhum resultado de pesquisa.');
            }
        }
        return handleVideo(video, message, voiceChannel);
    }
} else if (comando === 'skip') {
    if (!message.member.voiceChannel) return message.channel.send('Você não está em um canal de voz');
    if (!serverQueue) return message.channel.send('Não a nada tocando posso pular pra você');
    serverQueue.connection.dispatcher.end('Skipado com Sucesso');
    return undefined;
} else if (comando === 'stop') {
    if (!message.member.voiceChannel) return message.channel.send('Você não está em um canal de voz!');
    if (!serverQueue) return message.channel.send('Não tá tocando eu não posso parar pra você');
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end('O Comando de parar foi usado!');
    return undefined;
} else if (comando === 'volume') {
    if (!message.member.voiceChannel) return message.channel.send('Você não está em um canal de voz!');
    if (!serverQueue) return message.channel.send('Não está tocando.');
    if (!args[1]) return message.channel.send(`O Volume atual é: **${serverQueue.volume}**`);
    serverQueue.volume = args[1];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
    return message.channel.send(`Ajustar volume para: **${args[1]}**`);
} else if (comando === 'np') {
    if (!serverQueue) return message.channel.send('Não a nada tocando.');
    return message.channel.send(`Tocando: **${serverQueue.songs[0].title}**`);
} else if (comando === 'queue') {
    if (!serverQueue) return message.channel.send('Não a nada tocando.');
    return message.channel.send(`
__**Lista de Música:**__

${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}

**Tocando Agora:** ${serverQueue.songs[0].title}
    `);
} else if (comando === 'pause') {
    if (serverQueue && serverQueue.playing) {
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();
        return message.channel.send('⏸ Pausou');
    }
    return message.channel.send('Não a nada tocando.');
} else if (comando === 'resume') {
    if (serverQueue && !serverQueue.playing) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        return message.channel.send('▶ Rusumindo');
    }
    return message.channel.send('Não a nada tocando.');
}

return undefined;
});

async function handleVideo(video, message, voiceChannel, playlist = false) {
const serverQueue = queue.get(message.guild.id);
console.log(video);
const song = {
    id: video.id,
    title: Util.escapeMarkdown(video.title),
    url: `https://www.youtube.com/watch?v=${video.id}`
};
if (!serverQueue) {
    const queueConstruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
    };
    queue.set(message.guild.id, queueConstruct);

    queueConstruct.songs.push(song);

    try {
        var connection = await voiceChannel.join();
        queueConstruct.connection = connection;
        play(message.guild, queueConstruct.songs[0]);
    } catch (error) {
        console.error(`Eu não pude entrar no canal de voz: ${error}`);
        queue.delete(message.guild.id);
        return message.channel.send(`Eu não pude entrar no canal de voz: ${error}`);
    }
} else {
    serverQueue.songs.push(song);
    console.log(serverQueue.songs);
    if (playlist) return undefined;
    else return message.channel.send(`Agora **${song.title}** foi adicionado a lista!`);
}
return undefined;
}
function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);


	const stream = ytdl(song.url, {filter : 'audioonly'});
	const dispatcher = serverQueue.connection.playStream(stream, song.url);
	dispatcher.on('end', reason => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
    })
    .on('error', error => console.error(error));
dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`Tocando: **${song.title}**`);

};

bot.login(TOKEN);
/*
bot.on('message', message => {
    if(message.content === 'Oi'){
        message.reply('Olá')
    }
})*/
