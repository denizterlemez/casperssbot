const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const { prefix, author } = require("./config.json");
const AsciiTable = require('ascii-table');
const fs = require("fs");
require('./util/eventHandler.js')(client);
const moment = require("moment");
const db = require("quick.db");
const got = require("got");
const { MessageEmbed } = require('discord.js');



client.on('message', message =>{


  if (message.content === prefix+"meme") {
    const embed = new Discord.MessageEmbed()
    got('https://www.reddit.com/r/memes/random/.json').then(response => {
        let content = JSON.parse(response.body);
        let permalink = content[0].data.children[0].data.permalink;
        let memelink = `https://reddit.com${permalink}`;
        let memeresim = content[0].data.children[0].data.url;
        let memeBaşlık = content[0].data.children[0].data.title;
        
        embed.setTitle(`${memeBaşlık}`)
        embed.setURL(`${memelink}`)
        embed.setImage(memeresim)
        embed.setColor('RANDOM')
     
        message.channel.send(embed);
    })
  }
  




})




/////TABLES
var commandtable = new AsciiTable(' Command Table');
////


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();


commandtable.setHeading("Command", 'Status', "Aliases")
fs.readdirSync('./commands').forEach(dir => {
const commandFiles = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const komutcuklar = require(`./commands/${dir}/${file}`);
  if (komutcuklar.help.name) {
  client.commands.set(komutcuklar.help.name, komutcuklar);
  commandtable.addRow(komutcuklar.help.name, "✔️", komutcuklar.conf.aliases)
} else {
  commandtable.addRow(komutcuklar.help.name, "❌")
  continue;
    }
    komutcuklar.conf.aliases.forEach(alias => {
      client.aliases.set(alias, komutcuklar.help.name);
    });
  }
})
console.log(commandtable.toString())


client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === author) permlvl = 4;
  return permlvl;
};

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'sa') {
    msg.reply('Aleyküm Selam!');
  }
});


const cevaplar = [
	" **__TURA__ GELDİ**",
	" **__YAZI__** GELDİ"
];
var cevap = cevaplar[Math.floor(Math.random() )];
client.on('message', message => {
  // If the message is "ping"
  if (message.content === prefix+'yazı-tura') {
    // Send "pong" to the same channel
    message.channel.send(cevap);
  }
});


let random = Math.floor(Math.random(100) * 100 );
client.on('message', message => {
 
  if (message.content === prefix+'nekadargayım') {

    
message.channel.send(new MessageEmbed().setColor('RANDOM').setTitle('gay rx5 makinesi').setDescription(`Bu Kadar ${random}% gaysin 🏳️‍🌈`));
  }
});




let timeout = 86400000
let amount = 150
client.on('message', async message=>{

   if(message.content.startsWith(prefix+"param")){
      let user = message.mentions.users.first() || message.author
      let money = db.fetch(`money_${user.id}`)


      if(money === null) money = 0
      message.channel.send(`${user} senin ${money} **C** coinin var.`)

   }
    if(message.content === prefix+"günlük"){
        let daily = await db.fetch(`günlük_${message.author.id}`)


      if(daily != null && timeout - (Date.now() - daily) > 0  ){

        let time = (timeout - (Date.now() - daily));
        message.channel.send(`Sen zaten günlük ödülünü almışşın. sonra tekrar alabilirsin.`)
      }else{
         let embed = new Discord.MessageEmbed()
         .setAuthor(`günlük_`, message.author.displayAvatarURL)
         .setColor("RANDOM")
         .setDescription(`**Günlük Ödül**`)
         .addField(`Alındı`, amount)

         db.add(`money_${message.author.id}`, amount)
         db.add(`günlük_${message.author.id}`, Date.now())
        message.channel.send(embed)

      }

    }

    if(message.content === prefix+"çalış") {
      let timeoutworked = 3600000
      let worked =  await db.fetch(`worked_${message.author.id}`)
    
      if(worked != null && timeoutworked - (Date.now() - worked) > 0  ){
    
        let time = (timeoutworked - (Date.now() - worked));
        message.channel.send(`Saatte bir çalışabilirsin.`)
    }else{
      let amountearned = Math.floor(Math.random() * 500) + 1
      let jobs = ["Developer","Bilim İnsanı","Doktor","Satıcı"]
      let job = jobs[Math.floor(Math.random() * jobs.length)]
      let embed = new Discord.MessageEmbed()
    
      .setAuthor(`${message.author.tag}`,message.author.displayAvatarURL())
      .setDescription(`${message.author.tag}sen ${job} işinde çalıştın ve bu kadar kazandın ${amountearned}`)
      message.channel.send(embed)
      db.add(`money_${message.author.id}`, amountearned)
      db.set(`worked_${message.author.id}`, Date.now())
    
    
    
    
    
    }
    
    }

})
client.on('message', message => {
  
  if (message.content === prefix+'yardım') {
    const embed3 = new Discord.MessageEmbed()
      // Set the title of the field
      
      .setTitle('Yardım Komutları')
      .addField(
        `<a:6952legittick:834146097949442078>  Kullanıcı-komutları`, 
        `m!pp  m!ping  m!sunucubilgi m!kullanıcı m!şifre (uzunluk) m!yapımcım m!havadurumu yer`
        
        )


      .addField(
        `<a:6952legittick:834146097949442078>  Moderasyon-komutları`,
        `m!ban m!slowmode m!unban m!sayaç-ayarla **sayı/kapat**  m!sayaç-kanal-ayarla #kanal m!isimdeğiştir  m!temizle **sayı** m!otorol ayarla @rol #kanal`
        
        )
      .addField(
        `<a:6952legittick:834146097949442078> Ekonomi-komutları`,
        `m!param m!çalış m!günlük m!günlük m!slots`,
      
      

        
      )
      .addField(
        `<a:6952legittick:834146097949442078> Eğlence-komutları`,
        `m!meme m!yazı-tura m!play (url) m!kralol m!newyear m!nekadargayım`,
      

        
      )
      .setColor("RANDOM")
      .setDescription(`Bot sürümü : 1.3(Beta) Prefix: **${prefix}**`)

    message.channel.send(embed3);
  }
});
 





