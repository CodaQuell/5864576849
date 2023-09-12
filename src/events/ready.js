const { ActivityType } = require('discord.js');
const mongoose = require('mongoose')
const MONGODBURL = process.env.MONGODBURL;

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('Connected to Database!');
        console.log('Ready!');

        if (!MONGODBURL) return;

        mongoose.set('strictQuery', true);

        await mongoose.connect(MONGODBURL || '', {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        await client.user.setPresence({ 
            activities: [{ name: "Alto Testing", type: ActivityType.Watching}],
            status: "online"
        });


        async function pickPresence () {
            const option = Math.floor(Math.random() * statusArray.length);

            try {
                await client.user.setPresence({
                    activities: [
                        {
                            name: statusArray[option].content,
                            type: statusArray[option].type,

                        },
                    
                    ],

                    status: statusArray[option].status
                })
            } catch (error) {
                console.error(error);
            }
        
        }

        console.log('Running Alto Test Model')
    },
};