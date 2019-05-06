import Swal from 'sweetalert2';

export const popupConfirm = (message) => {
  return Swal.fire({
    title: '?',
    text: message,
    type: 'info',
    confirmButtonText: 'OK',
    showCancelButton: true,
    showCloseButton: true
  })
}

export const formatDate = (dateString) => {
  const createDate = new Date(dateString);
  const now = new Date();

  // 刚刚(15分钟之内), 15分钟之前, 30分钟之前 1小时前, 2小时前，3小时前
  let duration = (now - createDate) / 1000  // 秒

  if (duration <= 15 * 60) { return '刚刚'; }
  if (duration <= 30 * 60 ) { return '15 分钟之前'; }
  if (duration <= 60 * 60 ) { return '30 分钟之前'; }
  if (duration <= 60 * 60 * 2 ) { return '1 小时之前'; }
  if (duration <= 60 * 60 * 3 ) { return '2 小时之前'; }
  if (duration <= 60 * 60 * 4 ) { return '3 小时之前'; }

  // 今天 17:22 昨天 15:22
  const createDateYear = createDate.getFullYear();
  const nowYear = now.getFullYear();
  const createDateMonth = createDate.getMonth();
  const nowMonth = now.getMonth();
  const createDateDay = createDate.getDate();
  const nowDay = now.getDate();

  if (nowYear === createDateYear) {
      if (nowDay - createDateDay === 0 && nowMonth === createDateMonth) {
        return `今天 ${createDate.getHours()}:${createDate.getMinutes()}`;
      }
      if (nowDay - createDateDay === 1 && nowMonth === createDateMonth) {
        return `昨天 ${createDate.getHours()}:${createDate.getMinutes()}`;
      }
      return `${createDateMonth + 1}月${createDateDay}日`;
  } else {
    return `${createDateYear}年${createDateMonth+ 1}月${createDateDay}日`;
  }
}