client.on('message', async message => {
  if(message.content.startsWith(prefix+'play')) {
    const args = message.content.split(' ').slice(1)
    const botmesajı = args.join(" ")
    if (!botmesajı) return message.reply('Link eklemediniz.')
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      const ytdl = require('ytdl-core')
      connection.play(ytdl(`${botmesajı}`, { filter: 'audioonly' }))
    }else {
      message.reply("Lütfen sesli odaya geç") 
    }
  }
})


client.on('message', message => {
  // Ignore messages that aren't from a guild
  if (!message.guild) return;

  // If the message content starts with "!kick"
  if (message.content.startsWith(prefix+'kick')) {
    if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Bunu Yapmaya Yetkin Yok!!!") 
    
    const user = message.mentions.users.first();
    // If we have a user mentioned
    if (user) {
      // Now we get the member from the user
      const member = message.guild.member(user);
      // If the member is in the guild
      if (member) {
        /**
         * Kick the member
         * Make sure you run this on a member, not a user!
         * There are big differences between a user and a member
         */
        member
          .kick('Optional reason that will display in the audit logs')
          .then(() => {
            // We let the message author know we were able to kick the person
            message.reply(`Başarıyla tekmelendi ${user.tag}`);
          })
          .catch(err => {
            // An error happened
            // This is generally due to the bot not being able to kick the member,
            // either due to missing permissions or role hierarchy
            message.reply('Kişiye tekme atamadım :(');
            // Log the error
            console.error(err);
          });
      } else {
        // The mentioned user isn't in this guild
        message.reply("Bu kişi bu sunucuda yok");
      }
      // Otherwise, if no user was mentioned
    } else {
      message.reply("Kullanıcıyı etiketlermisin :)");
    }
  }
});


