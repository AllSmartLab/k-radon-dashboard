import React, { useState, useEffect, useRef } from 'react';
import {
  makeStyles,
  Grid,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  Divider,
  Switch,
  FormControlLabel
} from '@material-ui/core';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { generateRadonData, calculateAverage, calculateMax, evaluateStatus } from '../../mocks/radonData';
import useSerialPort from '../../hooks/useSerialPort';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: '100%',
  },
  controlPanel: {
    padding: theme.spacing(2),
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    border: `2px solid #81C784`,
  },
  controlHeader: {
    backgroundColor: '#81C784',
    padding: theme.spacing(1),
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
    borderRadius: '4px 4px 0 0',
  },
  chartContainer: {
    padding: theme.spacing(2),
    height: 400,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    border: '1px solid #dee2e6',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  actionButton: {
    marginBottom: theme.spacing(1.5),
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    padding: theme.spacing(1),
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    }
  },
  summaryPanel: {
    marginTop: theme.spacing(2),
  },
  summaryField: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    border: '1px solid #ccc',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  summaryLabel: {
    fontWeight: 'bold',
    marginRight: theme.spacing(1),
    minWidth: 80,
  },
  countInput: {
    width: 60,
    margin: `0 ${theme.spacing(1)}px`,
  },
  countContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    border: '1px solid #ccc',
    borderRadius: 20,
    backgroundColor: '#fff',
    width: 'fit-content',
  },
  logContainer: {
    marginTop: theme.spacing(3),
    backgroundColor: '#1e1e1e',
    color: '#00ff00',
    padding: theme.spacing(2),
    borderRadius: 8,
    height: 250,
    overflowY: 'auto',
    fontFamily: 'Consolas, "Courier New", monospace',
    fontSize: '0.85rem',
    border: '1px solid #444'
  },
  logHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    borderBottom: '1px solid #333',
    paddingBottom: theme.spacing(1),
  },
  logTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logClearBtn: {
    color: '#ccc',
    borderColor: '#555',
    fontSize: '0.75rem',
    padding: '2px 8px',
    '&:hover': {
      backgroundColor: '#333'
    }
  }
}));

