export type SmsHostAddress = string;

export type SmsPacketSender = (packet: string) => Promise<string>;

export type SmsService = {
  sendPacket: SmsPacketSender;
};

// notice that it returns any as well. This is expected to be lost in the fill file as it's not relevant metadata.
export const buildRealSmsService = (
  smsHostAddress: SmsHostAddress,
): SmsService | any => ({
  sendPacket: (packet) => {
    console.log(`SMS packet sent to host [${smsHostAddress}]: ${packet}`);

    return Promise.resolve('Some SMS host response');
  },
});

export const buildFakeSmsService = (): SmsService => ({
  sendPacket: (packet) => {
    console.log(`Intercepted SMS to host: ${packet}`);

    return Promise.resolve('Some SMS host response');
  },
});
