class ProtocolParser {
    constructor(onMessageReceived) {
        this.CMD_STX = 0;
        this.CMD_CMD = 1;
        this.CMD_SIZE1 = 2;
        this.CMD_SIZE2 = 3;
        this.CMD_DATA = 4;
        this.CMD_CS = 5;

        this.rxState = this.CMD_STX;
        this.checksum = 0;
        this.dataSize = 0;
        this.rxDataCount = 0;
        this.rxBuf = new Uint8Array(4096);
        this.onMessageReceived = onMessageReceived; // callback(cmd, data)
    }

    parse(chunk) {
        // chunk is an ArrayBuffer or Uint8Array
        const bytes = new Uint8Array(chunk);
        for (let i = 0; i < bytes.length; i++) {
            this.processByte(bytes[i]);
        }
    }

    processByte(ch) {
        switch (this.rxState) {
            case this.CMD_STX:
                if (ch === 0x02) this.rxState = this.CMD_CMD;
                this.rxBuf[0] = ch;
                this.checksum = 0;
                break;
            case this.CMD_CMD:
                this.rxState = this.CMD_SIZE1;
                this.rxBuf[1] = ch;
                this.checksum = (this.checksum + ch) % 256;
                break;
            case this.CMD_SIZE1:
                this.rxState = this.CMD_SIZE2;
                this.rxBuf[2] = ch;
                this.dataSize = ch;
                this.checksum = (this.checksum + ch) % 256;
                break;
            case this.CMD_SIZE2:
                this.rxState = this.CMD_DATA;
                this.rxBuf[3] = ch;
                this.dataSize = this.dataSize + (ch * 256);
                this.rxDataCount = 0;
                this.checksum = (this.checksum + ch) % 256;
                if (this.dataSize === 0) this.rxState = this.CMD_CS;
                break;
            case this.CMD_DATA:
                this.rxBuf[4 + this.rxDataCount] = ch;
                this.rxDataCount++;
                this.checksum = (this.checksum + ch) % 256;
                if (this.rxDataCount >= this.dataSize) this.rxState = this.CMD_CS;
                break;
            case this.CMD_CS:
                this.rxState = this.CMD_STX;
                if (ch === (255 - this.checksum)) {
                    this.rxBuf[4 + this.rxDataCount] = ch;
                    // valid packet received
                    const cmd = this.rxBuf[1];
                    const data = this.rxBuf.slice(4, 4 + this.dataSize);
                    if (this.onMessageReceived) {
                        this.onMessageReceived(cmd, data);
                    }
                } else {
                    console.error(`Checksum mismatch. Expected ${255 - this.checksum}, got ${ch}`);
                }
                break;
        }
    }

    static buildPacket(cmd, dataArray = []) {
        const size = dataArray.length;
        const out = new Uint8Array(size + 5);
        let add = 0;
        out[add++] = 0x02; // STX
        out[add++] = cmd;
        out[add++] = size % 256;
        out[add++] = Math.floor(size / 256);
        for (let i = 0; i < size; i++) {
            out[add++] = dataArray[i];
        }

        // Calculate checksum over CMD + SIZE1 + SIZE2 + DATA
        let chksum = 0;
        for (let i = 1; i < add; i++) {
            chksum = (chksum + out[i]) % 256;
        }
        out[add++] = 255 - chksum;
        return out;
    }
}

// Commands Enum
const CMD = {
    RECEIVED_OK: 0x01,
    VALUE_QUERY: 0x10,
    VALUE_RETURN: 0x11,
    BASIC_INFOR_QUERY: 0x12,
    BASIC_INFOR_RETURN: 0x13,

    HEATER_INFOR_QUERY: 0x20,
    HEATER_INFOR_RETURN: 0x21,
    HEATER_SETUP: 0x22,

    RTC_QUERY: 0x30,
    RTC_RETURN: 0x31,
    RTC_SETUP: 0x32,

    LOG_INFOR_QUERY: 0x40,
    LOG_INFOR_RETURN: 0x41,
    LOG_SEND_QUERY: 0x42,
    LOG_SEND_RETURN: 0x43,
    LOG_CLEAR: 0x44,
    LOG_TYPE_SETUP: 0x45,
    LOG_SEND_ERROR: 0x46,

    USER_CFACTOR_QUERY: 0x61,
    USER_CFACTOR_RETURN: 0x61,
    USER_CFACTOR_SETUP: 0x60,

    SN_SETUP: 0xA0,
    MODEL_TYPE_SETUP: 0xA1,

    DFU_SETUP: 0xD0,

    BL_DATASIZE_SET: 0xF0,
    BL_DATASEND: 0xF1,
    BL_DATASEND_DONE: 0xF2,
    BL_DATASIZE_QUERY: 0xF3,
    CMD_RECEIVE_OK: 0xF4,
    BL_READY: 0xF5,

    BOOTLOADER_SET: 0xFB,
    BOOT_STATUS_QUERY: 0xFC,
    SYSTEM_RESET: 0xFD
};

export { ProtocolParser, CMD };
