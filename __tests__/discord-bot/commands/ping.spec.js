const ping = require('../../../src/discord-bot/commands/ping');

describe("test ping", () => {
    const message = {
        channel: {
            send: jest.fn(),
        },
    }
    it("test again", async () => {
        console.log(ping);
        ping.execute(message);
        expect(message.channel.send).toHaveBeenCalledWith("Pong.");
    })
});
