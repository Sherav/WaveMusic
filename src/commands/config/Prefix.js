const ServerData = require('../../database/server.js');
const { Command } = require('../../structures/index.js');

class Prefix extends Command {
    constructor(client) {
        super(client, {
            name: 'prefix',
            description: {
                content: 'Shows the bot\'s prefix',
                examples: ['prefix set', 'prefix reset', 'prefix set !'],
                usage: 'prefix set, prefix reset, prefix set !',
            },
            category: 'general',
            aliases: ['prefix'],
            cooldown: 3,
            args: true,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: ['ManageGuild'],
            },
            slashCommand: true,
            options: [
                {
                    name: 'set',
                    description: 'Sets the prefix',
                    type: 1,
                    options: [
                        {
                            name: 'prefix',
                            description: 'The prefix you want to set',
                            type: 3,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'reset',
                    description: 'Resets the prefix to the default one',
                    type: 1,
                },
            ],
        });
    }
    async run(client, ctx, args) {
        const embed = client.embed().setColor(client.color.main);
        let prefix = await ServerData.get(ctx.guild.id);
        let subCommand;
        let pre;
        if (ctx.isInteraction) {
            subCommand = ctx.interaction.options.data[0].name;
            pre = ctx.interaction.options.data[0].options[0]?.value.toString();
        }
        else {
            subCommand = args[0];
            pre = args[1];
        }
        switch (subCommand) {
            case 'set':
                if (!pre) {
                    embed.setDescription(`The prefix for this server is \`${prefix ? prefix.prefix : client.config.prefix}\``);
                    return await ctx.sendMessage({ embeds: [embed] });
                }
                if (pre.length > 3)
                    return await ctx.sendMessage({
                        embeds: [
                            embed.setDescription(`The prefix can't be longer than 3 characters`),
                        ],
                    });
                if (!prefix) {
                    await ServerData.setPrefix(ctx.guild.id, pre);
                    prefix = await ServerData.get(ctx.guild.id);
                    return await ctx.sendMessage({
                        embeds: [
                            embed.setDescription(`The prefix for this server is now \`${prefix.prefix}\``),
                        ],
                    });
                }
                else {
                    await ServerData.setPrefix(ctx.guild.id, pre);
                    prefix = await ServerData.get(ctx.guild.id);
                    return await ctx.sendMessage({
                        embeds: [
                            embed.setDescription(`The prefix for this server is now \`${prefix.prefix}\``),
                        ],
                    });
                }
            case 'reset':
                if (!prefix)
                    return await ctx.sendMessage({
                        embeds: [
                            embed.setDescription(`The prefix for this server is \`${client.config.prefix}\``),
                        ],
                    });
                await ServerData.setPrefix(ctx.guild.id, client.config.prefix);
                prefix = await ServerData.get(ctx.guild.id);
                return await ctx.sendMessage({
                    embeds: [
                        embed.setDescription(`The prefix for this server is now \`${client.config.prefix}\``),
                    ],
                });
        }
    }
}

module.exports = Prefix;