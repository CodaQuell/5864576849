// Export a function that takes a client object as an argument
module.exports = (client) => {
  // Define a method on the client object to handle events
  client.handleEvents = async (eventFiles, path) => {
     // Loop through each event file
     for (const file of eventFiles) {
       // Require the event file
       const event = require(`../events/${file}`);
       // Check if the event should be handled once or continuously
       if (event.once) {
         // If the event should be handled once, use the 'once' method
         client.once(event.name, (...args) => event.execute(...args, client));
       } else {
         // If the event should be handled continuously, use the 'on' method
         client.on(event.name, (...args) => event.execute(...args, client));
       }
     }
  };
 };
 