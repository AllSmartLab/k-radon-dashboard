import React, { useState } from 'react';
import { AppBar, Toolbar, Tabs, Tab, makeStyles, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Button, Menu, MenuItem } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useHistory, useLocation } from 'react-router-dom';
import ftlabLogo from '../views/assets/ftlab_logo.png';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
  },
  appBar: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 2),
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    marginLeft: theme.spacing(1),
  },
  tabsContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  tabs: {
    minHeight: 48,
  },
  tab: {
    minWidth: 120,
    fontWeight: 'bold',
    fontSize: '1rem',
    margin: theme.spacing(0, 1),
    borderRadius: '20px',
    border: '1px solid transparent',
    '&.Mui-selected': {
      border: '1px solid #fff',
    },
  },
  indicator: {
    display: 'none', // Hide default indicator as we use border
  },
  userIconContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(4),
  },
  avatarButton: {
    backgroundColor: '#fff',
    color: '#000',
    width: 40,
    height: 40,
    fontSize: '0.8rem',
    fontWeight: 'bold',
    border: '1px solid #000',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    }
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    overflow: 'auto',
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

const AppLayout = ({ children }) => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const [userInfoOpen, setUserInfoOpen] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userInfo, setUserInfo] = useState({
    companyName: '주식회사 에프티랩',
    companyContact: '070-4906-4702',
    managerName: '관리자',
    managerContact: '010-0000-0000',
    managerEmail: 'example@mail.com',
    password: '',
    passwordConfirm: '',
    taxEmail: 'tax@company.com',
    businessRegistrationFile: '사업자등록증.pdf'
  });

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (event, newValue) => {
    history.push(newValue);
  };

  const handleLogoClick = () => {
    history.push('/main');
  };

  const handleUserClick = () => {
    setUserInfoOpen(true);
    setIsEditingUser(true);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserInfoFromMenu = () => {
    handleMenuClose();
    handleUserClick();
  };

  const handleLogout = () => {
    handleMenuClose();
    history.push('/signin');
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar} elevation={0}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.logoContainer} onClick={handleLogoClick}>
            <img src={ftlabLogo} alt="Radon FTLab" style={{ marginLeft: 16, height: 48, objectFit: 'contain', cursor: 'pointer' }} />
          </div>

          <div className={classes.tabsContainer}>
            <Tabs
              value={location.pathname === '/billing' ? '/billing' : '/main'}
              onChange={handleTabChange}
              className={classes.tabs}
              classes={{ indicator: classes.indicator }}
            >
              <Tab
                label="장비"
                value="/main"
                className={classes.tab}
                style={{ border: location.pathname === '/main' ? '1px solid #fff' : '1px solid transparent' }}
              />
              <Tab
                label="사용정보"
                value="/billing"
                className={classes.tab}
                style={{ border: location.pathname === '/billing' ? '1px solid #fff' : '1px solid transparent' }}
              />
            </Tabs>
          </div>

          <div className={classes.userIconContainer}>
            <Button
              onClick={handleMenuOpen}
              style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', textTransform: 'none' }}
              endIcon={<AccountCircleIcon />}
            >
              {userInfo.companyName}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleUserInfoFromMenu}>사용자 정보</MenuItem>
              <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      <main className={classes.content}>
        {children}
      </main>

      {/* 사용자 정보 모달 */}
      <Dialog
        open={userInfoOpen}
        onClose={() => { setUserInfoOpen(false); setIsEditingUser(false); }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle disableTypography className={classes.dialogHeader}>
          <Typography variant="h6" style={{ fontWeight: 'bold' }}>사용자 정보</Typography>
          <IconButton onClick={() => { setUserInfoOpen(false); setIsEditingUser(false); }} size="small" className={classes.closeIcon}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers style={{ overflowX: 'hidden' }}>
          <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: 16 }}>* 로그인 정보</Typography>
          <div style={{ paddingLeft: 8, marginBottom: 32 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={5} sm={4}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>- 비밀번호</Typography>
              </Grid>
              <Grid item xs={1} sm={1}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>:</Typography>
              </Grid>
              <Grid item xs={6} sm={7}>
                {isEditingUser ? (
                  <TextField size="small" type="password" name="password" placeholder="변경 시 입력" value={userInfo.password} onChange={handleUserInfoChange} fullWidth />
                ) : (
                  <Typography style={{ fontSize: '1rem' }}>********</Typography>
                )}
              </Grid>

              {isEditingUser && (
                <>
                  <Grid item xs={5} sm={4}>
                    <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>- 비밀번호 확인</Typography>
                  </Grid>
                  <Grid item xs={1} sm={1}>
                    <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>:</Typography>
                  </Grid>
                  <Grid item xs={6} sm={7}>
                    <TextField size="small" type="password" name="passwordConfirm" placeholder="한 번 더 입력" value={userInfo.passwordConfirm} onChange={handleUserInfoChange} fullWidth />
                  </Grid>
                </>
              )}
            </Grid>
          </div>

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
                {isEditingUser ? (
                  <TextField size="small" name="companyName" value={userInfo.companyName} onChange={handleUserInfoChange} fullWidth />
                ) : (
                  <Typography style={{ fontSize: '1rem' }}>{userInfo.companyName}</Typography>
                )}
              </Grid>

              <Grid item xs={5} sm={4}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>- 회사 대표 연락처</Typography>
              </Grid>
              <Grid item xs={1} sm={1}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>:</Typography>
              </Grid>
              <Grid item xs={6} sm={7}>
                {isEditingUser ? (
                  <TextField size="small" name="companyContact" value={userInfo.companyContact} onChange={handleUserInfoChange} fullWidth />
                ) : (
                  <Typography style={{ fontSize: '1rem' }}>{userInfo.companyContact}</Typography>
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
                {isEditingUser ? (
                  <TextField size="small" name="managerName" value={userInfo.managerName} onChange={handleUserInfoChange} fullWidth />
                ) : (
                  <Typography style={{ fontSize: '1rem' }}>{userInfo.managerName}</Typography>
                )}
              </Grid>

              <Grid item xs={5} sm={4}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>- 연락처</Typography>
              </Grid>
              <Grid item xs={1} sm={1}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>:</Typography>
              </Grid>
              <Grid item xs={6} sm={7}>
                {isEditingUser ? (
                  <TextField size="small" name="managerContact" value={userInfo.managerContact} onChange={handleUserInfoChange} fullWidth />
                ) : (
                  <Typography style={{ fontSize: '1rem' }}>{userInfo.managerContact}</Typography>
                )}
              </Grid>

              <Grid item xs={5} sm={4}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>- 이메일</Typography>
              </Grid>
              <Grid item xs={1} sm={1}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>:</Typography>
              </Grid>
              <Grid item xs={6} sm={7}>
                {isEditingUser ? (
                  <TextField size="small" name="managerEmail" value={userInfo.managerEmail} onChange={handleUserInfoChange} fullWidth />
                ) : (
                  <Typography style={{ fontSize: '1rem' }}>{userInfo.managerEmail}</Typography>
                )}
              </Grid>
            </Grid>
          </div>

          <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: 16 }}>* 결제 정보</Typography>

          <div style={{ paddingLeft: 8, marginBottom: 32 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={5} sm={4}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>- 사업자 등록증</Typography>
              </Grid>
              <Grid item xs={1} sm={1}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>:</Typography>
              </Grid>
              <Grid item xs={6} sm={7}>
                {isEditingUser ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Button variant="outlined" component="label" size="small" style={{ textTransform: 'none', whiteSpace: 'nowrap' }}>
                      파일 첨부
                      <input type="file" hidden />
                    </Button>
                    <Typography style={{ fontSize: '0.9rem', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {userInfo.businessRegistrationFile}
                    </Typography>
                  </div>
                ) : (
                  <Typography style={{ fontSize: '1rem' }}>{userInfo.businessRegistrationFile}</Typography>
                )}
              </Grid>

              <Grid item xs={5} sm={4}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>- 세금계산서 이메일</Typography>
              </Grid>
              <Grid item xs={1} sm={1}>
                <Typography style={{ fontWeight: 'bold', fontSize: '1rem' }}>:</Typography>
              </Grid>
              <Grid item xs={6} sm={7}>
                {isEditingUser ? (
                  <TextField size="small" name="taxEmail" value={userInfo.taxEmail} onChange={handleUserInfoChange} fullWidth />
                ) : (
                  <Typography style={{ fontSize: '1rem' }}>{userInfo.taxEmail}</Typography>
                )}
              </Grid>
            </Grid>
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            color="primary"
            variant={isEditingUser ? 'contained' : 'text'}
            onClick={() => setIsEditingUser(!isEditingUser)}
          >
            {isEditingUser ? '저장하기' : '수정하기'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AppLayout;
