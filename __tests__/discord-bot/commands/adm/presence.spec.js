const presence = require("../../../../src/discord-bot/commands/adm/presence");

describe("Presence", () => {
    const message = {
        channel: {
            send: jest.fn().mockResolvedValue({ 
                channel: {
                    send: jest.fn(),
                },
                awaitReactions: jest.fn().mockResolvedValue({})
            })
        },
        reply: jest.fn(),
    };

    it('correct args', async () => {
        const args = "test 0.15 test";
        await presence.execute(message, args);
        expect(message.channel.send).toHaveBeenCalledTimes(2);
        expect(message.channel.send).toHaveBeenNthCalledWith(1, "Work in progress.");
        expect(message.channel.send).toHaveBeenNthCalledWith(2, "REACT HERE WITH 👍 PLEASE");
    });
});
