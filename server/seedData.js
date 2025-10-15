const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const ChatRoom = require('./models/ChatRoom');
const Message = require('./models/Message');
const { generateBlockchainAddress } = require('./utils/blockchain');
const { encryptMessage } = require('./utils/encryption');
const { getGeoLocation } = require('./utils/geoLocation');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await ChatRoom.deleteMany({});
    await Message.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = [];

    // HQ Staff
    const hqStaff = new User({
      username: 'hq.admin',
      password: 'admin123',
      fullName: 'General Marcus Stone',
      role: 'hq_staff',
      rank: 'General',
      unit: 'HQ Command',
      blockchainAddress: generateBlockchainAddress().address,
      status: 'online'
    });
    await hqStaff.save();
    users.push(hqStaff);

    const hqStaff2 = new User({
      username: 'hq.sarah',
      password: 'admin123',
      fullName: 'Colonel Sarah Mitchell',
      role: 'hq_staff',
      rank: 'Colonel',
      unit: 'HQ Operations',
      blockchainAddress: generateBlockchainAddress().address,
      status: 'online'
    });
    await hqStaff2.save();
    users.push(hqStaff2);

    // Military Personnel
    const soldier1 = new User({
      username: 'soldier.john',
      password: 'soldier123',
      fullName: 'Sergeant John Davis',
      role: 'military_personnel',
      rank: 'Sergeant',
      unit: 'Alpha Squad',
      blockchainAddress: generateBlockchainAddress().address,
      status: 'online'
    });
    await soldier1.save();
    users.push(soldier1);

    const soldier2 = new User({
      username: 'captain.smith',
      password: 'captain123',
      fullName: 'Captain Robert Smith',
      role: 'military_personnel',
      rank: 'Captain',
      unit: 'Bravo Company',
      blockchainAddress: generateBlockchainAddress().address,
      status: 'online'
    });
    await soldier2.save();
    users.push(soldier2);

    const soldier3 = new User({
      username: 'lt.williams',
      password: 'soldier123',
      fullName: 'Lieutenant Emily Williams',
      role: 'military_personnel',
      rank: 'Lieutenant',
      unit: 'Charlie Platoon',
      blockchainAddress: generateBlockchainAddress().address,
      status: 'away'
    });
    await soldier3.save();
    users.push(soldier3);

    const soldier4 = new User({
      username: 'corporal.brown',
      password: 'soldier123',
      fullName: 'Corporal Michael Brown',
      role: 'military_personnel',
      rank: 'Corporal',
      unit: 'Delta Squad',
      blockchainAddress: generateBlockchainAddress().address,
      status: 'offline'
    });
    await soldier4.save();
    users.push(soldier4);

    // Family Members
    const family1 = new User({
      username: 'family.jane',
      password: 'family123',
      fullName: 'Jane Davis',
      role: 'family_member',
      unit: 'Family Network',
      blockchainAddress: generateBlockchainAddress().address,
      status: 'online'
    });
    await family1.save();
    users.push(family1);

    const family2 = new User({
      username: 'family.mary',
      password: 'family123',
      fullName: 'Mary Smith',
      role: 'family_member',
      unit: 'Family Network',
      blockchainAddress: generateBlockchainAddress().address,
      status: 'online'
    });
    await family2.save();
    users.push(family2);

    const family3 = new User({
      username: 'family.tom',
      password: 'family123',
      fullName: 'Tom Williams',
      role: 'family_member',
      unit: 'Family Network',
      blockchainAddress: generateBlockchainAddress().address,
      status: 'offline'
    });
    await family3.save();
    users.push(family3);

    console.log('Created users');

    // Create chat rooms
    const chatRooms = [];

    // Alpha Squad Group
    const alphaSquad = new ChatRoom({
      name: 'Alpha Squad Operations',
      type: 'group',
      participants: [hqStaff._id, soldier1._id, soldier2._id],
      admin: hqStaff._id,
      description: 'Tactical operations and mission briefings'
    });
    await alphaSquad.save();
    chatRooms.push(alphaSquad);

    // All Military Personnel
    const allMilitary = new ChatRoom({
      name: 'All Military Personnel',
      type: 'group',
      participants: [hqStaff._id, hqStaff2._id, soldier1._id, soldier2._id, soldier3._id, soldier4._id],
      admin: hqStaff._id,
      description: 'General announcements and updates'
    });
    await allMilitary.save();
    chatRooms.push(allMilitary);

    // Family Support Group
    const familySupport = new ChatRoom({
      name: 'Family Support Network',
      type: 'group',
      participants: [family1._id, family2._id, family3._id, soldier1._id, soldier2._id],
      admin: soldier1._id,
      description: 'Stay connected with loved ones'
    });
    await familySupport.save();
    chatRooms.push(familySupport);

    // Direct chat: John and Jane
    const directChat1 = new ChatRoom({
      name: 'John & Jane',
      type: 'direct',
      participants: [soldier1._id, family1._id],
      admin: soldier1._id
    });
    await directChat1.save();
    chatRooms.push(directChat1);

    // Direct chat: Captain Smith and Mary
    const directChat2 = new ChatRoom({
      name: 'Robert & Mary',
      type: 'direct',
      participants: [soldier2._id, family2._id],
      admin: soldier2._id
    });
    await directChat2.save();
    chatRooms.push(directChat2);

    // HQ Command Room
    const hqCommand = new ChatRoom({
      name: 'HQ Command Center',
      type: 'group',
      participants: [hqStaff._id, hqStaff2._id],
      admin: hqStaff._id,
      description: 'High-level strategic planning'
    });
    await hqCommand.save();
    chatRooms.push(hqCommand);

    console.log('Created chat rooms');

    // Create sample messages
    const messages = [];

    // Messages for Alpha Squad
    const alphaMessages = [
      { sender: hqStaff._id, content: 'Team, we have a new mission briefing at 0800 hours.', chatRoom: alphaSquad._id },
      { sender: soldier1._id, content: 'Roger that, sir. Alpha Squad ready for deployment.', chatRoom: alphaSquad._id },
      { sender: soldier2._id, content: 'Bravo Company standing by. Equipment check complete.', chatRoom: alphaSquad._id },
      { sender: hqStaff._id, content: 'Excellent. Mission parameters will be transmitted via secure channel.', chatRoom: alphaSquad._id }
    ];

    for (const msgData of alphaMessages) {
      const geoLocation = getGeoLocation();
      const message = new Message({
        sender: msgData.sender,
        content: msgData.content,
        encryptedContent: encryptMessage(msgData.content),
        chatRoom: msgData.chatRoom,
        messageType: 'text',
        geoLocation,
        vpnTunnel: {
          tunnelId: `VPN-${Math.random().toString(36).substr(2, 9)}`,
          encryptionLevel: 'AES-256',
          routedThrough: 'NATO-Secure-Gateway-5'
        },
        timestamp: new Date(Date.now() - Math.random() * 3600000)
      });
      await message.save();
      messages.push(message);
    }

    // Messages for All Military
    const allMilitaryMessages = [
      { sender: hqStaff2._id, content: 'All personnel: Security protocols have been updated. Please review the new guidelines.', chatRoom: allMilitary._id },
      { sender: soldier3._id, content: 'Acknowledged. Charlie Platoon has completed the security training.', chatRoom: allMilitary._id },
      { sender: soldier4._id, content: 'Delta Squad reporting in. All systems operational.', chatRoom: allMilitary._id }
    ];

    for (const msgData of allMilitaryMessages) {
      const geoLocation = getGeoLocation();
      const message = new Message({
        sender: msgData.sender,
        content: msgData.content,
        encryptedContent: encryptMessage(msgData.content),
        chatRoom: msgData.chatRoom,
        messageType: 'text',
        geoLocation,
        vpnTunnel: {
          tunnelId: `VPN-${Math.random().toString(36).substr(2, 9)}`,
          encryptionLevel: 'AES-256',
          routedThrough: 'US-East-Secure-Node-1'
        },
        timestamp: new Date(Date.now() - Math.random() * 7200000)
      });
      await message.save();
      messages.push(message);
    }

    // Messages for Family Support
    const familyMessages = [
      { sender: family1._id, content: 'Hi everyone! Hope you all are doing well. Stay safe! ❤️', chatRoom: familySupport._id },
      { sender: soldier1._id, content: 'Thanks Jane! Everything is good here. Miss you all.', chatRoom: familySupport._id },
      { sender: family2._id, content: 'Sending love and prayers to all our heroes! 🙏', chatRoom: familySupport._id },
      { sender: soldier2._id, content: 'Appreciate the support. It means everything to us.', chatRoom: familySupport._id }
    ];

    for (const msgData of familyMessages) {
      const geoLocation = getGeoLocation();
      const message = new Message({
        sender: msgData.sender,
        content: msgData.content,
        encryptedContent: encryptMessage(msgData.content),
        chatRoom: msgData.chatRoom,
        messageType: 'text',
        geoLocation,
        vpnTunnel: {
          tunnelId: `VPN-${Math.random().toString(36).substr(2, 9)}`,
          encryptionLevel: 'AES-256',
          routedThrough: 'EU-West-Military-Node-2'
        },
        timestamp: new Date(Date.now() - Math.random() * 10800000)
      });
      await message.save();
      messages.push(message);
    }

    // Direct messages
    const directMessages = [
      { sender: soldier1._id, content: 'Hey honey, just checking in. How are you and the kids?', chatRoom: directChat1._id },
      { sender: family1._id, content: 'We\'re all good! Kids miss you so much. When will you be home?', chatRoom: directChat1._id },
      { sender: soldier1._id, content: 'Should be back in a few weeks. Can\'t wait to see you all!', chatRoom: directChat1._id },
      { sender: soldier2._id, content: 'Mary, mission went well. Thinking of you.', chatRoom: directChat2._id },
      { sender: family2._id, content: 'So glad to hear! Stay safe out there. Love you! 💕', chatRoom: directChat2._id }
    ];

    for (const msgData of directMessages) {
      const geoLocation = getGeoLocation();
      const message = new Message({
        sender: msgData.sender,
        content: msgData.content,
        encryptedContent: encryptMessage(msgData.content),
        chatRoom: msgData.chatRoom,
        messageType: 'text',
        geoLocation,
        vpnTunnel: {
          tunnelId: `VPN-${Math.random().toString(36).substr(2, 9)}`,
          encryptionLevel: 'AES-256',
          routedThrough: 'Asia-Pacific-Secure-Node-3'
        },
        timestamp: new Date(Date.now() - Math.random() * 14400000)
      });
      await message.save();
      messages.push(message);
    }

    // Update chat rooms with last messages
    for (const chatRoom of chatRooms) {
      const lastMessage = messages
        .filter(m => m.chatRoom.toString() === chatRoom._id.toString())
        .sort((a, b) => b.timestamp - a.timestamp)[0];
      
      if (lastMessage) {
        chatRoom.lastMessage = lastMessage._id;
        chatRoom.updatedAt = lastMessage.timestamp;
        await chatRoom.save();
      }
    }

    console.log('Created sample messages');
    console.log('\n=== Seed Data Summary ===');
    console.log(`Users created: ${users.length}`);
    console.log(`Chat rooms created: ${chatRooms.length}`);
    console.log(`Messages created: ${messages.length}`);
    console.log('\n=== Login Credentials ===');
    console.log('HQ Staff: hq.admin / admin123');
    console.log('Military: soldier.john / soldier123');
    console.log('Family: family.jane / family123');
    console.log('\nDatabase seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
