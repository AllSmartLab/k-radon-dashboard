import React, { useState, useEffect } from 'react';
import {
  makeStyles,

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
  Grid,
  IconButton,
  TableSortLabel
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
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
  },
  dialogHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
  closeIcon: {
    color: '#fff',
  }
}));

const BillingPage = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('usageDate');

  // Modals state
  const [billingInfoOpen, setBillingInfoOpen] = useState(false);
  const [sellerInfoOpen, setSellerInfoOpen] = useState(false);
  const [costDetailsOpen, setCostDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    companyName: '임시 업체명',
    companyContact: '010-0000-0000',
    managerName: '관리자',
    managerContact: '010-0000-0000',
    managerEmail: 'example@mail.com'
  });

  const handleBillingInfoChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({ ...prev, [name]: value }));
  };

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

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = [...data].sort((a, b) => {
    let aValue = a[orderBy];
    let bValue = b[orderBy];

    if (orderBy === 'cost') {
      aValue = parseInt(aValue.toString().replace(/[^0-9-]/g, ''), 10) || 0;
      bValue = parseInt(bValue.toString().replace(/[^0-9-]/g, ''), 10) || 0;
    }

    if (bValue < aValue) {
      return order === 'asc' ? 1 : -1;
    }
    if (bValue > aValue) {
      return order === 'asc' ? -1 : 1;
    }
    return 0;
  });

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
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'usageDate'}
                  direction={orderBy === 'usageDate' ? order : 'asc'}
                  onClick={() => handleRequestSort('usageDate')}
                >
                  사용연월
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'cost'}
                  direction={orderBy === 'cost' ? order : 'asc'}
                  onClick={() => handleRequestSort('cost')}
                >
                  과금비용
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row) => {
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
      <Dialog
        open={billingInfoOpen}
        onClose={() => { setBillingInfoOpen(false); setIsEditing(false); }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle disableTypography className={classes.dialogHeader}>
          <Typography variant="h6" style={{ fontWeight: 'bold' }}>결제정보</Typography>
          <IconButton onClick={() => { setBillingInfoOpen(false); setIsEditing(false); }} size="small" className={classes.closeIcon}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers style={{ overflowX: 'hidden' }}>
          <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: 16 }}>* 필요 정보</Typography>

          <div style={{ paddingLeft: 8, marginBottom: 32 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={5} sm={4}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>- 업체명</Typography>
              </Grid>
              <Grid item xs={1} sm={1}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>:</Typography>
              </Grid>
              <Grid item xs={6} sm={7}>
                {isEditing ? (
                  <TextField size="small" name="companyName" value={billingInfo.companyName} onChange={handleBillingInfoChange} fullWidth />
                ) : (
                  <Typography style={{ fontSize: '1rem' }}>{billingInfo.companyName}</Typography>
                )}
              </Grid>

              <Grid item xs={5} sm={4}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>- 회사 대표 연락처</Typography>
              </Grid>
              <Grid item xs={1} sm={1}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>:</Typography>
              </Grid>
              <Grid item xs={6} sm={7}>
                {isEditing ? (
                  <TextField size="small" name="companyContact" value={billingInfo.companyContact} onChange={handleBillingInfoChange} fullWidth />
                ) : (
                  <Typography style={{ fontSize: '1rem' }}>{billingInfo.companyContact}</Typography>
                )}
              </Grid>
            </Grid>
          </div>

          <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: 16 }}>*담당자 정보</Typography>

          <div style={{ paddingLeft: 8, marginBottom: 32 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={5} sm={4}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>- 담당자명</Typography>
              </Grid>
              <Grid item xs={1} sm={1}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>:</Typography>
              </Grid>
              <Grid item xs={6} sm={7}>
                {isEditing ? (
                  <TextField size="small" name="managerName" value={billingInfo.managerName} onChange={handleBillingInfoChange} fullWidth />
                ) : (
                  <Typography style={{ fontSize: '1rem' }}>{billingInfo.managerName}</Typography>
                )}
              </Grid>

              <Grid item xs={5} sm={4}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>- 연락처</Typography>
              </Grid>
              <Grid item xs={1} sm={1}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>:</Typography>
              </Grid>
              <Grid item xs={6} sm={7}>
                {isEditing ? (
                  <TextField size="small" name="managerContact" value={billingInfo.managerContact} onChange={handleBillingInfoChange} fullWidth />
                ) : (
                  <Typography style={{ fontSize: '1rem' }}>{billingInfo.managerContact}</Typography>
                )}
              </Grid>

              <Grid item xs={5} sm={4}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>- 이메일</Typography>
              </Grid>
              <Grid item xs={1} sm={1}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>:</Typography>
              </Grid>
              <Grid item xs={6} sm={7}>
                {isEditing ? (
                  <TextField size="small" name="managerEmail" value={billingInfo.managerEmail} onChange={handleBillingInfoChange} fullWidth />
                ) : (
                  <Typography style={{ fontSize: '1rem' }}>{billingInfo.managerEmail}</Typography>
                )}
              </Grid>
            </Grid>
          </div>
        </DialogContent>

        <DialogActions>
          <Button color="primary" disabled={isEditing} onClick={() => setSellerInfoOpen(true)}>
            판매자 정보보기
          </Button>
          <Button color="primary" disabled={isEditing}>
            사업자등록증 보기
          </Button>
          <Button
            color="primary"
            variant={isEditing ? 'contained' : 'text'}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? '저장하기' : '수정하기'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 판매자 정보 모달 */}
      <Dialog
        open={sellerInfoOpen}
        onClose={() => setSellerInfoOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle disableTypography className={classes.dialogHeader}>
          <Typography variant="h6" style={{ fontWeight: 'bold' }}>판매자 정보</Typography>
          <IconButton onClick={() => setSellerInfoOpen(false)} size="small" className={classes.closeIcon}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers style={{ overflowX: 'hidden' }}>
          <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: 16 }}>*필요 정보</Typography>

          <div style={{ paddingLeft: 8, marginBottom: 32 }}>
            <Grid container spacing={2}>
              <Grid item xs={3} sm={3}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>- 업체명</Typography>
              </Grid>
              <Grid item xs={8} sm={9}>
                <Typography style={{ fontSize: '1rem' }}> 주식회사 에프티랩</Typography>
              </Grid>

              <Grid item xs={3} sm={3}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>- 회사 대표 연락처</Typography>
              </Grid>
              <Grid item xs={8} sm={9}>
                <Typography style={{ fontSize: '1rem' }}>070-4906-4702</Typography>
              </Grid>

              <Grid item xs={3} sm={3}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>- 사업자번호</Typography>
              </Grid>
              <Grid item xs={8} sm={9}>
                <Typography style={{ fontSize: '1rem' }}>210-81-34708</Typography>
              </Grid>

              <Grid item xs={3} sm={3}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>- 결제계좌</Typography>
              </Grid>
              <Grid item xs={8} sm={9}>
                <Typography style={{ fontSize: '1rem' }}>기업은행 401-014501-04-015 [예금자명: (주)에프티랩]</Typography>
              </Grid>
            </Grid>
          </div>
        </DialogContent>

        <DialogActions>
          <Button color="primary">
            사업자등록증 보기
          </Button>
          <Button color="primary">
            통장사본 보기
          </Button>
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
