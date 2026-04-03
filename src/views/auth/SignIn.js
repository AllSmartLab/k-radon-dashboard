import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  makeStyles,
  Paper,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignIn = () => {
  const classes = useStyles();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [findIdDialogOpen, setFindIdDialogOpen] = useState(false);
  const [findIdForm, setFindIdForm] = useState({ companyName: '', businessRegNum: '' });
  const [foundIdResult, setFoundIdResult] = useState(null);

  const [findPwDialogOpen, setFindPwDialogOpen] = useState(false);
  const [findPwForm, setFindPwForm] = useState({ loginId: '', companyName: '', businessRegNum: '' });
  const [isPwSent, setIsPwSent] = useState(false);

  const handleOpenFindId = (e) => {
    if (e) e.preventDefault();
    setFindIdForm({ companyName: '', businessRegNum: '' });
    setFoundIdResult(null);
    setFindIdDialogOpen(true);
  };

  const handleCloseFindId = () => {
    setFindIdDialogOpen(false);
  };

  const handleFindIdSubmit = (e) => {
    e.preventDefault();
    if (findIdForm.companyName && findIdForm.businessRegNum) {
      // Simulate finding ID
      setFoundIdResult({
        id: 'user123',
        email: 'user123@example.com'
      });
    }
  };

  const handleOpenFindPw = (e) => {
    if (e) e.preventDefault();
    setFindPwForm({ loginId: '', companyName: '', businessRegNum: '' });
    setIsPwSent(false);
    setFindPwDialogOpen(true);
  };

  const handleCloseFindPw = () => {
    setFindPwDialogOpen(false);
  };

  const handleFindPwSubmit = (e) => {
    e.preventDefault();
    if (findPwForm.loginId && findPwForm.companyName && findPwForm.businessRegNum) {
      // Simulate sending email
      setIsPwSent(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login
    history.push('/main');
  };

  return (
    <Container className={classes.container}>
      <Paper className={classes.paper} elevation={3}>
        <Typography component="h1" variant="h5">
          K-Radon Kit 로그인
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="이메일"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            label="비밀번호"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            로그인
          </Button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Link component="button" type="button" variant="body2" onClick={handleOpenFindId} style={{ marginRight: 16 }}>
                ID 찾기
              </Link>
              <Link component="button" type="button" variant="body2" onClick={handleOpenFindPw}>
                PW 찾기
              </Link>
            </div>
            <Link component="button" type="button" variant="body2" onClick={() => history.push('/signup')} style={{ fontWeight: 'bold' }}>
              회원가입
            </Link>
          </div>
        </form>
      </Paper>

      {/* Find ID Dialog */}
      <Dialog open={findIdDialogOpen} onClose={handleCloseFindId} maxWidth="xs" fullWidth>
        <DialogTitle>ID 찾기</DialogTitle>
        <DialogContent>
          {!foundIdResult ? (
            <form id="find-id-form" onSubmit={handleFindIdSubmit}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                가입 시 등록한 업체명과 사업자등록번호를 입력해주세요.
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                label="업체명"
                value={findIdForm.companyName}
                onChange={(e) => setFindIdForm({ ...findIdForm, companyName: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="사업자등록번호"
                value={findIdForm.businessRegNum}
                onChange={(e) => setFindIdForm({ ...findIdForm, businessRegNum: e.target.value })}
              />
            </form>
          ) : (
            <div>
              <Typography variant="body1" gutterBottom>
                고객님의 정보와 일치하는 계정입니다.
              </Typography>
              <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                <Typography variant="body2" style={{ marginBottom: 8 }}><strong>아이디:</strong> {foundIdResult.id}</Typography>
                <Typography variant="body2"><strong>이메일:</strong> {foundIdResult.email}</Typography>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFindId} color="primary">
            닫기
          </Button>
          {!foundIdResult && (
            <Button type="submit" form="find-id-form" color="primary" variant="contained">
              찾기
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Find PW Dialog */}
      <Dialog open={findPwDialogOpen} onClose={handleCloseFindPw} maxWidth="xs" fullWidth>
        <DialogTitle>PW 찾기</DialogTitle>
        <DialogContent>
          {!isPwSent ? (
            <form id="find-pw-form" onSubmit={handleFindPwSubmit}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                가입 시 등록한 아이디, 업체명, 사업자등록번호를 입력해주세요.
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                label="아이디"
                value={findPwForm.loginId}
                onChange={(e) => setFindPwForm({ ...findPwForm, loginId: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="업체명"
                value={findPwForm.companyName}
                onChange={(e) => setFindPwForm({ ...findPwForm, companyName: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="사업자등록번호"
                value={findPwForm.businessRegNum}
                onChange={(e) => setFindPwForm({ ...findPwForm, businessRegNum: e.target.value })}
              />
            </form>
          ) : (
            <div style={{ textAlign: 'center', margin: '32px 0' }}>
              <Typography variant="body1" gutterBottom color="primary" style={{ fontWeight: 'bold' }}>
                비밀번호 재설정 이메일 전송 완료
              </Typography>
              <Typography variant="body2" color="textSecondary">
                가입 시 등록된 이메일로<br />비밀번호 재설정 링크가 전송되었습니다.
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFindPw} color="primary">
            닫기
          </Button>
          {!isPwSent && (
            <Button type="submit" form="find-pw-form" color="primary" variant="contained">
              이메일 전송
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SignIn;