const MainPage = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isMockMode, setIsMockMode] = useState(true); // Mock 테스트 모드 스위치

  const { connectSerial, disconnectSerial, sendData, deviceInfo, serialLogs, clearLogs, CMD } = useSerialPort(); // 모듈 내에서 상태 및 로그 관리

  const logsEndRef = useRef(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [serialLogs]);

  const handleSetup = async () => {
    if (isConnected) {
      try {
        await sendData(CMD.RTC_QUERY, []);
      } catch (err) {
        console.error("Setup/RTC 요청 전송 오류:", err);
      }
    }
  };

  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [sections, setSections] = useState([
    { id: 1, dataCount: 156, userInfo: '거실 측정 데이터' },
    { id: 2, dataCount: 204, userInfo: '' },
    { id: 3, dataCount: 89, userInfo: '지하실 측정 데이터' },
  ]);

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    content: '',
    onConfirm: null,
  });

  const handleOpenSectionModal = () => setSectionModalOpen(true);
  const handleCloseSectionModal = () => setSectionModalOpen(false);

  const handleLoadData = (section) => {
    // 1건당 10원이라는 가정하에 요금 계산
    const cost = section.dataCount * 10;
    setConfirmDialog({
      open: true,
      title: '데이터 로드 확인',
      content: `데이터 로드 예상 요금은 ${cost.toLocaleString()}원 입니다. 데이터를 로드하시겠습니까?`,
      onConfirm: () => {
        setData(generateRadonData());
        setSectionModalOpen(false);
        setConfirmDialog(prev => ({ ...prev, open: false }));
      }
    });
  };

  const handleDeleteSection = (id) => {
    setConfirmDialog({
      open: true,
      title: '데이터 삭제 확인',
      content: '해당 Section을 삭제하시겠습니까?',
      onConfirm: () => {
        setSections(prevSections => prevSections.filter(sec => sec.id !== id));
        setConfirmDialog(prev => ({ ...prev, open: false }));
      }
    });
  };

  const handleConnectToggle = async () => {
    if (isConnected) {
      // 연결 해제 로직
      if (!isMockMode) {
        await disconnectSerial();
      }
      setIsConnected(false);
    } else {
      // 연결 로직
      if (isMockMode) {
        // 화면 디자인용 Mock Data 연결 모드
        setIsConnected(true);
      } else {
        // 실제 시리얼 포트 연결 (커스텀 훅 사용)
        try {
          await connectSerial(19200); // 보드레이트 장비 기준 적용
          setIsConnected(true);
          console.log("시리얼 모듈 연결 성공");

          // 연결 직후 기본 정보 요청 전송
          await sendData(CMD.BASIC_INFOR_QUERY, []);

        } catch (e) {
          alert(e.message || "시리얼 연결 과정에서 오류가 발생했거나 취소되었습니다.");
        }
      }
    }
  };

  const handleSaveData = () => {
    if (data.length === 0) {
      alert("저장할 데이터가 없습니다.");
      return;
    }
    const csvContent = [
      "Count,Radon Level",
      ...data.map(row => `${row.count},${row.level}`)
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `radon_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentAverage = data.length > 0 ? calculateAverage(data) : 0;
  const currentMax = data.length > 0 ? calculateMax(data) : 0;
  const status = data.length > 0 ? evaluateStatus(currentAverage) : '-';

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {/* Left Control Panel */}
        <Grid item xs={12} md={2}>
          <div className={classes.controlPanel}>
            <div className={classes.controlHeader}>
              연결 정보
            </div>

            <Box mb={2}>
              <Typography variant="body2">- 연결상태: {isConnected ? '연결됨' : '미연결'}</Typography>
            </Box>

            {!isConnected && (
              <Box mb={2}>
                <Typography variant="body2" color="textSecondary">기기를 연결해주세요.</Typography>
              </Box>
            )}

            {isConnected && (
              <Box>
                <Typography variant="body2">- Serial Number: {deviceInfo.sn}</Typography>
                <Typography variant="body2">- F/W Ver: {deviceInfo.version}</Typography>
                <Typography variant="body2">- Device Type: {deviceInfo.devType}</Typography>
                <Typography variant="body2">- 배터리 상태: {deviceInfo.battery}</Typography>
                <Typography variant="body2">- 마지막 점검일자: {deviceInfo.lastCheck}</Typography>
              </Box>
            )}
          </div>
        </Grid>

        {/* Center Main Chart Area */}
        <Grid item xs={12} md={8}>
          <div className={classes.chartContainer}>
            <Typography variant="h5" align="center" gutterBottom style={{ fontWeight: 'bold' }}>
              측정 데이터 그래프
            </Typography>
            <Typography variant="caption" display="block" align="center" style={{ color: '#aaa', marginBottom: 16 }}>
              [제품 S/N: FT00KK123456789]
            </Typography>

            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line type="monotone" dataKey="level" stroke="#ab47bc" strokeWidth={3} dot={false} />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
                  <XAxis dataKey="count" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280, color: '#999' }}>
                <Typography variant="body1">
                  Section 버튼을 클릭하여 데이터를 로드해주세요.
                </Typography>
              </div>
            )}
          </div>

          <div className={classes.summaryPanel}>
            <div className={classes.summaryField}>
              <span className={classes.summaryLabel}>측정결과:</span>
              <span>{status} {status === '개선권고' ? '(기준치 초과)' : ''}</span>
            </div>
            <div className={classes.summaryField}>
              <span className={classes.summaryLabel}>평균값</span>
              <span>{currentAverage}</span>
            </div>
            <div className={classes.summaryField}>
              <span className={classes.summaryLabel}>최고값</span>
              <span>{currentMax}</span>
            </div>
          </div>
        </Grid>

        {/* Right Action Buttons */}
        <Grid item xs={12} md={2}>
          <FormControlLabel
            control={
              <Switch
                checked={isMockMode}
                onChange={(e) => setIsMockMode(e.target.checked)}
                color="primary"
                disabled={isConnected}
              />
            }
            label={isMockMode ? "Mock 데이터" : "시리얼 통신"}
            style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}
          />
          <Button className={classes.actionButton} onClick={handleConnectToggle}>
            {isConnected ? '연결해제' : '연결'}
          </Button>
          <Button className={classes.actionButton} onClick={handleOpenSectionModal} disabled={!isConnected}>
            Section
          </Button>
          <Button className={classes.actionButton} disabled={!isConnected || data.length === 0} onClick={handleSaveData}>
            Save Data
          </Button>
          <Button className={classes.actionButton} disabled={!isConnected} onClick={handleSetup}>
            Set up
          </Button>
        </Grid>
      </Grid>

      {/* Serial Logs UI */}
      <div className={classes.logContainer}>
        <div className={classes.logHeader}>
          <Typography className={classes.logTitle}>통신 로그 (Serial Monitor)</Typography>
          <Button variant="outlined" className={classes.logClearBtn} onClick={clearLogs}>Clear</Button>
        </div>
        {serialLogs.map((log, index) => (
          <div key={index} style={{ marginBottom: 4 }}>{log}</div>
        ))}
        <div ref={logsEndRef} />
      </div>

      {/* Section Modal */}
      <Dialog open={sectionModalOpen} onClose={handleCloseSectionModal} maxWidth="sm" fullWidth>
        <DialogTitle>Section List</DialogTitle>
        <DialogContent dividers>
          {sections.length === 0 ? (
            <Typography align="center">저장된 Section이 없습니다.</Typography>
          ) : (
            <List disablePadding>
              {sections.map((section, index) => (
                <React.Fragment key={section.id}>
                  <ListItem style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, paddingBottom: 16 }}>
                    <div style={{ flex: 1, paddingRight: 16 }}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                        {index + 1}. {section.userInfo}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        저장된 데이터 수: {section.dataCount}개
                      </Typography>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleLoadData(section)}
                      >
                        데이터 로드
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => handleDeleteSection(section.id)}
                      >
                        데이터 삭제
                      </Button>
                    </div>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSectionModal} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))} color="primary">
            취소
          </Button>
          <Button onClick={confirmDialog.onConfirm} color="primary" variant="contained">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MainPage;
