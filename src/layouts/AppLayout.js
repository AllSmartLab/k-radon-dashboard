import React from 'react';
import { AppBar, Toolbar, Tabs, Tab, makeStyles, IconButton, Avatar, Typography } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

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
}));

const AppLayout = ({ children }) => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const handleTabChange = (event, newValue) => {
    history.push(newValue);
  };

  const handleLogoClick = () => {
    history.push('/main');
  };

  const handleUserClick = () => {
    history.push('/account');
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar} elevation={0}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.logoContainer} onClick={handleLogoClick}>
            {/* Placeholder logo */}
            <Typography variant="h6" className={classes.logoText}>
              Radon FTLab
            </Typography>
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
              {/* Optional Setting tab based on image */}
              <Tab 
                label="설정" 
                value="/settings" 
                className={classes.tab}
                style={{ border: location.pathname === '/settings' ? '1px solid #fff' : '1px solid transparent' }}
              />
            </Tabs>
          </div>

          <div className={classes.userIconContainer}>
            <IconButton onClick={handleUserClick} size="small">
              <Avatar className={classes.avatarButton}>사용자<br/>정보</Avatar>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <main className={classes.content}>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
