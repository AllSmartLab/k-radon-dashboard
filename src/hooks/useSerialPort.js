import { useState, useCallback, useRef } from 'react';
import { ProtocolParser, CMD } from './protocol';

/**
 * Web Serial API를 캡슐화하여 제공하는 Custom Hook
 * 다른 컴포넌트에서도 useSerialPort(onMessage) 형태로 쉽게 재사용할 수 있습니다.
 */
const useSerialPort = (onMessageReceived) => {
  const [port, setPort] = useState(null);
  const writerRef = useRef(null);
  const [isSerialConnected, setIsSerialConnected] = useState(false);
  const [error, setError] = useState(null);

  // 장비 정보 상태 관리
  const [deviceInfo, setDeviceInfo] = useState({
    sn: '-',
    version: '-',
    devType: '-',
    battery: '',
    lastCheck: ''
  });

  // 화면 출력용 통신 로그 관리
  const [serialLogs, setSerialLogs] = useState([]);
  const appendLog = useCallback((msg, isTx = false) => {
    const d = new Date();
    const timeStr = d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + String(d.getMilliseconds()).padStart(3, '0');
    const prefix = isTx ? '[TX]' : '[RX]';
    const logPrefix = isTx === null ? '[INFO]' : prefix;
    setSerialLogs(prev => [...prev, `${timeStr} ${logPrefix} ${msg}`]);
  }, []);
  const clearLogs = useCallback(() => setSerialLogs([]), []);

  const readerRef = useRef(null);
  const keepReadingRef = useRef(true);

  // Hex 문자열 변환기 (내부 로깅용)
  const toHexStr = (bytes) => Array.from(bytes).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');

  // Command Helper: 이름 찾기 (CMD 디버깅 및 로깅용)
  const getCmdName = useCallback((cmdValue) => {
    return Object.keys(CMD).find(key => CMD[key] === cmdValue) || `0x${cmdValue.toString(16).toUpperCase()}`;
  }, []);

  // 리더(Reader) 루프 동작
  const startReadLoop = useCallback(async (serialPort, _appendLog) => {
    // ProtocolParser 초기화 시 패킷 파싱 로직 연결
    const parser = new ProtocolParser((cmd, dataArray) => {
      const rxData = new Uint8Array(dataArray);
      const logMsg = `[${getCmdName(cmd)}] Receive: ` + toHexStr(rxData);
      console.log(logMsg);
      if (_appendLog) _appendLog(logMsg, false); // RX 로그

      switch (cmd) {
        case CMD.BASIC_INFOR_RETURN: { // 0x13
          let add = 0;
          const devType = rxData[add++];

          let sn = '';
          for (let i = 0; i < 12; i++) sn += String.fromCharCode(rxData[add++]);

          let version = '';
          for (let i = 0; i < 6; i++) version += String.fromCharCode(rxData[add++]);

          setDeviceInfo(prev => ({ ...prev, devType, sn, version }));
          break;
        }
        case CMD.RTC_RETURN: { // 0x31
          if (rxData.length >= 6) {
            let year = rxData[0] + 2000;
            let mon = rxData[1].toString().padStart(2, '0');
            let day = rxData[2].toString().padStart(2, '0');
            let hour = rxData[3].toString().padStart(2, '0');
            let min = rxData[4].toString().padStart(2, '0');
            let sec = rxData[5].toString().padStart(2, '0');
            
            const rtcTime = `${year}.${mon}.${day} ${hour}:${min}:${sec}`;
            // 파싱한 시간을 기기의 마지막 점검일자(RTC 시간)로 반영
            setDeviceInfo(prev => ({ ...prev, lastCheck: rtcTime }));
          }
          break;
        }
        // 기타 CMD 응답 처리 필요 시 추가
        default:
          break;
      }

      if (onMessageReceived) onMessageReceived(cmd, dataArray);
    });

    while (serialPort.readable && keepReadingRef.current) {
      readerRef.current = serialPort.readable.getReader();
      try {
        while (true) {
          const { value, done } = await readerRef.current.read();
          if (done) break;
          if (value) {
            parser.parse(value);
          }
        }
      } catch (error) {
        console.error("Serial Read Error:", error);
      } finally {
        if (readerRef.current) {
          readerRef.current.releaseLock();
          readerRef.current = null;
        }
      }
    }
  }, [getCmdName, onMessageReceived]);

  // 시리얼 포트 연결
  const connectSerial = useCallback(async (baudRate = 19200) => {
    try {
      if (!navigator.serial) {
        throw new Error("현재 브라우저 환경에서는 Web Serial API를 지원하지 않습니다. (Chrome/Edge 권장)");
      }

      // 사용자에게 포트 선택 창 띄우기
      const selectedPort = await navigator.serial.requestPort();
      await selectedPort.open({ baudRate });

      const portWriter = selectedPort.writable.getWriter();
      writerRef.current = portWriter;
      setPort(selectedPort);
      setIsSerialConnected(true);
      setError(null);

      // 데이터 수신을 위한 백그라운드 루프 실행
      keepReadingRef.current = true;
      startReadLoop(selectedPort, appendLog);

      appendLog("시리얼 포트 연결 성공", null);

      return selectedPort;
    } catch (err) {
      console.error("Serial connection error:", err);
      setError(err);
      throw err;
    }
  }, [appendLog, startReadLoop]);

  // 시리얼 포트 연결 해제
  const disconnectSerial = useCallback(async () => {
    if (port) {
      try {
        keepReadingRef.current = false;
        if (readerRef.current) {
          await readerRef.current.cancel();
        }
        if (writerRef.current) {
          writerRef.current.releaseLock();
          writerRef.current = null;
        }
        await port.close();
        appendLog("시리얼 연결 해제 완료", null);
      } catch (err) {
        console.error("Serial disconnect error:", err);
      }
      setPort(null);
      setIsSerialConnected(false);
    }
  }, [port, appendLog]);

  // 장비 통신: 데이터 발송 함수 (ProtocolParser.buildPacket 연동)
  const sendData = useCallback(async (cmd, data = []) => {
    if (!writerRef.current) {
      console.warn("Writer가 연결되지 않았거나 초기화되지 않았습니다.");
      return;
    }
    try {
      const packet = ProtocolParser.buildPacket(cmd, data);
      await writerRef.current.write(packet);
      const logMsg = `[${getCmdName(cmd)}] Send: ` + toHexStr(packet);
      console.log(logMsg);
      appendLog(logMsg, true); // TX 로그
    } catch (err) {
      console.error("Failed to send data:", err);
    }
  }, [appendLog, getCmdName]);

  return {
    port,
    isSerialConnected,
    connectSerial,
    disconnectSerial,
    sendData,
    CMD, // MainPage 등에서 CMD 열거형을 직접 쓸 수 있도록 내보냄
    deviceInfo,
    serialLogs,
    clearLogs,
    error
  };
};

export default useSerialPort;
