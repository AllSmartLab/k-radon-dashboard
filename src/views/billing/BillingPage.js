import React, { useState, useEffect } from 'react';
import { 
  makeStyles, 
  Paper, 
  Typography, 
  Button, 
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { generateBillingData } from '../../mocks/billingData';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    backgroundColor: '#fff',
    minHeight: '80vh',
    border: '1px solid #ccc',
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  inputYear: {
    width: 80,
    margin: theme.spacing(0, 1),
  },
  inputMonth: {
    width: 60,
    margin: theme.spacing(0, 1),
  },
  tableContainer: {
    marginTop: theme.spacing(4),
    border: '1px solid #ccc',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    '& th': {
      fontWeight: 'bold',
      textAlign: 'center',
      borderRight: '1px solid #ccc',
    }
  },
  tableCell: {
    textAlign: 'center',
    borderRight: '1px solid #ccc',
  },
  actionContainer: {
    marginTop: theme.spacing(3),
    display: 'flex',
    gap: theme.spacing(2),
  },
  button: {
    border: '1px solid #000',
    borderRadius: 8,
    padding: theme.spacing(1, 3),
    backgroundColor: '#fff',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    }
  },
  linkText: {
    color: 'blue',
    textDecoration: 'underline',
    cursor: 'pointer',
  }
}));

const BillingPage = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Modals state
  const [billingInfoOpen, setBillingInfoOpen] = useState(false);
  const [costDetailsOpen, setCostDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setData(generateBillingData());
  }, []);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(data.map(n => n.id));
      return;
    }
    setSelectedIds([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1),
      );
    }

    setSelectedIds(newSelected);
  };

  const handleCostClick = (item) => {
    setSelectedItem(item);
    setCostDetailsOpen(true);
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2} className={classes.filterContainer}>
        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle1" style={{ fontWeight: 'bold', marginRight: 16 }}>기간 설정</Typography>
          <TextField variant="outlined" size="small" className={classes.inputYear} /> <Typography>년</Typography>
          <TextField variant="outlined" size="small" className={classes.inputMonth} /> <Typography>월 -</Typography>
          <TextField variant="outlined" size="small" className={classes.inputYear} /> <Typography>년</Typography>
          <TextField variant="outlined" size="small" className={classes.inputMonth} /> <Typography>월</Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} className={classes.filterContainer}>
        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle1" style={{ fontWeight: 'bold', marginRight: 16 }}>검색(업체명)</Typography>
          <TextField variant="outlined" size="small" style={{ width: 250 }} />
          <SearchIcon style={{ marginLeft: 8, cursor: 'pointer' }} />
        </Grid>
      </Grid>

      <TableContainer className={classes.tableContainer}>
        <Table>
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell padding="checkbox" style={{ width: 50 }}>
                <Checkbox
                  indeterminate={selectedIds.length > 0 && selectedIds.length < data.length}
                  checked={data.length > 0 && selectedIds.length === data.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>사용연월</TableCell>
              <TableCell>과금비용</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => {
              const isSelected = selectedIds.indexOf(row.id) !== -1;
              return (
                <TableRow
                  hover
                  key={row.id}
                  selected={isSelected}
                >
                  <TableCell padding="checkbox" className={classes.tableCell}>
                    <Checkbox
                      color="primary"
                      checked={isSelected}
                      style={{ color: '#4caf50' }}
                      onChange={(event) => handleClick(event, row.id)}
                    />
                  </TableCell>
                  <TableCell className={classes.tableCell}>{row.usageDate}</TableCell>
                  <TableCell className={classes.tableCell}>
                    <span 
                      className={classes.linkText}
                      onClick={() => handleCostClick(row)}
                    >
                      {row.cost}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">데이터가 없습니다.</TableCell>
              </TableRow>
            )}
            {/* Empty rows to match mockup height */}
            <TableRow><TableCell className={classes.tableCell}>&nbsp;</TableCell><TableCell className={classes.tableCell}></TableCell><TableCell className={classes.tableCell}></TableCell></TableRow>
            <TableRow><TableCell className={classes.tableCell}>&nbsp;</TableCell><TableCell className={classes.tableCell}></TableCell><TableCell className={classes.tableCell}></TableCell></TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <div className={classes.actionContainer}>
        <Button className={classes.button}>
          견적서 출력
        </Button>
        <Button className={classes.button} onClick={() => setBillingInfoOpen(true)}>
          결제정보
        </Button>
      </div>

      {/* 결제정보 모달 */}
      <Dialog open={billingInfoOpen} onClose={() => setBillingInfoOpen(false)}>
        <DialogTitle>세금계산서 발행정보</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>고객의 세금계산서 발행정보 별도 팝업입니다.</Typography>
          <Typography variant="body2" color="textSecondary">
            - 사업자등록번호: 123-45-67890<br/>
            - 대표자명: 홍길동<br/>
            - 이메일: tax@example.com
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBillingInfoOpen(false)} color="primary">닫기</Button>
        </DialogActions>
      </Dialog>

      {/* 비용 세부내역 모달 */}
      <Dialog open={costDetailsOpen} onClose={() => setCostDetailsOpen(false)}>
        <DialogTitle>비용 세부 확인</DialogTitle>
        <DialogContent dividers>
          {selectedItem && (
            <>
              <Typography gutterBottom>사용연월: {selectedItem.usageDate}</Typography>
              <Typography gutterBottom>과금비용: {selectedItem.cost}</Typography>
              <Typography gutterBottom>세부내용: {selectedItem.details}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCostDetailsOpen(false)} color="primary">닫기</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BillingPage;
