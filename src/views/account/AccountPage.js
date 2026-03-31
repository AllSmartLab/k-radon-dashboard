import React, { useState } from 'react';
import { 
  makeStyles, 
  Paper, 
  Typography, 
  Button, 
  TextField,
  Grid
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing(4),
    maxWidth: 600,
    width: '100%',
    borderRadius: 8,
    border: '1px solid #ccc',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(3),
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  submitContainer: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
  },
  button: {
    padding: theme.spacing(1, 4),
    fontWeight: 'bold',
  }
}));

const AccountPage = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    email: 'user@example.com',
    password: '',
    name: '홍길동',
    company: 'A회사',
    phone: '010-1234-5678',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('사용자 정보가 수정되었습니다.');
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={0}>
        <Typography variant="h5" className={classes.title}>사용자 정보 (수정)</Typography>
        
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>이메일</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                name="email"
                value={formData.email}
                disabled
              />
            </Grid>

            <Grid item xs={3}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>패스워드 (변경)</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                type="password"
                name="password"
                placeholder="변경할 패스워드를 입력하세요"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={3}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>이름</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={3}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>업체명(회사명)</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                name="company"
                value={formData.company}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={3}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>전화번호</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          
          <div className={classes.submitContainer}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              수정 사항 저장
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default AccountPage;