client.on('message', message  => {
  if(message.content.toLowerCase() === prefix+"slots"){
    let topemojis = [' <:grapes_1f347:834803334883442729> <:grapes_1f347:834803334883442729> <:grapes_1f347:834803334883442729> ', '<:redapple_1f34e:834804073097723994> <:redapple_1f34e:834804073097723994> <:redapple_1f34e:834804073097723994>']
    let top = topemojis[Math.floor(Math.random * topemojis.length)]
    let midemojis = ['<:grapes_1f347:834803334883442729> <:grapes_1f347:834803334883442729> <:redapple_1f34e:834804073097723994>', '<:redapple_1f34e:834804073097723994> <:redapple_1f34e:834804073097723994> <:grapes_1f347:834803334883442729> ']
    let mid = midemojis[Math.floor(Math.random * topemojis.length)]
    let bottomemojis = ['<:tangerine_1f34a:834806935945347183> <:redapple_1f34e:834804073097723994> <:grapes_1f347:834803334883442729>', '<:grapes_1f347:834803334883442729> <:redapple_1f34e:834804073097723994> <:tangerine_1f34a:834806935945347183>']
    let bottom = bottomemojis[Math.floor(Math.random * topemojis.length)]

    let slotsTimeout = 5000
    let slots = db.fetch(`slots_${message.author.id}`)


    if(slots != null && slotsTimeout - (Date.now() - slots) > 0) {
      message.channel.send("Sen bu komutu önceden kullanmışşın 10 saniye bekle sonra kullan")




    }else{
      let emojis;
      let color;
      let amount = Math.floor(Math.random() * 450) - 225
      if(amount > 225) emojis = top
      if(amount < 226 && amount > 0) emojis = mid
      if( amount < 1) emojis = bottom
      if(amount > 0) color = ("GREEN")
      if(amount > 0) color = ("RED")

      let embed4 = new Discord.MessageEmbed()
      .setTitle('Slot Makinesi')
      .setColor(color)
      .setDescription(`Bu kadar kazandın ${amount}`)
      .addField('Döndürülüyor')
      
     
      message.channel.send(embed4)
      db.add(`money_${message.author.id}`, amount)
      db.set(`slots_${message.author.id}`, Date.now())


    }


  }



 })

 client.on("message", async message => {
  if (!message.guild) return;

  if (db.has(`sayac_${message.guild.id}`) === true) {
    if (db.fetch(`sayac_${message.guild.id}`) <= message.guild.members.cache.size) {
      const embed = new Discord.MessageEmbed()
        .setTitle(`Tebrikler ${message.guild.name}!`)
        .setDescription(`Başarıyla \`${db.fetch(`sayac_${message.guild.id}`)}\` kullanıcıya ulaştık! Sayaç sıfırlandı!`)
        .setColor("RANDOM");
      message.channel.send(embed);
      message.guild.owner.send(embed);
      db.delete(`sayac_${message.guild.id}`);
    }
  }
});
client.on("guildMemberRemove", async member => {
  const channel = db.fetch(`sKanal_${member.guild.id}`);
  if (db.has(`sayac_${member.guild.id}`) == false) return;
  if (db.has(`sKanal_${member.guild.id}`) == false) return;

    member.guild.channels.cache.get(channel).send(`**${member.user.tag}** Sunucudan ayrıldı! \`${db.fetch(`sayac_${member.guild.id}`)}\` üye olmamıza son \`${db.fetch(`sayac_${member.guild.id}`) - member.guild.memberCount}\` üye kaldı!`);
});
client.on("guildMemberAdd", async member => {
  const channel = db.fetch(`sKanal_${member.guild.id}`);
  if (db.has(`sayac_${member.guild.id}`) == false) return;
  if (db.has(`sKanal_${member.guild.id}`) == false) return;

    member.guild.channels.cache.get(channel).send(`**${member.user.tag}** Sunucuya Katıldı :tada:! \`${db.fetch(`sayac_${member.guild.id}`)}\` üye olmamıza son \`${db.fetch(`sayac_${member.guild.id}`) - member.guild.memberCount}\` üye kaldı!`);
});

client.on("message", async message => {
  if(message.author.bot || message.channel.type === "dm") return;


 
  let messageArray = message.content.split(" ")
  let args = messageArray.slice(1);

  let cmd = messageArray[0];

  if(cmd === prefix+"ban") {
      let toBan = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.slice(0).join(" ") || x.user.username === args[0]);

      if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Yetkin yok!") 
      if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send("Benim yetkiye ihtiyacım var!!") 

      const reason = args[1] || "sebeb yok!";

      toBan.ban({
          reason: reason
      })
      message.channel.send(`${toBan} Başarıyla banlandı \nSebeb: ${reason}`)
  }

  if(cmd === prefix+"unban") {
      let toBan = await client.users.fetch(args[0])

      if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Yetkin yok!") 
      if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send("Benim yetkiye ihtiyacım var!!") 

      const reason = args[1] || "Sebeb yok!";

      message.guild.members.unban(toBan, reason)

      message.channel.send(`${toBan} Başarıyla yasağı kaldırıldı`)
  }

})
client.on('message', message => {
  // If the message is "how to embed"
  if (message.content === prefix+'yapımcım') {
    // We can create embeds using the MessageEmbed constructor
    // Read more about all that you can do with the constructor
    // over at https://discord.js.org/#/docs/main/master/class/MessageEmbed
    const embed13 = new MessageEmbed()
      // Set the title of the field
      .setTitle('Yapımcım')
      // Set the color of the embed
      .setColor("RANDOM")
      // Set the main content of the embed
      .setDescription('Casperss#5593 Bu arkadaş benim yapımcım');

    message.channel.send(embed13);
  }
});
client.on('message', message => {

  if (message.content === prefix+'invite') {
  
    message.channel.send('https://discord.com/oauth2/authorize?client_id=828704130469724183&scope=bot&permissions=8');
  }
});

client.on('guildMemberAdd', async (member, guild, message) => {

  let role = await  db.fetch(`otorolisim_${member.guild.id}`)
   if (!otorol || otorol.toLowerCase() === 'yok') return;
  else {
   try {
  
    if (!i) return
  
    member.roles.add(member.guild.roles.cache.get(otorol))
                          .setDescription(`**Sunucuya Yeni Katılan** \`${member.user.tag}\` **Kullanıcısına** \`${role}\` **Rolü verildi.**`)
                          .setColor('0x36393E')
                          .setFooter(`Casperss bot otorol sistemi`)
       member.guild.channels.cache.get(i).send(embed)  } catch (e) {
   console.log(e)
  }
  }
  
  });
client.login(config.token);