const discord = require("discord.js");
const akaneko = require('akaneko');

module.exports = {
  name: "hentai",
  category: "nsfw",
  description: "NSFW Command",
     
  execute: async ({ Discord, client, message, args }) => { 
    
    if(message.channel.nsfw) {
      
      return message.channel.send(await akaneko.nsfw.hentai());

    } else {
    
      return message.channel.send("This channel dosen't support nsfw content")
      
    }
  }
}