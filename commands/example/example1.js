const handler = async (m, { conn }) => {

 return await conn.buttonV1(m.chat, {
    text: "Hello this is a button message",
    footer: "Click the button below",
    buttons: [
        { displayText: "Click Me", id: "=> ..." },
        { displayText: "Cancel", id: "=> ..." }
    ],
    image: "https://ibb.co/5XYVrQHv.jpg"
 });


};

handler.command = ['مثال1'];
export default handler;