import React, { useState, useEffect } from 'react';
import { 
  makeStyles, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  TextField,
  Box
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
  const [startCount, setStartCount] = useState(35);
  const [endCount, setEndCount] = useState(2857);

  useEffect(() => {
    // Load mock data on mount
    const simulatedData = generateRadonData();
    setData(simulatedData);
  }, []);

  const handleConnectToggle = () => {
    setIsConnected(!isConnected);
  };

  const currentAverage = calculateAverage(data);
  const currentMax = calculateMax(data);
  const status = evaluateStatus(currentAverage);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {/* Left Control Panel */}
        <Grid item xs={12} md={3}>
          <div className={classes.controlPanel}>
            <div className={classes.controlHeader}>
              연결 정보
            </div>
            
            <Box mb={2}>
              <Typography variant="subtitle2">* 미연결시 필요내용</Typography>
              <Typography variant="body2">- 연결상태: {isConnected ? '연결됨' : '미연결'}</Typography>
            </Box>

            {!isConnected && (
              <Box mb={2}>
                <Typography variant="body2" color="textSecondary">기기를 연결해주세요.</Typography>
              </Box>
            )}

            {isConnected && (
              <Box>
                <Typography variant="subtitle2">* 연결시 필요내용</Typography>
                <Typography variant="body2">- 연결상태: 다이렉트 연결</Typography>
                <Typography variant="body2">- Serial Number: FT00KK123456789</Typography>
                <Typography variant="body2">- F/W Ver: 1.0.0</Typography>
                <Typography variant="body2">- 배터리 상태: 85%</Typography>
                <Typography variant="body2">- 마지막 점검일자: 2026-03-31</Typography>
              </Box>
            )}
          </div>
        </Grid>

        {/* Center Main Chart Area */}
        <Grid item xs={12} md={7}>
          <div className={classes.countContainer}>
            <Typography variant="body2" style={{ fontWeight: 'bold' }}>Count No. 선택:</Typography>
            <TextField 
              size="small" 
              variant="outlined" 
              className={classes.countInput} 
              value={startCount}
              onChange={(e) => setStartCount(e.target.value)}
            />
            <Typography variant="body2">—</Typography>
            <TextField 
              size="small" 
              variant="outlined" 
              className={classes.countInput} 
              value={endCount}
              onChange={(e) => setEndCount(e.target.value)}
            />
          </div>

          <div className={classes.chartContainer}>
            <Typography variant="h5" align="center" gutterBottom style={{ fontWeight: 'bold' }}>
              측정 데이터 그래프
            </Typography>
            <Typography variant="caption" display="block" align="center" style={{ color: '#aaa', marginBottom: 16 }}>
              [제품 S/N: FT00KK123456789]
            </Typography>
            
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="level" stroke="#ab47bc" strokeWidth={3} dot={false} />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="count" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
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
            연결/연결해제
          </Button>
          <Button className={classes.actionButton}>
            Load Data
          </Button>
          <Button className={classes.actionButton}>
            Save Data
          </Button>
          <Button className={classes.actionButton}>
            Clear
          </Button>
          <Button className={classes.actionButton}>
            Set up
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default MainPage;
