import React, { useState } from 'react';
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
  Divider
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
  }
}));

const MainPage = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

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

  const handleConnectToggle = () => {
    setIsConnected(!isConnected);
  };

  const handleSaveData = () => {
    if (data.length === 0) {
      alert("저장할 데이터가 없습니다.");
      return;
    }
    const csvContent = [
      "Count,Level",
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
                <Typography variant="body2">- Serial Number: FT00KK123456789</Typography>
                <Typography variant="body2">- F/W Ver: 1.0.0</Typography>
                <Typography variant="body2">- 배터리 상태: 85%</Typography>
                <Typography variant="body2">- 마지막 점검일자: 2026-03-31</Typography>
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
          <Button className={classes.actionButton} onClick={handleConnectToggle}>
            {isConnected ? '연결해제' : '연결'}
          </Button>
          <Button className={classes.actionButton} onClick={handleOpenSectionModal} disabled={!isConnected}>
            Section
          </Button>
          <Button className={classes.actionButton} disabled={!isConnected || data.length === 0} onClick={handleSaveData}>
            Save Data
          </Button>
          <Button className={classes.actionButton} disabled={!isConnected}>
            Set up
          </Button>
        </Grid>
      </Grid>

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
