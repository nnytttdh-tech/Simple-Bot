const handler = async (m, { conn }) => {

 return await conn.buttonV1(m.chat, {
    text: "Hello this is a button message",
    footer: "Click the button below",
    buttons: [
        { displayText: "صلي على النبي ", id: "" },
        { displayText: "Cancel", id: "https://whatsapp.com/channel/0029Vb6VF4R3bbUwgCtJlC3U" }
    ],
    image: "https://ibb.co/5XYVrQHv"
 });


};

handler.command = ['تست1'];
export default handler;