module.exports = {
  // support HTTPS or not
  https: false,
  // allow log level -> 0: disable, 1 -> error, 2 -> debug, 3 -> info
  enableLog: 2,
  // allow automatically creating folder when init
  autoCreateFolder: true,
  // allow automatically clean tmp folder in period
  autoCleanTmp: false,
  // period for cleaning tmp folder: every 6 hours
  crontabCleanTmp: '0 0 */6 * * *',
  // login token expired time
  tokenLoginExpiredDays: '25 days',
  // temporal token (for reset password, verify email) expired time
  tokenTmpExpiredDays: '1 days',
  appName: process.env.name,
  port: process.env.NODE_PORT || 5000,
  apiUrl: process.env.API_ROOT_URL,
  webUrl: process.env.WEB_ROOT_URL,
  storageUrl: process.env.STORAGE_ROOT_URL,
  jwtAuthKey: 'fdhjfdfuejfkjdhfaueyruesfhjs',
  internalServerKey: 'fdhjfdfuejfkjiuhhhgtwckkusfhjs',
  sockIOAuthKey: 'fhskjfenfnhpploemjase',
  paths: {
    public: '/public',
    tmp: '/tmp',
    storage: '/mnt/storage/',
    docs: '/docs',
    jobs: '/app/jobs',
  },
  sendgridAPIKey: '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',
  emailSender: {
    email: 'binhnt@gemiso.com',
    name: 'IMAchive',
  },
  activeMQ: {
    host: '103.153.68.130',
    port: 61613,
    username: 'admin',
    password: 'admin',
  },
  timezone: 'Asia/Seoul',
  socialNetwork: {
    // OAuth 2.0
    facebook: {
      key: process.env.FACEBOOK_OAUTH_KEY || '',
      secret: process.env.FACEBOOK_OAUTH_SECRET || '',
      clientId: '',
    },
    google: {
      key: process.env.GOOGLE_OAUTH_KEY || '',
      secret: process.env.GOOGLE_OAUTH_SECRET || '',
      clientId: '',
    },
    naver: {
      key: process.env.NAVER_OAUTH_KEY || '',
      secret: process.env.NAVER_OAUTH_SECRET || '',
      clientId: '',
    },
    kakao: {
      key: process.env.KAKAO_OAUTH_KEY || '',
      secret: process.env.KAKAO_OAUTH_SECRET || '',
      clientId: '',
    },
    github: {
      key: process.env.GITHUB_OAUTH_KEY || '',
      secret: process.env.GITHUB_OAUTH_SECRET || '',
      clientId: '',
    },
    twitter: {
      key: process.env.TWITTER_OAUTH_KEY || '',
      secret: process.env.TWITTER_OAUTH_SECRET || '',
      clientId: '',
    },
    tumblr: {
      key: process.env.TUMBLR_OAUTH_KEY || '',
      secret: process.env.TUMBLR_OAUTH_SECRET || '',
      clientId: '',
    },
    instagram: {
      key: process.env.INSTAGRAM_OAUTH_KEY || '',
      secret: process.env.INSTAGRAM_OAUTH_SECRET || '',
      clientId: '',
    },
    linkedin: {
      key: process.env.LINKEDIN_OAUTH_KEY || '',
      secret: process.env.LINKEDIN_OAUTH_SECRET || '',
      clientId: '',
    },
  },
};
