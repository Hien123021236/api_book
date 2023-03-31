/**
 * Created by s3lab. on 1/17/2017.
 */
const BOOLEAN_ENUM = {
  TRUE: 1,
  FALSE: 0,
};

const STATUS_ENUM = {
  ENABLE: 1,
  DISABLE: 2,
  DELETED: 3,
};

const USER_TYPE_ENUM = {
  USER: 1,
  AGENT: 2,
  ADMIN: 3,
};


const DATA_TYPE_ENUM = {
  BOOLEAN: 1,
  STRING: 2,
  DATE: 3,
  INTEGER: 4,
  DECIMAL: 5,
  INTEGER_OPTIONS: 6,
  STRING_OPTIONS: 7,
};

const ACTION_ENUM = {
  VIEW: 'V',
  UPDATE: 'U',
  DELETE: 'D',
};

const PERMISSION_ENUM = {
  VIEW: 1,
  UPDATE: 2,
  CLONE: 4,
  DELETE: 8,
  DESTROY: 16,
  RESTORE: 32,
  CREATE: 64,
};

const LANGUAGE_ENUM = {
  KOREAN: 'ko',
  VIETNAMESE: 'vn',
  ENGLISH: 'en',
  JAPANESE: 'jn',
  CHINESE: 'cn',
};

const WARN_ENUM = {
  INFORMATION: 1,
  WARNING: 2,
  SERIOUS: 3,
  EMERGENT: 4,
};

const FILTER_OPERATOR_ENUM = {
  '=': 'eq',
  '!=': 'ne',
  '<': 'lt',
  '>': 'gt',
  '<=': 'lte',
  '>=': 'gte',
  'in': 'in',
  'between': 'between',
  'like': 'like',
};

const TASK_STATUS_ENUM = {
  CREATED: 'created',
  WAITING: 'waiting',
  INTIATING: 'Initiating',
  PROCESSING: 'processing',
  COMPLETE: 'complete',
  ERROR: 'error',
  CANCEL: 'cancel',
};

const LOGIN_METHOD_ENUM = {
  GOOGLE: 1,
  NAVER: 2,
  KAKAO: 3,
  FACEBOOK: 4,
  TRADITIONAL: 5,
};

const STORAGE_PROTOCOL_ENUM = {
  SAN: 'SAN',
  NAS: 'NAS',
  FTP: 'FTP',
  SMTP: 'SMPT',
};

const REPOSITORY_TYPE_ENUM = {
  STORAGE: 1,
  TAPE: 2,
  CLOUD: 3,
};

const JOB_TYPE_ENUM = {
  ARCHIVE: 'archive',
  RESTORE: 'restore',
  DELETE: 'delete',
  INVENTORY: 'inventory',
  TAPE_IN: 'tape_in',
  TAPE_OUT: 'tape_out',
};

const TASK_TYPE_ENUM = {
  MMA: 'MMA',
  MTM: 'MTM',
  ACTOR: 'actor',
  S3G: 's3g',
  LM: 'LM',
};

const MEDIA_TYPE_ENUM = {
  UNKNOW: 0,
  VIDEO: 1,
  AUDIO: 2,
  IMAGE: 3,
  TEXT: 4,
  ZIP: 5,
};

const CLOUD_PROTOCOL_ENUM = {
  S3G: 'S3G',
};

const WORKFLOW_NODE_TYPE = {
  RESPOSITORY: 1,
  ACTION: 2,
};

const JOB_STATUS_ENUM = {
  PROCESSING: 'processing',
  COMPLETE: 'complete',
  ERROR: 'error',
  CANCEL: 'cancel',
};

const TASK_SEND_METHOD_ENUM = {
  ACTIVEMQ: 1,
  SOCKETIO: 2,
};

const TAPE_STATUS_ENUM = {
  INSERTING: 'inserting',
  EJECTING: 'ejecting',
  READY: 'ready',
  UNREADY: 'unready',
};

const LIBIRARY_STATUS_ENUM = {
  CHECKING: 'checking',
  READY: 'ready',
  UNREADY: 'unready',
};

const PROMOTION_TYPE_ENUM = {
  VALUE: 1,
  PERCENT: 2,
};

const COUPON_TYPE_ENUM = {
  VALUE: 1,
  PERCENT: 2,
};

const ORDER_STATUS_ENUM={
  ORDERED: 1,
  CONFIRMED: 2,
  PAIED: 3,
};

module.exports = {
  STATUS_ENUM,
  LOGIN_METHOD_ENUM,
  TASK_STATUS_ENUM,
  USER_TYPE_ENUM,
  ACTION_ENUM,
  WARN_ENUM,
  LANGUAGE_ENUM,
  FILTER_OPERATOR_ENUM,
  DATA_TYPE_ENUM,
  BOOLEAN_ENUM,
  PERMISSION_ENUM,
  STORAGE_PROTOCOL_ENUM,
  CLOUD_PROTOCOL_ENUM,
  REPOSITORY_TYPE_ENUM,
  JOB_TYPE_ENUM,
  TASK_TYPE_ENUM,
  MEDIA_TYPE_ENUM,
  WORKFLOW_NODE_TYPE,
  JOB_STATUS_ENUM,
  TASK_SEND_METHOD_ENUM,
  TAPE_STATUS_ENUM,
  LIBIRARY_STATUS_ENUM,
  PROMOTION_TYPE_ENUM,
  COUPON_TYPE_ENUM,
  ORDER_STATUS_ENUM,
};
