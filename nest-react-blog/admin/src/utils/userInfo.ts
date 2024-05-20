export default function getUserKey(key?: string) {
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
  return key ? userInfo[key] : userInfo;
}
