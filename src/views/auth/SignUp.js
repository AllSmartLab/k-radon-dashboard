import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  makeStyles,
  Paper,
  Link,
  Divider,
  Grid
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: 600,
  },
  form: {
    width: '100%',
  },
  sectionTitle: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    fontWeight: 'bold',
  },
  submit: {
    margin: theme.spacing(4, 0, 2),
    padding: theme.spacing(1.5),
  },
  fileUploadButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  }
}));

const SignUp = () => {
  const classes = useStyles();
  const history = useHistory();
  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
    companyName: '',
    businessRegNum: '',
    representativeName: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    businessRegFile: null,
    taxEmail: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, businessRegFile: e.target.files[0] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate signup
    history.push('/');
  };

  return (
    <Container className={classes.container}>
      <Paper className={classes.paper} elevation={3}>
        <Typography component="h1" variant="h4" gutterBottom>
          회원가입
        </Typography>
        <Typography variant="body2" color="error" gutterBottom style={{ fontWeight: 'bold' }}>
          * 모든 정보는 필수 입력 항목입니다.
        </Typography>

        <form className={classes.form} onSubmit={handleSubmit}>
          {/* 로그인 정보 */}
          <Typography variant="h6" className={classes.sectionTitle} color="primary">로그인 정보</Typography>
          <Divider />
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField required fullWidth label="아이디" name="loginId" value={formData.loginId} onChange={handleChange} margin="normal" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth type="password" label="비밀번호" name="password" value={formData.password} onChange={handleChange} margin="normal" variant="outlined" />
            </Grid>
          </Grid>

          {/* 업체정보 */}
          <Typography variant="h6" className={classes.sectionTitle} color="primary">업체정보</Typography>
          <Divider />
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="업체명" name="companyName" value={formData.companyName} onChange={handleChange} margin="normal" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="사업자등록번호" name="businessRegNum" value={formData.businessRegNum} onChange={handleChange} margin="normal" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="대표자명" name="representativeName" value={formData.representativeName} onChange={handleChange} margin="normal" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="담당자명" name="contactName" value={formData.contactName} onChange={handleChange} margin="normal" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="담당자 연락처" name="contactPhone" value={formData.contactPhone} onChange={handleChange} margin="normal" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth type="email" label="담당자 E-mail" name="contactEmail" value={formData.contactEmail} onChange={handleChange} margin="normal" variant="outlined" />
            </Grid>
          </Grid>

          {/* 결제정보 */}
          <Typography variant="h6" className={classes.sectionTitle} color="primary">결제정보</Typography>
          <Divider />
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                color={formData.businessRegFile ? 'primary' : 'default'}
                className={classes.fileUploadButton}
              >
                {formData.businessRegFile ? `첨부됨: ${formData.businessRegFile.name}` : '사업자등록증 업로드 (필수)'}
                <input
                  type="file"
                  hidden
                  required
                  onChange={handleFileChange}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth type="email" label="세금계산서 수령용 E-mail" name="taxEmail" value={formData.taxEmail} onChange={handleChange} margin="normal" variant="outlined" />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            size="large"
          >
            가입하기
          </Button>
          <div style={{ textAlign: 'center' }}>
            <Link component="button" variant="body2" onClick={() => history.push('/')}>
              이미 계정이 있으신가요? 로그인
            </Link>
          </div>
        </form>
      </Paper>
    </Container>
  );
};

export default SignUp;
